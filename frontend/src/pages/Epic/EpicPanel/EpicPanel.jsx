import { useEffect, useState } from "react";

import "./EpicPanel.css";

import EpicSkeleton from "../../../components/EPIC/EpicSkeleton/EpicSkeleton";
import EpicThumbnail from "../../../components/EPIC/EpicThumbnail/EpicThumbnail";
import EpicDscovrInfo from "../../../components/EPIC/EpicDscovrInfo/EpicDscovrInfo";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Pagination from "../../../components/common/Pagination/Pagination";

import useAuth from "../../../hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";

import {
  getFavorites,
  toggleFavorite,
} from "../../../services/favoritesService";

const SOURCE = "epic";
const ITEMS_PER_PAGE = 8;

export default function EpicPanel({
  photos,
  loading,
  error,
  emptyMessage,
  date,
  onSelect,
  onRetry,
}) {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const safePhotos = Array.isArray(photos)
    ? photos
    : [];

  const {
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(
    safePhotos,
    ITEMS_PER_PAGE
  );

  const [favoriteKeys, setFavoriteKeys] =
    useState(() => new Set());

  const [
    favoriteLoadingKeys,
    setFavoriteLoadingKeys,
  ] = useState(() => new Set());

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
          await getFavorites(SOURCE);

        const keys = favorites
          .map((favorite) =>
            String(
              favorite.nasa_id ||
                favorite.id
            )
          )
          .filter(Boolean);

        if (isMounted) {
          setFavoriteKeys(
            new Set(keys)
          );
        }
      } catch (favoritesError) {
        if (
          favoritesError.response
            ?.status !== 401
        ) {
          console.error(
            "Erro ao carregar favoritos EPIC:",
            favoritesError
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

  async function handleToggleFavorite(
    favoriteId,
    payload
  ) {
    if (!isAuthenticated) {
      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteError",
          {
            detail: {
              status: 401,
            },
          }
        )
      );

      return;
    }

    if (
      !favoriteId ||
      !payload ||
      favoriteLoadingKeys.has(
        favoriteId
      )
    ) {
      return;
    }

    setFavoriteLoadingKeys(
      (currentKeys) => {
        const nextKeys =
          new Set(currentKeys);

        nextKeys.add(favoriteId);

        return nextKeys;
      }
    );

    try {
      const result =
        await toggleFavorite(payload);

      setFavoriteKeys(
        (currentKeys) => {
          const nextKeys =
            new Set(currentKeys);

          if (result.isFavorite) {
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

      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteUpdated",
          {
            detail: {
              isFavorite:
                result.isFavorite,
            },
          }
        )
      );
    } catch (favoriteError) {
      console.error(
        "Erro ao atualizar favorito EPIC:",
        favoriteError
      );

      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteError",
          {
            detail: {
              status:
                favoriteError.response
                  ?.status,
            },
          }
        )
      );
    } finally {
      setFavoriteLoadingKeys(
        (currentKeys) => {
          const nextKeys =
            new Set(currentKeys);

          nextKeys.delete(
            favoriteId
          );

          return nextKeys;
        }
      );
    }
  }

  function handleSelectPhoto(photo) {
    if (
      photo &&
      typeof onSelect === "function"
    ) {
      onSelect(photo);
    }
  }

  if (loading) {
    return (
      <div
        className="epic-panel"
        aria-busy="true"
        aria-live="polite"
        aria-label="A carregar imagens EPIC"
      >
        <EpicSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="epic-panel">
        <ErrorState
          title="Não foi possível carregar as imagens"
          message={error}
          onRetry={
            typeof onRetry === "function"
              ? onRetry
              : undefined
          }
        />
      </div>
    );
  }

  if (safePhotos.length === 0) {
    return (
      <div className="epic-panel">
        <div
          className="epic-empty-state"
          role="status"
          aria-live="polite"
        >
          <h3>
            Nenhuma imagem disponível
          </h3>

          <p>
            {emptyMessage ||
              "Seleciona uma data ou carrega a captura mais recente."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="epic-panel">
      <div className="epic-panel__meta">
        <span className="epic-panel__tag epic-panel__tag--highlight">
          {safePhotos.length}{" "}
          {safePhotos.length === 1
            ? "CAPTURA"
            : "CAPTURAS"}
        </span>

        <EpicDscovrInfo />

        <span className="epic-panel__tag">
          {date || "Data indisponível"}
        </span>
      </div>

      <div className="epic-panel__content">
        <div
          className="epic-panel__grid"
          aria-label="Capturas EPIC disponíveis"
        >
          {paginatedItems.map(
            (photo, index) => {
              const imageId =
                photo?.image ||
                `${date || "sem-data"}-${index}`;

              const favoriteId =
                `epic-${imageId}`;

              return (
                <EpicThumbnail
                  key={imageId}
                  photo={photo}
                  date={
                    photo?.date ||
                    date
                  }
                  onSelect={
                    handleSelectPhoto
                  }
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

        {shouldShowPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}