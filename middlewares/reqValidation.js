const { celebrate, Joi } = require('celebrate'); //* модуль для валидации данных от пользователя до запуска контроллера

const validateId = celebrate({
  params: Joi.object().keys({ //* валидируем параметры
    //* id должен быть строкой, состоящей из a-z, A-Z, 0-9, длиной в 24 символа
    _id: Joi.string().alphanum().length(24),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({ //* валидируем тело запроса
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
  }),
});

const validateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateId,
  validateUserInfo,
  validateUserAvatar,
  validateCard,
  validateNewUser,
  validateLogin,
};
