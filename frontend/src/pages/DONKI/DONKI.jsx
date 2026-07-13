import { useCallback, useEffect, useState } from "react";

import Container from "../../components/common/Container/Container";
import EventTypeSelector from "../../components/DONKI/EventTypeSelector/EventTypeSelector";
import DateRangeFilter from "../../components/DONKI/DateRangeFilter/DateRangeFilter";
import EventCard from "../../components/DONKI/EventCard/EventCard";
import EventDetails from "../../components/DONKI/EventDetails/EventDetails";
import DONKISkeleton from "../../components/DONKI/DONKISkeleton/DONKISkeleton";
import Pagination from "../../components/common/Pagination/Pagination";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";

import {
  donkiEventTypes,
  fetchDonkiEvents,
  getDefaultDateRange,
} from "../../services/donkiService";

import {
  getFavorites,
  toggleFavorite,
} from "../../services/favoritesService";

import { usePagination } from "../../hooks/usePagination";
import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./DONKI.css";

const SOURCE = "donki";
const EVENTS_PER_PAGE = 8;

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
  const [dateRange] = useState(() => getDefaultDateRange(7));

  const [activeType, setActiveType] = useState("FLR");

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

  const {
    paginatedItems: paginatedEvents,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(events, EVENTS_PER_PAGE);

  const loadEvents = useCallback(
    async (type, start, end) => {
      setLoading(true);
      setError("");
      setSelectedEvent(null);

      try {
        const results = await fetchDonkiEvents(
          type,
          start,
          end
        );

        setEvents(Array.isArray(results) ? results : []);
      } catch (requestError) {
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
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
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

    async function loadFavoriteKeys() {
      try {
        const favorites = await getFavorites(SOURCE);

        const keys = favorites.map((favorite) =>
          String(favorite.nasa_id || favorite.id)
        );

        if (isMounted) {
          setFavoriteKeys(new Set(keys));
        }
      } catch (requestError) {
        console.error(
          "Erro ao carregar favoritos DONKI:",
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
    const favoriteId = getEventFavoriteId(event);

    try {
      await toggleFavorite({
        nasa_type: SOURCE,
        nasa_id: favoriteId,
        title: event.title || "Evento DONKI",
        image_url: null,

        data: {
          ...event,
          event_date: event.date || null,
          donki_type: event.type || activeType,
        },
      });

      setFavoriteKeys((currentKeys) => {
        const updatedKeys = new Set(currentKeys);

        if (updatedKeys.has(favoriteId)) {
          updatedKeys.delete(favoriteId);
        } else {
          updatedKeys.add(favoriteId);
        }

        return updatedKeys;
      });
    } catch (requestError) {
      console.error(
        "Erro ao atualizar favorito DONKI:",
        requestError
      );
    }
  }

  const activeTypeConfig = donkiEventTypes.find(
    (type) => type.id === activeType
  );

  return (
    <main className="donki-page">
      <Container>
        <Breadcrumb title="DONKI" />

        <header className="donki-page__header">
          <span className="donki-page__eyebrow">
            DONKI · Space Weather Database
          </span>

          <h1>Meteorologia espacial em tempo real</h1>

          <p>
            Consulta erupções solares, ejeções de massa
            coronal, tempestades geomagnéticas e outros
            fenómenos monitorizados pela NASA para
            perceber o que está a acontecer à volta do
            Sol e da Terra.
          </p>
        </header>

        <EventTypeSelector
          activeType={activeType}
          onSelect={handleSelectType}
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
            isFavorite={favoriteKeys.has(
              getEventFavoriteId(selectedEvent)
            )}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setSelectedEvent(null)}
          />
        ) : (
          <section
            className="donki-page__results"
            aria-labelledby="donki-results-title"
          >
            <div className="donki-page__results-header">
              <h2 id="donki-results-title">
                {activeTypeConfig?.label}
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
                  handleSearch(startDate, endDate)
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
                  <h3>Nenhum evento encontrado</h3>

                  <p>
                    Não foram encontrados eventos para
                    este período. Experimenta alargar o
                    intervalo de datas ou selecionar
                    outro tipo de evento.
                  </p>
                </div>
              )}

            <div
              className="donki-page__grid"
              aria-busy={loading}
            >
              {loading &&
                Array.from({ length: 6 }).map(
                  (_, index) => (
                    <DONKISkeleton key={index} />
                  )
                )}

              {!loading &&
                !error &&
                paginatedEvents.map((event) => {
                  const favoriteId =
                    getEventFavoriteId(event);

                  return (
                    <EventCard
                      key={favoriteId}
                      event={event}
                      isFavorite={favoriteKeys.has(
                        favoriteId
                      )}
                      onToggleFavorite={
                        handleToggleFavorite
                      }
                      onViewDetails={setSelectedEvent}
                    />
                  );
                })}
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
    </main>
  );
}

export default DONKI;