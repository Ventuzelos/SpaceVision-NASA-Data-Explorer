import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

import { usePagination } from "../../hooks/usePagination";
import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./NeoWS.css";

const BennuViewer = lazy(() =>
  import(
    "../../components/NeoWS/BennuViewer/BennuViewer"
  )
);

const SOURCE = "neows";
const OBJECTS_PER_PAGE = 8;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return "Seleciona uma data inicial e uma data final.";
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return "O intervalo de datas não é válido.";
  }

  if (end < start) {
    return "A data final não pode ser anterior à data inicial.";
  }

  const differenceInDays =
    (end.getTime() - start.getTime()) /
    DAY_IN_MILLISECONDS;

  if (differenceInDays > MAX_RANGE_DAYS) {
    return `O intervalo máximo permitido é de ${MAX_RANGE_DAYS} dias.`;
  }

  return "";
}

function NeoWS() {
  const [dateRange] = useState(() =>
    getDefaultDateRange()
  );

  const [startDate, setStartDate] = useState(
    dateRange.startDate
  );

  const [endDate, setEndDate] = useState(
    dateRange.endDate
  );

  const [objects, setObjects] = useState([]);

  const [sortDirection, setSortDirection] =
    useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [validationError, setValidationError] =
    useState("");

  const [favoriteKeys, setFavoriteKeys] = useState(
    () => new Set()
  );

  const [
    favoriteLoadingKeys,
    setFavoriteLoadingKeys,
  ] = useState(() => new Set());

  const [toastMessage, setToastMessage] =
    useState("");

  const stats = computeStats(objects);

  const sortedObjects = sortByMissDistance(
    objects,
    sortDirection
  );

  const {
    paginatedItems: paginatedObjects,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(
    sortedObjects,
    OBJECTS_PER_PAGE
  );

  function showToast(message) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  const requestIdRef = useRef(0);

  const loadFeed = useCallback(
    async (start, end) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError("");
      setObjects([]);

      try {
        const { objects: results } =
          await fetchNeoFeed(start, end);

        if (requestIdRef.current !== requestId) {
          return;
        }

        setObjects(
          Array.isArray(results) ? results : []
        );
      } catch (requestError) {
        if (requestIdRef.current !== requestId) {
          return;
        }

        console.error(
          "Erro ao carregar objetos NeoWS:",
          requestError
        );

        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível carregar os objetos próximos da Terra."
          )
        );
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    []
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

    async function loadFavoriteKeys() {
      try {
        const favorites = await getFavorites(
          SOURCE,
          true
        );

        const keys = favorites.map((favorite) =>
          String(
            favorite.nasa_id ||
            favorite.id
          )
        );

        if (isMounted) {
          setFavoriteKeys(new Set(keys));
        }
      } catch (requestError) {
        console.error(
          "Erro ao carregar favoritos NeoWatch:",
          requestError
        );

        if (isMounted) {
          setFavoriteKeys(new Set());
        }
      }
    }

    loadFavoriteKeys();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSearch(
    newStartDate = startDate,
    newEndDate = endDate
  ) {
    const dateError = validateDateRange(
      newStartDate,
      newEndDate
    );

    setValidationError(dateError);

    if (dateError) {
      return;
    }

    setPage(1);
    loadFeed(newStartDate, newEndDate);
  }

  async function handleToggleFavorite(neo) {
    const favoriteId = String(neo.id);

    if (favoriteLoadingKeys.has(favoriteId)) {
      return;
    }

    setFavoriteLoadingKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);
      nextKeys.add(favoriteId);

      return nextKeys;
    });

    try {
      const rawNeo =
        neo.raw &&
          typeof neo.raw === "object"
          ? neo.raw
          : neo;

      const approach =
        rawNeo.close_approach_data?.[0] ||
        neo.close_approach_data?.[0] ||
        null;

      const diameterKilometers =
        rawNeo.estimated_diameter?.kilometers ||
        neo.estimated_diameter?.kilometers ||
        null;

      const diameterMeters =
        rawNeo.estimated_diameter?.meters ||
        neo.estimated_diameter?.meters ||
        null;

      const missDistanceKm =
        neo.missDistanceKm ||
        neo.miss_distance_km ||
        approach?.miss_distance?.kilometers ||
        null;

      const lunarDistance =
        neo.missDistanceLunar ||
        neo.lunarDistance ||
        neo.lunar_distance ||
        approach?.miss_distance?.lunar ||
        null;

      const velocityKmH =
        neo.velocityKmH ||
        neo.velocity_km_h ||
        neo.relative_velocity_kmh ||
        approach?.relative_velocity
          ?.kilometers_per_hour ||
        null;

      const diameterMinKm =
        neo.diameterMinKm ||
        neo.diameter_min_km ||
        diameterKilometers
          ?.estimated_diameter_min ||
        null;

      const diameterMaxKm =
        neo.diameterMaxKm ||
        neo.diameter_max_km ||
        diameterKilometers
          ?.estimated_diameter_max ||
        null;

      const diameterMinM =
        neo.diameterMinM ||
        neo.diameter_min_m ||
        diameterMeters
          ?.estimated_diameter_min ||
        (diameterMinKm !== null
          ? Number(diameterMinKm) * 1000
          : null);

      const diameterMaxM =
        neo.diameterMaxM ||
        neo.diameter_max_m ||
        diameterMeters
          ?.estimated_diameter_max ||
        (diameterMaxKm !== null
          ? Number(diameterMaxKm) * 1000
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
        approach?.close_approach_date_full ||
        approach?.close_approach_date ||
        null;

      const isHazardous =
        neo.isHazardous ??
        neo.is_potentially_hazardous_asteroid ??
        rawNeo.is_potentially_hazardous_asteroid ??
        false;

      const result = await toggleFavorite({
        nasa_type: SOURCE,
        nasa_id: favoriteId,
        title:
          neo.name ||
          rawNeo.name ||
          "Objeto próximo da Terra",
        image_url: null,

        data: {
          ...neo,

          id: favoriteId,

          name:
            neo.name ||
            rawNeo.name ||
            "Objeto próximo da Terra",

          raw: rawNeo,

          date: closeApproachDate,
          approach_date: closeApproachDate,
          close_approach_date:
            closeApproachDate,

          miss_distance_km: missDistanceKm,
          distance_km: missDistanceKm,
          missDistanceKm,

          lunar_distance: lunarDistance,
          miss_distance_lunar:
            lunarDistance,
          lunarDistance,

          relative_velocity_kmh:
            velocityKmH,
          velocity_km_h: velocityKmH,
          velocityKmH,

          estimated_diameter_min_m:
            diameterMinM,
          estimated_diameter_max_m:
            diameterMaxM,

          diameter_min_km: diameterMinKm,
          diameter_max_km: diameterMaxKm,
          diameterMinKm,
          diameterMaxKm,

          estimated_diameter:
            rawNeo.estimated_diameter ||
            neo.estimated_diameter ||
            {
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

          is_hazardous: isHazardous,
          isHazardous,

          is_potentially_hazardous_asteroid:
            isHazardous,

          risk: isHazardous
            ? "Elevado"
            : "Baixo",

          link: jplUrl,
          jpl_url: jplUrl,
          nasa_jpl_url: jplUrl,
        },
      });

      setFavoriteKeys((currentKeys) => {
        const nextKeys = new Set(currentKeys);

        if (result.isFavorite) {
          nextKeys.add(favoriteId);
        } else {
          nextKeys.delete(favoriteId);
        }

        return nextKeys;
      });

      showToast(
        result.isFavorite
          ? "Adicionado aos favoritos"
          : "Removido dos favoritos"
      );
    } catch (requestError) {
      console.error(
        "Erro ao atualizar favorito NeoWatch:",
        requestError
      );

      if (
        requestError.response?.status === 401
      ) {
        showToast(
          "Precisas de iniciar sessão para guardar favoritos"
        );
      } else {
        showToast(
          "Não foi possível atualizar o favorito"
        );
      }
    } finally {
      setFavoriteLoadingKeys((currentKeys) => {
        const nextKeys = new Set(currentKeys);
        nextKeys.delete(favoriteId);

        return nextKeys;
      });
    }
  }

   return (
    <main className="neows-page">
      <PageMeta
        title="NeoWatch"
        description="Consulta asteroides e cometas próximos da Terra monitorizados pela NASA."
      />

      <Container>
        <header className="neows-page__header">
          <div className="neows-page__intro">
            <Breadcrumb title="NeoWatch" />

            <span className="neows-page__eyebrow">
              NeoWs · Near-Earth Objects
            </span>

            <h1>Objetos próximos da Terra</h1>

            <p>
              Consulta asteroides e cometas cuja órbita
              os traz perto da Terra, com estatísticas
              agregadas e destaque para os objetos
              potencialmente perigosos monitorizados
              pela NASA.
            </p>
          </div>

          <div className="neows-page__viewer">
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
                    A carregar visualização 3D...
                  </p>
                </div>
              }
            >
              <BennuViewer />
            </Suspense>
          </div>
        </header>

        <NeoDateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(value) => {
            setStartDate(value);
            setValidationError("");
          }}
          onEndDateChange={(value) => {
            setEndDate(value);
            setValidationError("");
          }}
          onSearch={handleSearch}
          loading={loading}
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

        {error && !loading && (
          <ErrorState
            title="Não foi possível carregar os asteroides"
            message={error}
            onRetry={() =>
              handleSearch(startDate, endDate)
            }
          />
        )}

        {!loading &&
          !error &&
          objects.length === 0 && (
            <div
              className="neows-page__empty"
              role="status"
            >
              <h2>Nenhum objeto encontrado</h2>

              <p>
                Não foram encontrados objetos próximos
                da Terra para este período. Experimenta
                selecionar outro intervalo de datas.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          objects.length > 0 && (
            <NeoSortControl
              direction={sortDirection}
              onChange={(direction) => {
                setSortDirection(direction);
                setPage(1);
              }}
              count={objects.length}
            />
          )}

        {(loading ||
          (!error && objects.length > 0)) && (
            <section
              className="neows-page__list-panel"
              aria-label="Lista de objetos próximos da Terra"
              aria-busy={loading}
            >
              <div className="neows-page__grid">
                {loading &&
                  Array.from({ length: 6 }).map(
                    (_, index) => (
                      <NeoSkeleton key={index} />
                    )
                  )}

                {!loading &&
                  !error &&
                  paginatedObjects.map((neo) => {
                    const favoriteId = String(
                      neo.id
                    );

                    return (
                      <NeoCard
                        key={neo.id}
                        neo={neo}
                        isFavorite={favoriteKeys.has(
                          favoriteId
                        )}
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
                  })}
              </div>
            </section>
          )}

        {!loading &&
          !error &&
          shouldShowPagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
      </Container>

      <Toast message={toastMessage} />
    </main>
  );
}

export default NeoWS;