const User = require('../models/user');
const { handleValidationError } = require('../errors/validationError');
const { handleNotFoundError, nullReturnedError } = require('../errors/notFoundError');
const { handleDefaultError } = require('../errors/defaultError');

const notFoundErrorMessage = 'Нет пользователя с таким id';

function handleErrors(res, error) {
  if (error === nullReturnedError || error.name === 'CastError') {
    handleNotFoundError(res, error, notFoundErrorMessage);
  } else {
    handleValidationError(res, error);
  }
}

function getUsers(req, res) {
  User.find({})
    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleDefaultError(res, error);
    });
}

function getUser(req, res) {
  User.findById(req.params.id) //* req.params.id = id после слэша в роуте
    //* если id в целом валидный, но такого пользователя нет в базе - перейти в блок .catch
    .orFail(nullReturnedError)

    .then((data) => {
      res.send(data); //* если пользователь с req.params.id есть в базе, отправить его данные
    })

    .catch((error) => {
      handleNotFoundError(res, error, notFoundErrorMessage);
    });
}

function createUser(req, res) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
    email,
    password,
  })
    .then((data) => {
      res.send(data); //* вернули документ из базы с записанными в него данными запроса
    })

    .catch((error) => {
      handleValidationError(res, error);
    });
}

function setUserInfo(req, res) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, //* теперь обработчик then получит на вход уже обновлённую запись
    runValidators: true, //* включили валидацию данных перед изменением
  })
    .orFail(nullReturnedError)

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleErrors(res, error);
    });
}

function setUserAvatar(req, res) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(nullReturnedError)

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleErrors(res, error);
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  setUserInfo,
  setUserAvatar,
};
