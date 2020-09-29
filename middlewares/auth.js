const jwt = require('jsonwebtoken');

//* модуль для повторной авторизации пользователя по jwt-токену из запроса
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  //* если jwt-токена нет в заголовке запроса - отправить ошибку
  if (!authorization && !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  //* если токен в наличии - извлечём только его, выкинув из заголовка приставку 'Bearer '
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    //* убедимся что пользователь прислал именно тот токен, который был выдан ему ранее
    //* вторым аргументом передадим секретный ключ, которым токен был подписан
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; //* записали пейлоуд в объект запроса

  next(); //* пропустили запрос дальше
};
