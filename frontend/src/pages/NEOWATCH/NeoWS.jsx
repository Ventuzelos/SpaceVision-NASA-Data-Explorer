import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Container from "../../components/common/Container/Container";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import NeoDateRangeFilter from "../../components/NeoWS/NeoDateRangeFilter/NeoDateRangeFilter";
import NeoStats from "../../components/NeoWS/NeoStats/NeoStats";
import NeoSortControl from "../../components/NeoWS/NeoSortControl/NeoSortControl";
import NeoCard from "../../components/NeoWS/NeoCard/NeoCard";
import NeoSkeleton from "../../components/NeoWS/NeoSkeleton/NeoSkeleton";
import Pagination from "../../components/common/Pagination/Pagination";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Toast from "../../components/common/Toast/Toast";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import useAuth from "../../hooks/useAuth";
import { usePagination } from "../../hooks/usePagination";

import {
  computeStats,
  fetchNeoFeed,
  getDefaultDateRange,
  MAX_RANGE_DAYS,
  sortByMissDistance,
} from "../../services/neowsService";

import {
  getFavorites,
  toggleFavorite,
} from "../../services/favoritesService";

import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./NeoWS.css";

const BennuViewer = lazy(() =>
  import(
    "../../components/NeoWS/BennuViewer/BennuViewer"
  )
);

const SOURCE = "neows";
const OBJECTS_PER_PAGE = 8;
const DAY_IN_MILLISECONDS =
  24 * 60 * 60 * 1000;

function parseDateTimestamp(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return null;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const timestamp = Date.UTC(
    year,
    month - 1,
    day
  );

  const date = new Date(timestamp);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !==
      month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return timestamp;
}

function validateDateRange(
  startDate,
  endDate,
  t
) {
  if (!startDate || !endDate) {
    return t(
      "neows.validation.requiredDates"
    );
  }

  const startTimestamp =
    parseDateTimestamp(startDate);

  const endTimestamp =
    parseDateTimestamp(endDate);

  if (
    startTimestamp === null ||
    endTimestamp === null
  ) {
    return t(
      "neows.validation.invalidRange"
    );
  }

  if (
    endTimestamp < startTimestamp
  ) {
    return t(
      "neows.validation.endBeforeStart"
    );
  }

  const differenceInDays =
    (endTimestamp -
      startTimestamp) /
    DAY_IN_MILLISECONDS;

  if (
    differenceInDays >
    MAX_RANGE_DAYS
  ) {
    return t(
      "neows.validation.maximumRange",
      {
        count: MAX_RANGE_DAYS,
      }
    );
  }

  return "";
}

