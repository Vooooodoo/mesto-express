const router = require('express').Router();
const { validateId, validateUserInfo, validateUserAvatar } = require('../middlewares/reqValidation');
const {
  getUsers,
  getUser,
  setUserInfo,
  setUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', validateId, getUser); //* вторым аргументом валидируем данные от пользователя, прежде чем запустить контроллер
router.patch('/me', validateUserInfo, setUserInfo);
router.patch('/me/avatar', validateUserAvatar, setUserAvatar);

module.exports = router;
