import { useCallback, useEffect, useState } from "react";

import Container from "../../components/common/Container/Container";
import NeoDateRangeFilter from "../../components/NeoWS/NeoDateRangeFilter/NeoDateRangeFilter";
import NeoStats from "../../components/NeoWS/NeoStats/NeoStats";
import NeoSortControl from "../../components/NeoWS/NeoSortControl/NeoSortControl";
import NeoCard from "../../components/NeoWS/NeoCard/NeoCard";
import NeoSkeleton from "../../components/NeoWS/NeoSkeleton/NeoSkeleton";

import {
  fetchNeoFeed,
  getDefaultDateRange,
  sortByMissDistance,
  computeStats,
} from "../../services/neowsService";
import { getFavorites, toggleFavorite } from "../../services/favoritesService";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination/Pagination";

import "./NeoWS.css";

const SOURCE = "neows";

function NeoWS() {
  const [dateRange] = useState(() => getDefaultDateRange());

  const [startDate, setStartDate] = useState(dateRange.startDate);
  const [endDate, setEndDate] = useState(dateRange.endDate);
  const [objects, setObjects] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteKeys, setFavoriteKeys] = useState(
    () => new Set(getFavorites(SOURCE).map((fav) => fav.id))
  );

  const loadFeed = useCallback(async (start, end) => {
    setLoading(true);
    setError(null);

    try {
      const { objects: results } = await fetchNeoFeed(start, end);
      setObjects(results);
    } catch (err) {
      console.error("Erro ao carregar objetos NeoWS:", err);
      setError(
        "Não foi possível carregar os objetos próximos da Terra. Tenta novamente."
      );
      setObjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(dateRange.startDate, dateRange.endDate);
  }, [loadFeed, dateRange.startDate, dateRange.endDate]);

  const handleSearch = (newStartDate = startDate, newEndDate = endDate) => {
    loadFeed(newStartDate, newEndDate);
  };

  const handleToggleFavorite = (neo) => {
    toggleFavorite({
      source: SOURCE,
      id: neo.id,
      title: neo.name,
      date: neo.closeApproachDate,
      type: neo.isHazardous ? "Potencialmente perigoso" : "Objeto próximo",
      link: neo.jplUrl,
    });

    setFavoriteKeys((prev) => {
      const next = new Set(prev);

      if (next.has(neo.id)) {
        next.delete(neo.id);
      } else {
        next.add(neo.id);
      }

      return next;
    });
  };

  const stats = computeStats(objects);
  const sortedObjects = sortByMissDistance(objects, sortDirection);

   const {
    paginatedItems: paginatedObjects,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(sortedObjects, 8);

  return (
    <section className="neows-page">
      <Container>
        <header className="neows-page__header">
          <span className="neows-page__eyebrow">
            NeoWS · Near-Earth Objects
          </span>

          <h1>NEO Watch — Objetos Próximos da Terra</h1>

          <p>
            Consulta asteroides e cometas cuja órbita os traz perto da Terra,
            com estatísticas agregadas e destaque para os objetos
            potencialmente perigosos monitorizados pela NASA.
          </p>
        </header>

        <NeoDateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
          loading={loading}
        />

        <NeoStats stats={stats} loading={loading} />

        {error && <p className="neows-page__error">{error}</p>}

        {!loading && !error && objects.length === 0 && (
          <p className="neows-page__empty">
            Não foram encontrados objetos para este período. Experimenta outro
            intervalo de datas.
          </p>
        )}

        {!loading && !error && objects.length > 0 && (
          <NeoSortControl
            direction={sortDirection}
            onChange={setSortDirection}
            count={objects.length}
          />
        )}

        <div className="neows-page__grid">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <NeoSkeleton key={index} />
            ))}

          {!loading &&
            !error &&
            paginatedObjects.map((neo) => (
              <NeoCard
                key={neo.id}
                neo={neo}
                isFavorite={favoriteKeys.has(neo.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
        </div>

        {!loading && !error && shouldShowPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

      </Container>
    </section>
  );
}

export default NeoWS;
