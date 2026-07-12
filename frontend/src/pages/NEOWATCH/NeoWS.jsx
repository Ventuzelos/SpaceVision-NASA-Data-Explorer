import { useCallback, useEffect, useState } from "react";

import Container from "../../components/common/Container/Container";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import BennuViewer from "../../components/NeoWS/BennuViewer/BennuViewer";
import NeoDateRangeFilter from "../../components/NeoWS/NeoDateRangeFilter/NeoDateRangeFilter";
import NeoStats from "../../components/NeoWS/NeoStats/NeoStats";
import NeoSortControl from "../../components/NeoWS/NeoSortControl/NeoSortControl";
import NeoCard from "../../components/NeoWS/NeoCard/NeoCard";
import NeoSkeleton from "../../components/NeoWS/NeoSkeleton/NeoSkeleton";
import Pagination from "../../components/common/Pagination/Pagination";

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

const SOURCE = "neows";
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
    () =>
      new Set(
        getFavorites(SOURCE).map(
          (favorite) => favorite.id
        )
      )
  );

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
  } = usePagination(sortedObjects, 8);

  const loadFeed = useCallback(async (start, end) => {
    setLoading(true);
    setError("");
    setObjects([]);

    try {
      const { objects: results } =
        await fetchNeoFeed(start, end);

      setObjects(results);
    } catch (requestError) {
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Inicia o carregamento de dados externos.
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

  function handleToggleFavorite(neo) {
    toggleFavorite({
      source: SOURCE,
      id: neo.id,
      title: neo.name,
      date: neo.closeApproachDate,
      type: neo.isHazardous
        ? "Potencialmente perigoso"
        : "Objeto próximo",
      link: neo.jplUrl,
    });

    setFavoriteKeys((previousKeys) => {
      const nextKeys = new Set(previousKeys);

      if (nextKeys.has(neo.id)) {
        nextKeys.delete(neo.id);
      } else {
        nextKeys.add(neo.id);
      }

      return nextKeys;
    });
  }

  return (
    <main className="neows-page">
      <Container>
        <header className="neows-page__header">
          <div className="neows-page__intro">
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
            <BennuViewer />
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
                  paginatedObjects.map((neo) => (
                    <NeoCard
                      key={neo.id}
                      neo={neo}
                      isFavorite={favoriteKeys.has(
                        neo.id
                      )}
                      onToggleFavorite={
                        handleToggleFavorite
                      }
                    />
                  ))}
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
    </main>
  );
}

export default NeoWS;