const { handleDefaultError } = require('./defaultError');

const nullReturnedError = new Error('NullReturned');

function handleNotFoundError(res, error, errorMessage) {
  if (error.name === 'CastError' || error.message === 'NullReturned') {
    res.status(404).send({ message: errorMessage });
  } else {
    handleDefaultError(res, error);
  }
}

module.exports = { handleNotFoundError, nullReturnedError };
