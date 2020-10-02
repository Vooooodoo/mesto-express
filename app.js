require('dotenv').config(); //* модуль безопасности, для использования секретного jwt-ключа из .env файла
const express = require('express');
const mongoose = require('mongoose'); //* модуль для взаимодействия MongoDB и JS
const bodyParser = require('body-parser'); //* модуль для парсинга req.body
const rateLimit = require('express-rate-limit'); //* модуль для ограничения количества запросов
const { errors } = require('celebrate'); //* модуль для обработки ошибок первичной валидации запроса
const cardsRouter = require('./routes/cards'); //* импортировали роутер
const usersRouter = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { validateNewUser, validateLogin } = require('./middlewares/reqValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env; //* слушаем 3000 порт

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с вашего IP, попробуйте повторить попытку позже',
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}); //* подключились к серверу MongoDB

app.use(limiter); //* применили ко всем запросам защиту от DoS-атак
app.use(bodyParser.json()); //* указали парсить запросы с JSON
app.use(bodyParser.urlencoded({ extended: true })); //* указали парсить запросы с веб-страницами

app.use(requestLogger); //* подключили логгер запросов до всех обработчиков роутов

//* роуты, не требующие авторизации
app.post('/signup', validateNewUser, createUser); //* обработчик POST-запроса на роут '/signup'
app.post('/signin', validateLogin, login);

//! app.use(auth); //* применили авторизационный мидлвэр

//* роуты, которым авторизация нужна
app.use('/cards', cardsRouter); //* запустили роутер
app.use('/users', usersRouter);

app.use('*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
}); //* обработали несуществующий адрес

//* подключим логгер ошибок, после обработчиков роутов и до обработчиков ошибок
app.use(errorLogger);

app.use(errors()); //* обработчик ошибок celebrate

//* централизованная обработка ошибок
app.use((error, req, res, next) => {
  //* если ошибка сгенерирована не нами - выставляем статус 500
  const { statusCode = 500, message } = error;

  res
    .status(statusCode)
    .send({
      //* проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}: http://localhost:3000`); //* если всё работает, консоль покажет, какой порт приложение слушает
});
