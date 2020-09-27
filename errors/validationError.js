const { handleDefaultError } = require('./defaultError');

function handleValidationError(res, error) {
  if (error.name === 'ValidationError') {
    res.status(400).send({ message: `${error.message}` });
  } else {
    handleDefaultError(res, error);
  }
}

module.exports = { handleValidationError };
