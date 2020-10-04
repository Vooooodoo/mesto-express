const bcrypt = require('bcryptjs'); //* модуль для хэширования пароля пользователя
const jwt = require('jsonwebtoken'); //* модуль для создания jwt-токенов
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env; //* доступ к секретному jwt-ключу из .env файла

function handleErrors(error) {
  if (error.message === 'NullReturned' || error.name === 'CastError') {
    throw new NotFoundError(error.message);
  } else {
    throw new ValidationError(error.message);
  }
}

function getUsers(req, res, next) {
  User.find({})
    .then((data) => {
      res.send(data);
    })

    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.params.id) //* req.params.id = id после слэша в роуте
    //* если id в целом валидный, но такого пользователя нет в базе - вернётся null
    //* создадим новую ошибку и перейдём в ближайший блок .catch для обработки
    .orFail(new Error('NullReturned'))

    .then((data) => {
      res.send(data); //* если пользователь с req.params.id есть в базе, отправить его данные
    })

    .catch((error) => {
      throw new NotFoundError(error.message);
    })

    .catch(next);
}

function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  //* хешируем пароль с помощью модуля bcrypt, 10 - это длина «соли»,
  //* случайной строки, которую метод добавит к паролю перед хешированием, для безопасности
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, //* записали хеш в базу
    }))

    .then((data) => {
      res.send({
        _id: data._id,
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        email: data.email,
      }); //* вернули документ из базы с записанными в него данными пользователя
    })

    .catch((error) => {
      if (error.name === 'MongoError' || error.code === 11000) {
        throw new ConflictError(error.message);
      }

      throw new ValidationError(error.message);
    })

    .catch(next);
}

function setUserInfo(req, res, next) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, //* теперь обработчик then получит на вход уже обновлённую запись
    runValidators: true, //* включили валидацию данных перед изменением
  })
    .orFail(new Error('NullReturned'))

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleErrors(error);
    })

    .catch(next);
}

function setUserAvatar(req, res, next) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NullReturned'))

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleErrors(error);
    })

    .catch(next);
}

//* если почта и пароль из запроса на авторизацию совпадают с теми, что есть в базе,
//* пользователь входит в аккаунт, иначе - получает сообщение об ошибке
function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      ); //* создали jwt-токен сроком на неделю

      res.send({ token }); //* отправили токен пользователю
    })

    .catch((error) => {
      throw new AuthError(error.message);
    })

    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  setUserInfo,
  setUserAvatar,
  login,
};
