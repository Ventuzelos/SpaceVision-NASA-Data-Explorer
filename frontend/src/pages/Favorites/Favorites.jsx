import { useEffect, useMemo, useState } from "react";
import Container from "../../components/common/Container/Container";
import {
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";
import FavoriteCard from "../../components/favorites/FavoriteCard";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Pagination from "../../components/common/Pagination/Pagination";
import { usePagination } from "../../hooks/usePagination";
import useAuth from "../../hooks/useAuth";
import "./Favorites.css";
import FavoriteDetailsModal from "../../components/favorites/FavoriteDetailsModal";



const FAVORITES_PER_PAGE = 8;

const FAVORITE_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "apod", label: "APOD" },
  { value: "donki", label: "DONKI" },
  { value: "epic", label: "EPIC" },
  { value: "neows", label: "NeoWS" },
];

function Favorites() {
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const { user } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredFavorites = useMemo(() => {
    if (activeFilter === "all") {
      return favorites;
    }

    return favorites.filter((favorite) => {
      const favoriteType =
        favorite.nasa_type ||
        favorite.type ||
        favorite.data?.nasa_type ||
        favorite.data?.type ||
        "";

      return String(favoriteType).toLowerCase() === activeFilter;
    });
  }, [favorites, activeFilter]);

  const {
    paginatedItems: paginatedFavorites,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(filteredFavorites, FAVORITES_PER_PAGE);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getFavorites();

        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);

        if (err.response?.status === 401) {
          setError(
            "Precisas de iniciar sessão para consultar os teus favoritos."
          );
        } else {
          setError("Não foi possível carregar os favoritos.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function handleRemoveFavorite(id) {
    try {
      await removeFavorite(id);

      setFavorites((currentFavorites) =>
        currentFavorites.filter((favorite) => favorite.id !== id)
      );
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      setError("Não foi possível remover o favorito.");
    }
  }

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    setPage(1);
  }

  function handlePageChange(page) {
    setPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="favorites-page">
      <section className="favorites-hero">
        <Container>
          <Breadcrumb title="Favoritos" />

          <p className="favorites-hero__label">
            Os teus conteúdos guardados
          </p>

          <h1>
            {user?.name
              ? `Favoritos de ${user.name}`
              : "Favoritos"}
          </h1>

          <p className="favorites-hero__text">
            Guarda imagens e dados da NASA para consultares mais tarde.
          </p>
        </Container>
      </section>

      <section className="favorites-content">
        <Container>
          {!isLoading && !error && favorites.length > 0 && (
            <div className="favorites-filters">
              <h2 className="favorites-filters__title">
                Filtrar por API
              </h2>

              <div
                className="favorites-filters__buttons"
                role="group"
                aria-label="Filtrar favoritos por API"
              >
                {FAVORITE_FILTERS.map((filter) => {
                  const isActive = activeFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      className={`favorites-filter-button${isActive
                        ? " favorites-filter-button--active"
                        : ""
                        }`}
                      onClick={() =>
                        handleFilterChange(filter.value)
                      }
                      aria-pressed={isActive}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="favorites-empty">
              <h2>A carregar favoritos...</h2>
            </div>
          )}

          {!isLoading && error && (
            <div className="favorites-empty" role="alert">
              <h2>Favoritos indisponíveis</h2>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && favorites.length === 0 && (
            <div className="favorites-empty">
              <h2>Ainda não tens favoritos</h2>

              <p>
                Explora os conteúdos da NASA e guarda os que mais gostares.
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            favorites.length > 0 &&
            filteredFavorites.length === 0 && (
              <div className="favorites-empty">
                <h2>Não existem favoritos neste filtro</h2>

                <p>
                  Ainda não guardaste conteúdos desta API.
                </p>
              </div>
            )}

          {!isLoading &&
            !error &&
            filteredFavorites.length > 0 && (
              <>
                <div className="favorites-grid">
                  {paginatedFavorites.map((favorite) => (
                    <FavoriteCard
                      key={favorite.id}
                      favorite={favorite}
                      onRemove={handleRemoveFavorite}
                      onView={setSelectedFavorite}
                    />
                  ))}
                </div>

                {shouldShowPagination && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
              
            )}
        </Container>
      </section>
       {selectedFavorite && (
      <FavoriteDetailsModal
        favorite={selectedFavorite}
        onClose={() => setSelectedFavorite(null)}
      />
    )}
    </main>
  );
}

export default Favorites;