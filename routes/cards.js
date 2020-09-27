const router = require('express').Router(); //* создали роутер
const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', removeCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router; //* экспортировали роутер
