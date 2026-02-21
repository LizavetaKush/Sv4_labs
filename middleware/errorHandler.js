const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} уже существует`;
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.name === 'CastError') {
    const message = 'Ресурс не найден';
    error = {
      message,
      statusCode: 404
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Ошибка сервера'
  });
};

module.exports = errorHandler;
