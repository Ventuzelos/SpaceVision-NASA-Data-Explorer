import { useCallback, useEffect, useState } from "react";

import Container from "../../components/common/Container/Container";
import EventTypeSelector from "../../components/DONKI/EventTypeSelector/EventTypeSelector";
import DateRangeFilter from "../../components/DONKI/DateRangeFilter/DateRangeFilter";
import EventCard from "../../components/DONKI/EventCard/EventCard";
import EventDetails from "../../components/DONKI/EventDetails/EventDetails";
import DONKISkeleton from "../../components/DONKI/DONKISkeleton/DONKISkeleton";

import {
  donkiEventTypes,
  fetchDonkiEvents,
  getDefaultDateRange,
} from "../../services/donkiService";
import { getFavorites, toggleFavorite } from "../../services/favoritesService";

import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination/Pagination";

import "./DONKI.css";

const SOURCE = "donki";

function DONKI() {
  const [dateRange] = useState(() => getDefaultDateRange(7));

  const [activeType, setActiveType] = useState("FLR");
  const [startDate, setStartDate] = useState(dateRange.startDate);
  const [endDate, setEndDate] = useState(dateRange.endDate);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favoriteKeys, setFavoriteKeys] = useState(
    () => new Set(getFavorites(SOURCE).map((fav) => fav.id))
  );

  // Paginação: 8 eventos por página, só aparece se houver mais do que isso.
  const {
    paginatedItems: paginatedEvents,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(events, 8);

  const loadEvents = useCallback(async (type, start, end) => {
    setLoading(true);
    setError(null);
    setSelectedEvent(null);

    try {
      const results = await fetchDonkiEvents(type, start, end);
      setEvents(results);
    } catch (error) {
      console.error("Erro ao carregar eventos DONKI:", error);
      setError("Não foi possível carregar os eventos DONKI. Tenta novamente.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents("FLR", dateRange.startDate, dateRange.endDate);
  }, [loadEvents, dateRange.startDate, dateRange.endDate]);

  const handleSelectType = (type) => {
    setActiveType(type);
    loadEvents(type, startDate, endDate);
  };

  const handleSearch = (newStartDate = startDate, newEndDate = endDate) => {
    loadEvents(activeType, newStartDate, newEndDate);
  };

  const handleToggleFavorite = (event) => {
    const key = `${event.type}-${event.id}`;

    toggleFavorite({
      source: SOURCE,
      id: key,
      title: event.title,
      date: event.date,
      type: event.type,
      link: event.link,
    });

    setFavoriteKeys((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const activeTypeConfig = donkiEventTypes.find((t) => t.id === activeType);

  return (
    <section className="donki-page">
      <Container>
        <header className="donki-page__header">
          <span className="donki-page__eyebrow">
            DONKI · Space Weather Database
          </span>

          <h1>Meteorologia espacial em tempo real</h1>

          <p>
            Consulta erupções solares, ejeções de massa coronal, tempestades
            geomagnéticas e outros fenómenos monitorizados pela NASA para
            perceber o que está a acontecer à volta do Sol e da Terra.
          </p>
        </header>

        <EventTypeSelector activeType={activeType} onSelect={handleSelectType} />

        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
          loading={loading}
        />

        {selectedEvent ? (
          <EventDetails
            event={selectedEvent}
            isFavorite={favoriteKeys.has(
              `${selectedEvent.type}-${selectedEvent.id}`
            )}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setSelectedEvent(null)}
          />
        ) : (
          <div className="donki-page__results">
            <div className="donki-page__results-header">
              <h2>{activeTypeConfig?.label}</h2>

              <span className="donki-page__results-count">
                {loading ? "A carregar..." : `${events.length} evento(s)`}
              </span>
            </div>

            {error && <p className="donki-page__error">{error}</p>}

            {!loading && !error && events.length === 0 && (
              <p className="donki-page__empty">
                Não foram encontrados eventos para este período. Experimenta
                alargar o intervalo de datas.
              </p>
            )}

            <div className="donki-page__grid">
              {loading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <DONKISkeleton key={index} />
                ))}
              {paginatedEvents.map((event) => (
                <EventCard
                  key={`${event.type}-${event.id}`}
                  event={event}
                  isFavorite={favoriteKeys.has(`${event.type}-${event.id}`)}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetails={setSelectedEvent}
                />
              ))}
            </div>

            {shouldShowPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

export default DONKI;
