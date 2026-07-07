import "./Pagination.css";

// Gera a lista de páginas a mostrar, com "..." quando há muitas páginas.
// Ex: página 5 de 20 -> [1, "...", 4, 5, 6, "...", 20]
function getVisiblePages(currentPage, totalPages) {
  const pages = [];
  const delta = 1;

  const range = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i += 1
  ) {
    range.push(i);
  }

  pages.push(1);
  if (range[0] > 2) pages.push("...");
  pages.push(...range);
  if (range[range.length - 1] < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        className="pagination__button pagination__button--nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        «
      </button>

      {visiblePages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`pagination__button${
              page === currentPage ? " pagination__button--active" : ""
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        className="pagination__button pagination__button--nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página seguinte"
      >
        »
      </button>
    </nav>
  );
}

export default Pagination;
