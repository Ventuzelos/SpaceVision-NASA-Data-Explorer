import { useMemo, useState } from "react";

/**
 * Hook de paginação genérico.
 *
 * @param {Array} items - lista completa de itens
 * @param {number} [itemsPerPage] - itens por página (default: 10)
 * @returns {{
 *   paginatedItems: Array,
 *   currentPage: number,
 *   totalPages: number,
 *   setPage: (page: number) => void,
 *   shouldShowPagination: boolean,
 * }}
 */
export function usePagination(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [trackedLength, setTrackedLength] = useState(items.length);

  // Sempre que a lista de itens muda (ex: filtro/pesquisa aplicados),
  // volta à primeira página para não ficar "presa" numa página vazia.
  // Ajustar o estado durante o render (em vez de num efeito) evita o
  // "flash" de um render extra — ver https://react.dev/learn/you-might-not-need-an-effect
  if (items.length !== trackedLength) {
    setTrackedLength(items.length);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const paginatedItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage, totalPages]);

  function setPage(page) {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safePage);
  }

  // Só faz sentido mostrar a paginação quando há mais itens do que cabem
  // numa página.
  const shouldShowPagination = items.length > itemsPerPage;

  return {
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  };
}
