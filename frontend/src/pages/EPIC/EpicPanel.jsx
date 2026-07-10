import EpicSkeleton from "../../components/epic/EpicSkeleton/EpicSkeleton";
import EpicThumbnail from "../../components/epic/EpicThumbnail";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Pagination from "../../components/common/Pagination/Pagination";
import { usePagination } from "../../hooks/usePagination";

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
              "Seleciona uma data ou carrega a captura mais recente."}
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

        <span className="tag tag-green">
          DSCOVR · L1
        </span>

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