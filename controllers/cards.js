const Card = require('../models/card');
const { handleValidationError } = require('../errors/validationError');
const { handleNotFoundError, nullReturnedError } = require('../errors/notFoundError');
const { handleDefaultError } = require('../errors/defaultError');

const notFoundErrorMessage = 'Нет карточки с таким id';

function getCards(req, res) {
  Card.find({})
    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleDefaultError(res, error);
    });
}

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleValidationError(res, error);
    });
}

function removeCard(req, res) {
  Card.findByIdAndDelete(req.params.id)
    .orFail(nullReturnedError)

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleNotFoundError(res, error, notFoundErrorMessage);
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, //* добавили _id в массив, если его там нет
    { new: true },
  )
    .orFail(nullReturnedError)

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleNotFoundError(res, error, notFoundErrorMessage);
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, //* убрали _id из массива
    { new: true },
  )
    .orFail(nullReturnedError)

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      handleNotFoundError(res, error, notFoundErrorMessage);
    });
}

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
