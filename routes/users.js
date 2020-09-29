const router = require('express').Router();
const {
  getUsers,
  getUser,
  setUserInfo,
  setUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', setUserInfo);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;
