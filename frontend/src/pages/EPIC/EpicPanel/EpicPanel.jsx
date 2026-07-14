import { useEffect, useState } from 'react';
import './EpicPanel.css';
import EpicSkeleton from '../../../components/EPIC/EpicSkeleton/EpicSkeleton';
import EpicThumbnail from '../../../components/EPIC/EpicThumbnail/EpicThumbnail';
import EpicDscovrInfo from '../../../components/EPIC/EpicDscovrInfo/EpicDscovrInfo';
import ErrorState from '../../../components/common/ErrorState/ErrorState';
import Pagination from '../../../components/common/Pagination/Pagination';
import { usePagination } from '../../../hooks/usePagination';
import {
  getFavorites,
  toggleFavorite,
} from '../../../services/favoritesService';

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
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(photos || [], 8);

  const [favoriteKeys, setFavoriteKeys] = useState(
    () => new Set()
  );

  const [favoriteLoadingKeys, setFavoriteLoadingKeys] =
    useState(() => new Set());

  useEffect(() => {
    let isMounted = true;

    async function loadFavoriteKeys() {
      try {
        const favorites = await getFavorites('epic');

        const keys = favorites.map(
          (favorite) => favorite.nasa_id || favorite.id
        );

        if (isMounted) {
          setFavoriteKeys(new Set(keys));
        }
      } catch (favoritesError) {
        console.error(
          'Erro ao carregar favoritos EPIC:',
          favoritesError
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

  async function handleToggleFavorite(favoriteId, payload) {
    if (favoriteLoadingKeys.has(favoriteId)) {
      return;
    }

    setFavoriteLoadingKeys((current) => {
      const next = new Set(current);
      next.add(favoriteId);
      return next;
    });

    try {
      const result = await toggleFavorite(payload);

      setFavoriteKeys((current) => {
        const next = new Set(current);

        if (result.isFavorite) {
          next.add(favoriteId);
        } else {
          next.delete(favoriteId);
        }

        return next;
      });

      window.dispatchEvent(
        new CustomEvent('epicFavoriteUpdated', {
          detail: {
            isFavorite: result.isFavorite,
          },
        })
      );
    } catch (favoriteError) {
      console.error(
        'Erro ao atualizar favorito EPIC:',
        favoriteError
      );

      window.dispatchEvent(
        new CustomEvent('epicFavoriteError', {
          detail: {
            status: favoriteError.response?.status,
          },
        })
      );
    } finally {
      setFavoriteLoadingKeys((current) => {
        const next = new Set(current);
        next.delete(favoriteId);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div
        className="thumb-panel"
        aria-busy="true"
        aria-label="A carregar imagens EPIC"
      >
        <EpicSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="thumb-panel">
        <ErrorState
          title="Não foi possível carregar as imagens"
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!photos?.length) {
    return (
      <div className="thumb-panel">
        <div className="epic-empty-state" role="status">
          <h3>Nenhuma imagem disponível</h3>

          <p>
            {emptyMessage ||
              'Seleciona uma data ou carrega a captura mais recente.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="thumb-panel">
      <div className="meta-row">
        <span className="tag tag-glow">
          {photos.length} CAPTURAS
        </span>

        <EpicDscovrInfo />

        <span className="tag">{date}</span>
      </div>

      <div className="grid-wrap">
        <div className="thumb-grid">
          {paginatedItems.map((photo, index) => (
            <EpicThumbnail
              key={`${photo.image}-${index}`}
              photo={photo}
              date={date}
              onSelect={onSelect}
              isFavorite={favoriteKeys.has(
                `epic-${photo.image}`
              )}
              isFavoriteLoading={favoriteLoadingKeys.has(
                `epic-${photo.image}`
              )}
              onToggleFavorite={handleToggleFavorite}
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
    </div>
  );
}
