export const errorHandler = (error, req, res, next) => {
  return res
    .status(error.statusCode ? error.statusCode : 500)
    .json({ status: "error", error: error.message });
};