function NeoWS() {
  const { t } = useTranslation();

  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const [
    isMobileViewer,
    setIsMobileViewer,
  ] = useState(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return false;
    }

    return window.matchMedia(
      "(max-width: 768px)"
    ).matches;
  });

  const [
    shouldLoadViewer,
    setShouldLoadViewer,
  ] = useState(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return true;
    }

    return !window.matchMedia(
      "(max-width: 768px)"
    ).matches;
  });

  const [dateRange] =
    useState(() =>
      getDefaultDateRange()
    );

  const [
    startDate,
    setStartDate,
  ] = useState(
    dateRange.startDate
  );

  const [
    endDate,
    setEndDate,
  ] = useState(
    dateRange.endDate
  );

  const [
    objects,
    setObjects,
  ] = useState([]);

  const [
    sortDirection,
    setSortDirection,
  ] = useState("asc");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    validationError,
    setValidationError,
  ] = useState("");

  const [
    favoriteKeys,
    setFavoriteKeys,
  ] = useState(
    () => new Set()
  );

  const [
    favoriteLoadingKeys,
    setFavoriteLoadingKeys,
  ] = useState(
    () => new Set()
  );

  const [
    toastMessage,
    setToastMessage,
  ] = useState("");

  const requestIdRef =
    useRef(0);

  const toastTimeoutRef =
    useRef(null);

  const stats = useMemo(
    () =>
      computeStats(objects),
    [objects]
  );

  const sortedObjects =
    useMemo(
      () =>
        sortByMissDistance(
          objects,
          sortDirection
        ),
      [
        objects,
        sortDirection,
      ]
    );

  const {
    paginatedItems:
      paginatedObjects,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(
    sortedObjects,
    OBJECTS_PER_PAGE
  );

  function showToast(message) {
    if (
      toastTimeoutRef.current
    ) {
      window.clearTimeout(
        toastTimeoutRef.current
      );
    }

    setToastMessage(message);

    toastTimeoutRef.current =
      window.setTimeout(() => {
        setToastMessage("");

        toastTimeoutRef.current =
          null;
      }, 2500);
  }

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return undefined;
    }

    const mediaQuery =
      window.matchMedia(
        "(max-width: 768px)"
      );

    function handleViewportChange(
      event
    ) {
      setIsMobileViewer(
        event.matches
      );

      if (!event.matches) {
        setShouldLoadViewer(
          true
        );
      }
    }

    mediaQuery.addEventListener(
      "change",
      handleViewportChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleViewportChange
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current
      ) {
        window.clearTimeout(
          toastTimeoutRef.current
        );
      }

      requestIdRef.current += 1;
    };
  }, []);

  const loadFeed = useCallback(
    async (start, end) => {
      const requestId =
        ++requestIdRef.current;

      setLoading(true);
      setError("");
      setObjects([]);

      try {
        const {
          objects: results,
        } = await fetchNeoFeed(
          start,
          end
        );

        if (
          requestIdRef.current !==
          requestId
        ) {
          return;
        }

        setObjects(
          Array.isArray(results)
            ? results
            : []
        );
      } catch (
        requestError
      ) {
        if (
          requestIdRef.current !==
          requestId
        ) {
          return;
        }

        console.error(
          "Error loading NeoWS objects:",
          requestError
        );

        setError(
          getApiErrorMessage(
            requestError,
            t(
              "neows.errors.loadFallback"
            )
          )
        );
      } finally {
        if (
          requestIdRef.current ===
          requestId
        ) {
          setLoading(false);
        }
      }
    },
    [t]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeed(
      dateRange.startDate,
      dateRange.endDate
    );
  }, [
    loadFeed,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  useEffect(() => {
    let isMounted = true;

    if (
      isAuthLoading ||
      !isAuthenticated
    ) {
      return undefined;
    }

    async function loadFavoriteKeys() {
      try {
        const favorites =
          await getFavorites(
            SOURCE,
            true
          );

        const keys =
          favorites
            .map(
              (favorite) =>
                favorite.nasa_id ??
                favorite.id
            )
            .filter(
              (value) =>
                value !== null &&
                value !==
                  undefined &&
                value !== ""
            )
            .map(String);

        if (isMounted) {
          setFavoriteKeys(
            new Set(keys)
          );
        }
      } catch (
        requestError
      ) {
        if (
          requestError.response
            ?.status !== 401
        ) {
          console.error(
            "Error loading NeoWS favourites:",
            requestError
          );
        }

        if (isMounted) {
          setFavoriteKeys(
            new Set()
          );
        }
      }
    }

    loadFavoriteKeys();

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    isAuthLoading,
  ]);

  function handleSearch(
    newStartDate =
      startDate,
    newEndDate =
      endDate
  ) {
    const dateError =
      validateDateRange(
        newStartDate,
        newEndDate,
        t
      );

    setValidationError(
      dateError
    );

    if (dateError) {
      return;
    }

    setStartDate(
      newStartDate
    );

    setEndDate(
      newEndDate
    );

    setPage(1);

    loadFeed(
      newStartDate,
      newEndDate
    );
  }

  async function handleToggleFavorite(
    neo
  ) {
    if (!isAuthenticated) {
      showToast(
        t(
          "neows.favorites.loginRequired"
        )
      );

      return;
    }

    if (
      neo?.id === null ||
      neo?.id === undefined ||
      neo?.id === ""
    ) {
      showToast(
        t(
          "neows.favorites.invalidObject"
        )
      );

      return;
    }

    const favoriteId =
      String(neo.id);

    if (
      favoriteLoadingKeys.has(
        favoriteId
      )
    ) {
      return;
    }

    setFavoriteLoadingKeys(
      (currentKeys) => {
        const nextKeys =
          new Set(
            currentKeys
          );

        nextKeys.add(
          favoriteId
        );

        return nextKeys;
      }
    );

    try {
      const rawNeo =
        neo.raw &&
        typeof neo.raw ===
          "object"
          ? neo.raw
          : neo;

      const approach =
        rawNeo
          .close_approach_data?.[0] ||
        neo
          .close_approach_data?.[0] ||
        null;

      const diameterKilometers =
        rawNeo
          .estimated_diameter
          ?.kilometers ||
        neo
          .estimated_diameter
          ?.kilometers ||
        null;

      const diameterMeters =
        rawNeo
          .estimated_diameter
          ?.meters ||
        neo
          .estimated_diameter
          ?.meters ||
        null;

      const missDistanceKm =
        neo.missDistanceKm ??
        neo.miss_distance_km ??
        approach?.miss_distance
          ?.kilometers ??
        null;

      const lunarDistance =
        neo.missDistanceLunar ??
        neo.lunarDistance ??
        neo.lunar_distance ??
        approach?.miss_distance
          ?.lunar ??
        null;

      const velocityKmH =
        neo.velocityKmH ??
        neo.velocity_km_h ??
        neo.relative_velocity_kmh ??
        approach
          ?.relative_velocity
          ?.kilometers_per_hour ??
        null;

      const diameterMinKm =
        neo.diameterMinKm ??
        neo.diameter_min_km ??
        diameterKilometers
          ?.estimated_diameter_min ??
        null;

      const diameterMaxKm =
        neo.diameterMaxKm ??
        neo.diameter_max_km ??
        diameterKilometers
          ?.estimated_diameter_max ??
        null;

      const diameterMinM =
        neo.diameterMinM ??
        neo.diameter_min_m ??
        diameterMeters
          ?.estimated_diameter_min ??
        (diameterMinKm !== null
          ? Number(
              diameterMinKm
            ) * 1000
          : null);

      const diameterMaxM =
        neo.diameterMaxM ??
        neo.diameter_max_m ??
        diameterMeters
          ?.estimated_diameter_max ??
        (diameterMaxKm !== null
          ? Number(
              diameterMaxKm
            ) * 1000
          : null);

      const jplUrl =
        neo.jplUrl ||
        neo.jpl_url ||
        neo.nasa_jpl_url ||
        rawNeo.nasa_jpl_url ||
        null;

      const closeApproachDate =
        neo.closeApproachDate ||
        neo.close_approach_date ||
        approach
          ?.close_approach_date_full ||
        approach
          ?.close_approach_date ||
        null;

      const isHazardous =
        neo.isHazardous ??
        neo
          .is_potentially_hazardous_asteroid ??
        rawNeo
          .is_potentially_hazardous_asteroid ??
        false;

      const defaultObjectTitle =
        t(
          "neows.object.defaultTitle"
        );

      const result =
        await toggleFavorite({
          nasa_type: SOURCE,
          nasa_id:
            favoriteId,

          title:
            neo.name ||
            rawNeo.name ||
            defaultObjectTitle,

          image_url: null,

          data: {
            ...neo,

            id:
              favoriteId,

            name:
              neo.name ||
              rawNeo.name ||
              defaultObjectTitle,

            raw: rawNeo,

            date:
              closeApproachDate,

            approach_date:
              closeApproachDate,

            close_approach_date:
              closeApproachDate,

            miss_distance_km:
              missDistanceKm,

            distance_km:
              missDistanceKm,

            missDistanceKm,

            lunar_distance:
              lunarDistance,

            miss_distance_lunar:
              lunarDistance,

            lunarDistance,

            relative_velocity_kmh:
              velocityKmH,

            velocity_km_h:
              velocityKmH,

            velocityKmH,

            estimated_diameter_min_m:
              diameterMinM,

            estimated_diameter_max_m:
              diameterMaxM,

            diameter_min_km:
              diameterMinKm,

            diameter_max_km:
              diameterMaxKm,

            diameterMinKm,
            diameterMaxKm,

            estimated_diameter:
              rawNeo
                .estimated_diameter ||
              neo
                .estimated_diameter || {
                kilometers: {
                  estimated_diameter_min:
                    diameterMinKm,

                  estimated_diameter_max:
                    diameterMaxKm,
                },

                meters: {
                  estimated_diameter_min:
                    diameterMinM,

                  estimated_diameter_max:
                    diameterMaxM,
                },
              },

            is_hazardous:
              isHazardous,

            isHazardous,

            is_potentially_hazardous_asteroid:
              isHazardous,

            risk: isHazardous
              ? t(
                  "neows.risk.high"
                )
              : t(
                  "neows.risk.low"
                ),

            link: jplUrl,
            jpl_url: jplUrl,
            nasa_jpl_url:
              jplUrl,
          },
        });

      setFavoriteKeys(
        (currentKeys) => {
          const nextKeys =
            new Set(
              currentKeys
            );

          if (
            result.isFavorite
          ) {
            nextKeys.add(
              favoriteId
            );
          } else {
            nextKeys.delete(
              favoriteId
            );
          }

          return nextKeys;
        }
      );

      showToast(
        result.isFavorite
          ? t(
              "neows.favorites.added"
            )
          : t(
              "neows.favorites.removed"
            )
      );
    } catch (
      requestError
    ) {
      console.error(
        "Error updating NeoWS favourite:",
        requestError
      );

      if (
        requestError.response
          ?.status === 401
      ) {
        showToast(
          t(
            "neows.favorites.loginRequired"
          )
        );
      } else {
        showToast(
          t(
            "neows.favorites.updateError"
          )
        );
      }
    } finally {
      setFavoriteLoadingKeys(
        (currentKeys) => {
          const nextKeys =
            new Set(
              currentKeys
            );

          nextKeys.delete(
            favoriteId
          );

          return nextKeys;
        }
      );
    }
  }

  return (
    <main className="neows-page">
      <PageMeta
        title={t(
          "neows.meta.title"
        )}
        description={t(
          "neows.meta.description"
        )}
      />

      <Container>
        <header className="neows-page__header">
          <div className="neows-page__intro">
            <Breadcrumb
              title={t(
                "neows.header.breadcrumb"
              )}
            />

            <span className="neows-page__eyebrow">
              {t(
                "neows.header.eyebrow"
              )}
            </span>

            <h1>
              {t(
                "neows.header.title"
              )}
            </h1>

            <p>
              {t(
                "neows.header.description"
              )}
            </p>
          </div>

          <div className="neows-page__viewer">
            {shouldLoadViewer ? (
              <Suspense
                fallback={
                  <div
                    className="bennu-viewer-loading"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <div
                      className="bennu-viewer-loading__spinner"
                      aria-hidden="true"
                    />

                    <p>
                      {t(
                        "neows.viewer.loading"
                      )}
                    </p>
                  </div>
                }
              >
                <BennuViewer />
              </Suspense>
            ) : (
              <div className="bennu-viewer-placeholder">
                <div className="bennu-viewer-placeholder__content">
                  <span
                    className="bennu-viewer-placeholder__eyebrow"
                    aria-hidden="true"
                  >
                    3D
                  </span>

                  <h2>
                    {t(
                      "neows.viewer.title"
                    )}
                  </h2>

                  <p>
                    {t(
                      "neows.viewer.description"
                    )}
                  </p>

                  <button
                    type="button"
                    className="bennu-viewer-placeholder__button"
                    onClick={() =>
                      setShouldLoadViewer(
                        true
                      )
                    }
                  >
                    {t(
                      "neows.viewer.loadButton"
                    )}
                  </button>

                  {isMobileViewer && (
                    <small>
                      {t(
                        "neows.viewer.mobileNote"
                      )}
                    </small>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <NeoDateRangeFilter
          startDate={
            startDate
          }
          endDate={
            endDate
          }
          onStartDateChange={(
            value
          ) => {
            setStartDate(
              value
            );

            setValidationError(
              ""
            );
          }}
          onEndDateChange={(
            value
          ) => {
            setEndDate(
              value
            );

            setValidationError(
              ""
            );
          }}
          onSearch={
            handleSearch
          }
          loading={
            loading
          }
        />

        {validationError && (
          <p
            className="neows-page__validation-error"
            role="alert"
          >
            {validationError}
          </p>
        )}

        <NeoStats
          stats={stats}
          loading={loading}
        />

        {error &&
          !loading && (
            <ErrorState
              title={t(
                "neows.errors.title"
              )}
              message={error}
              onRetry={() =>
                handleSearch(
                  startDate,
                  endDate
                )
              }
            />
          )}

        {!loading &&
          !error &&
          objects.length ===
            0 && (
            <div
              className="neows-page__empty"
              role="status"
            >
              <h2>
                {t(
                  "neows.empty.title"
                )}
              </h2>

              <p>
                {t(
                  "neows.empty.description"
                )}
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          objects.length >
            0 && (
            <NeoSortControl
              direction={
                sortDirection
              }
              onChange={(
                direction
              ) => {
                setSortDirection(
                  direction
                );

                setPage(1);
              }}
              count={
                objects.length
              }
            />
          )}

        {(loading ||
          (!error &&
            objects.length >
              0)) && (
          <section
            className="neows-page__list-panel"
            aria-label={t(
              "neows.list.ariaLabel"
            )}
            aria-busy={loading}
          >
            <div className="neows-page__grid">
              {loading &&
                Array.from({
                  length: 6,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <NeoSkeleton
                      key={
                        index
                      }
                    />
                  )
                )}

              {!loading &&
                !error &&
                paginatedObjects.map(
                  (neo) => {
                    const favoriteId =
                      String(
                        neo.id
                      );

                    return (
                      <NeoCard
                        key={
                          favoriteId
                        }
                        neo={neo}
                        isFavorite={
                          isAuthenticated &&
                          favoriteKeys.has(
                            favoriteId
                          )
                        }
                        isFavoriteLoading={
                          favoriteLoadingKeys.has(
                            favoriteId
                          )
                        }
                        onToggleFavorite={
                          handleToggleFavorite
                        }
                      />
                    );
                  }
                )}
            </div>
          </section>
        )}

        {!loading &&
          !error &&
          shouldShowPagination && (
            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={
                setPage
              }
            />
          )}
      </Container>

      <Toast
        message={
          toastMessage
        }
      />
    </main>
  );
}

export default NeoWS;