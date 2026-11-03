export const parsePaginationParams = (queryParams = {}) => {
  const allowedSortFields = ["date", "price", "createdAt", "title"];

  const { page = 1, limit = 10, sort, order, ...filters } = queryParams;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

  const sortObj = {};
  if (sort && allowedSortFields.includes(sort)) {
    let orderValue = 1;
    if (order && ["asc", "desc"].includes(order)) {
      orderValue = order == "asc" ? 1 : -1;
    }
    sortObj[sort] = orderValue;
  } else {
    sortObj["createdAt"] = -1;
  }

  return {
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      sort: sortObj,
    },
    rawFilters: filters,
  };
};
