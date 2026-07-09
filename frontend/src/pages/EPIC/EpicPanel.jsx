import EpicSkeleton from '../../components/EPIC/EpicSkeleton/EpicSkeleton';
import EpicThumbnail from '../../components/EPIC/EpicThumbnail';
import Pagination from '../../components/common/Pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';

export default function EpicPanel({ photos, loading, error, date, onSelect, onRetry }) {
  const {
    paginatedItems, currentPage, totalPages, setPage,
  } = usePagination(photos || [], 8);

  if (loading) {
    return <EpicSkeleton />;
  }

  if (error) {
    return (
      <div className="grid-wrap">
        <div className="state-msg err">
          Não foi possível obter dados da EPIC.
          <br />
          {error}
          <br />
          <button className="btn" style={{ marginTop: 14 }} onClick={onRetry}>
            ↺ Tentar de novo
          </button>
        </div>
      </div>
    );
  }

  if (!photos || !photos.length) {
    return (
      <div className="grid-wrap">
        <div className="state-msg">Escolhe uma data ou carrega a captura mais recente.</div>
      </div>
    );
  }

  return (
    <div className="thumb-panel">
      <div className="meta-row">
        <span className="tag tag-glow">{photos.length} CAPTURAS</span>
        <span className="tag tag-green">DSCOVR · L1</span>
        <span className="tag">{date}</span>
      </div>
      <div className="grid-wrap">
        <div className="thumb-grid">
          {paginatedItems.map((p, i) => (
            <EpicThumbnail key={p.image + i} photo={p} date={date} onSelect={onSelect} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}