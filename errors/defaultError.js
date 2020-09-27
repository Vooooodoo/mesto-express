function handleDefaultError(res, error) {
  res.status(500).send({ message: `На сервере произошла ошибка: ${error.message}` });
}

module.exports = { handleDefaultError };
