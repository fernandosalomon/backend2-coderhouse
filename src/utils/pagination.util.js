export const parsePaginationParams = (queryParams = {}) => {
  const { page = 1, limit = 10, sort, ...filters } = queryParams;
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  return {
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      sort: sort ? { date: sort === "asc" ? 1 : -1 } : { createdAt: -1 }
    },
    rawFilters: filters
  };
};