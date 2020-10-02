const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

function getCards(req, res, next) {
  Card.find({})
    .then((data) => {
      res.send(data);
    })

    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      throw new ValidationError(error.message);
    })

    .catch(next);
}

function removeCard(req, res, next) {
  const currentUser = req.user._id;

  Card.findById(req.params.id)
    .orFail(new Error('NullReturned'))

    .then((card) => {
      if (card.owner.toString() !== currentUser) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }

      Card.findByIdAndDelete(req.params.id)
        .then((data) => {
          res.send(data);
        })

        .catch(next);
    })

    .catch((error) => {
      throw new NotFoundError(error.message);
    })

    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, //* добавили _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NullReturned'))

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      throw new NotFoundError(error.message);
    })

    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, //* убрали _id из массива
    { new: true },
  )
    .orFail(new Error('NullReturned'))

    .then((data) => {
      res.send(data);
    })

    .catch((error) => {
      throw new NotFoundError(error.message);
    })

    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
