const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = {}) => {
  const response = {
    success: true,
    message,
    data
  };

  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendPaginated = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const response = {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  };

  return res.status(200).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated
};
