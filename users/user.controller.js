
const userService = require('./user.service');

exports.authenticate = (req, res, next) => userService.authenticate(req.body)
  .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
  .catch(err => next(err));

exports.register = (req, res, next) => userService.register(req.body)
  .then((user) => user ? res.status(200).json(user) : res.status(400).json({ message: 'Invalid user data' }))
  .catch(err => next(err));

exports.getAll = (req, res, next) => userService.getAll()
  .then(users => res.json(users))
  .catch(err => next(err));

exports.getById = (req, res, next) => userService.getById(req.params.id)
  .then(user => user ? res.json(user) : res.status(404))
  .catch(err => next(err));

exports.update = (req, res, next) => userService.update(req.params.id, req.body)
  .then((user) => res.json(user))
  .catch(err => next(err));

exports._delete = (req, res, next) => userService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))
