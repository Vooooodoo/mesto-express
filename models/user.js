const mongoose = require('mongoose');
const validator = require('validator'); //* модуль для валидации данных

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    minlength: 2,
    required: true,
    validate: { //* свойство для более тонкой проверки данных
      validator(link) { //* функция валидации вернёт true, если данные соответствуют регулярке
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/.test(link); //* параметр link - это значение свойства avatar
      },
      message: (props) => `${props.value} невалидная ссылка!`, //* вернули сообщение, если данные не прошли валидацию
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        //* проверим, вводимый пользователем email, c помощью модуля validator
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} невалидная электронная почта!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
}); //* создали схему, чтобы проверять, соответствует ли ей документ, прежде чем записывать его в БД

module.exports = mongoose.model('user', userSchema);
