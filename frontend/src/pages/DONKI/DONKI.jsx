import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Container from "../../components/common/Container/Container";
import EventTypeSelector from "../../components/DONKI/EventTypeSelector/EventTypeSelector";
import DateRangeFilter from "../../components/DONKI/DateRangeFilter/DateRangeFilter";
import EventCard from "../../components/DONKI/EventCard/EventCard";
import EventDetails from "../../components/DONKI/EventDetails/EventDetails";
import DONKISkeleton from "../../components/DONKI/DONKISkeleton/DONKISkeleton";
import DonkiInsights from "../../components/DONKI/DonkiInsights/DonkiInsights";
import DonkiHero from "../../components/DONKI/DonkiHero/DonkiHero";
import Pagination from "../../components/common/Pagination/Pagination";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Toast from "../../components/common/Toast/Toast";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import useAuth from "../../hooks/useAuth";
import { usePagination } from "../../hooks/usePagination";

import {
  donkiEventTypes,
  fetchDonkiEvents,
  getDefaultDateRange,
} from "../../services/donkiService";

import {
  getFavorites,
  toggleFavorite,
} from "../../services/favoritesService";

import getApiErrorMessage from "../../utils/getApiErrorMessage";
import { getEventStats } from "../../utils/donkiStats";

import "./DONKI.css";

const SOURCE = "donki";
const EVENTS_PER_PAGE = 8;

function formatStatDate(value) {
  if (!value) {
    return "N/D";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "N/D";
  }

  return parsed.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return "Seleciona uma data inicial e uma data final.";
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (start > end) {
    return "A data inicial não pode ser posterior à data final.";
  }

  return "";
}

function getEventFavoriteId(event) {
  const eventId =
    event.id ||
    event.flrID ||
    event.activityID ||
    event.gstID ||
    event.sepID ||
    event.hssID ||
    event.cmeAnalyses?.[0]?.activityID ||
    event.messageID ||
    event.date;

  return `${event.type || "donki"}-${eventId}`;
}

