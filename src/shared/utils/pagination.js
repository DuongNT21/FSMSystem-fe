export function getPaginationPages(currentPage, totalPages, delta = 2) {
  if (totalPages <= 1) return [1];

  const pages = [];
  const start = Math.max(2, currentPage - delta);
  const end = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");

  pages.push(totalPages);

  return pages;
}
