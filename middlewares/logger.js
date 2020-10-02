//* модули для сбора логов
const winston = require('winston');
const expressWinston = require('express-winston');

//* логгер запросов к серверу
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }), //* писать логи в файл request.log
  ],
  format: winston.format.json(), //* писать логи в формате json
});

//* логгер ошибок сервера
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