function DONKI() {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const [dateRange] = useState(() =>
    getDefaultDateRange(7)
  );

  const [toastMessage, setToastMessage] =
    useState("");

  const [activeType, setActiveType] =
    useState("FLR");

  const [startDate, setStartDate] = useState(
    dateRange.startDate
  );

  const [endDate, setEndDate] = useState(
    dateRange.endDate
  );

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [validationError, setValidationError] =
    useState("");

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [favoriteKeys, setFavoriteKeys] = useState(
    () => new Set()
  );

  const [
    favoriteLoadingKeys,
    setFavoriteLoadingKeys,
  ] = useState(() => new Set());

  const {
    paginatedItems: paginatedEvents,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(events, EVENTS_PER_PAGE);

  function showToast(message) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  const requestIdRef = useRef(0);

  const loadEvents = useCallback(
    async (type, start, end) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError("");
      setSelectedEvent(null);

      try {
        const results = await fetchDonkiEvents(
          type,
          start,
          end
        );

        if (requestIdRef.current !== requestId) {
          return;
        }

        setEvents(
          Array.isArray(results) ? results : []
        );
      } catch (requestError) {
        if (requestIdRef.current !== requestId) {
          return;
        }

        console.error(
          "Erro ao carregar eventos DONKI:",
          requestError
        );

        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível carregar os eventos de meteorologia espacial."
          )
        );

        setEvents([]);
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
    loadEvents(
      "FLR",
      dateRange.startDate,
      dateRange.endDate
    );
  }, [
    loadEvents,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading || !isAuthenticated) {
      return undefined;
    }

    async function loadFavoriteKeys() {
      try {
        const favorites = await getFavorites(
          SOURCE
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
        if (
          requestError.response?.status !== 401
        ) {
          console.error(
            "Erro ao carregar favoritos DONKI:",
            requestError
          );
        }

        if (isMounted) {
          setFavoriteKeys(new Set());
        }
      }
    }

    loadFavoriteKeys();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthLoading]);

  function handleSelectType(type) {
    setActiveType(type);
    setValidationError("");

    const dateError = validateDateRange(
      startDate,
      endDate
    );

    if (dateError) {
      setValidationError(dateError);
      return;
    }

    setPage(1);
    loadEvents(type, startDate, endDate);
  }

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

    loadEvents(
      activeType,
      newStartDate,
      newEndDate
    );
  }

  async function handleToggleFavorite(event) {
    if (!isAuthenticated) {
      showToast(
        "Precisas de iniciar sessão para guardar favoritos"
      );

      return;
    }

    const favoriteId = getEventFavoriteId(event);

    if (favoriteLoadingKeys.has(favoriteId)) {
      return;
    }

    setFavoriteLoadingKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);
      nextKeys.add(favoriteId);

      return nextKeys;
    });

    try {
      const result = await toggleFavorite({
        nasa_type: SOURCE,
        nasa_id: favoriteId,
        title: event.title || "Evento DONKI",
        image_url: null,

        data: {
          ...event,
          event_date: event.date || null,
          donki_type:
            event.type || activeType,
        },
      });

      setFavoriteKeys((currentKeys) => {
        const updatedKeys = new Set(
          currentKeys
        );

        if (result.isFavorite) {
          updatedKeys.add(favoriteId);
        } else {
          updatedKeys.delete(favoriteId);
        }

        return updatedKeys;
      });

      showToast(
        result.isFavorite
          ? "Adicionado aos favoritos"
          : "Removido dos favoritos"
      );
    } catch (requestError) {
      console.error(
        "Erro ao atualizar favorito DONKI:",
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

  const activeTypeConfig = donkiEventTypes.find(
    (type) => type.id === activeType
  );

  const eventStats = getEventStats(
    events,
    activeType
  );

  const notificationsCount =
    activeType === "NOTIFICATIONS" &&
    !loading &&
    !error
      ? events.length
      : undefined;

  return (
    <>
      <PageMeta
        title="Meteorologia Espacial — SpaceVision"
        description="Consulta erupções solares, ejeções de massa coronal, tempestades geomagnéticas e outros eventos espaciais através de dados DONKI da NASA."
      />

      <main className="donki-page">
        <Container>
          <DonkiHero />

          <EventTypeSelector
            activeType={activeType}
            onSelect={handleSelectType}
            notificationsCount={
              notificationsCount
            }
          />

          <DateRangeFilter
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

          {!selectedEvent && (
            <DonkiInsights
              type={activeType}
              events={events}
              loading={loading}
              error={Boolean(error)}
            />
          )}

          {validationError && (
            <p
              className="donki-page__validation-error"
              role="alert"
            >
              {validationError}
            </p>
          )}

          {selectedEvent ? (
            <EventDetails
              event={selectedEvent}
              isFavorite={
                isAuthenticated &&
                favoriteKeys.has(
                  getEventFavoriteId(
                    selectedEvent
                  )
                )
              }
              isFavoriteLoading={
                favoriteLoadingKeys.has(
                  getEventFavoriteId(
                    selectedEvent
                  )
                )
              }
              onToggleFavorite={
                handleToggleFavorite
              }
              onBack={() =>
                setSelectedEvent(null)
              }
            />
          ) : (
            <section
              className="donki-page__results"
              aria-labelledby="donki-results-title"
            >
              <div className="donki-page__results-header">
                <h2 id="donki-results-title">
                  {activeTypeConfig?.shortLabel}
                </h2>

                <span
                  className="donki-page__results-count"
                  aria-live="polite"
                >
                  {loading
                    ? "A carregar..."
                    : `${events.length} evento(s)`}
                </span>
              </div>

              {error && !loading && (
                <ErrorState
                  title="Não foi possível carregar os eventos"
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
                events.length === 0 && (
                  <div
                    className="donki-page__empty"
                    role="status"
                  >
                    <h3>
                      Nenhum evento encontrado
                    </h3>

                    <p>
                      Não foram encontrados eventos
                      para este período. Experimenta
                      alargar o intervalo de datas ou
                      selecionar outro tipo de evento.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                events.length > 0 && (
                  <div className="donki-page__stats">
                    <div className="donki-page__stat">
                      <span>
                        Eventos neste período
                      </span>

                      <strong>
                        {events.length}
                      </strong>
                    </div>

                    {eventStats.mostIntense && (
                      <div className="donki-page__stat">
                        <span>Mais intenso</span>

                        <strong>
                          {eventStats.mostIntense}
                        </strong>
                      </div>
                    )}

                    <div className="donki-page__stat">
                      <span>Mais recente</span>

                      <strong>
                        {formatStatDate(
                          eventStats.latestDate
                        )}
                      </strong>
                    </div>
                  </div>
                )}

              <div
                className="donki-page__grid"
                aria-busy={loading}
              >
                {loading &&
                  Array.from({ length: 6 }).map(
                    (_, index) => (
                      <DONKISkeleton
                        key={index}
                      />
                    )
                  )}

                {!loading &&
                  !error &&
                  paginatedEvents.map(
                    (event) => {
                      const favoriteId =
                        getEventFavoriteId(
                          event
                        );

                      return (
                        <EventCard
                          key={favoriteId}
                          event={event}
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
                          onViewDetails={
                            setSelectedEvent
                          }
                        />
                      );
                    }
                  )}
              </div>

              {!loading &&
                !error &&
                shouldShowPagination && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                )}
            </section>
          )}
        </Container>

        <Toast message={toastMessage} />
      </main>
    </>
  );
}

export default DONKI;