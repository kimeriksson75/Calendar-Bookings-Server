const userService = require("./user.service");

exports.authenticate = (req, res, next) =>
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.status(200).json(user)
        : res
            .status(400)
            .json({ message: "Username or password is incorrect" }),
    )
    .catch((err) => next(err));

exports.create = (req, res, next) =>
  userService
    .create(req.body)
    .then((user) =>
      user
        ? res.status(201).json(user)
        : res.status(400).json({ message: "Error while creating user" }),
    )
    .catch((err) => next(err));

exports.getAll = (req, res, next) =>
  userService
    .getAll()
    .then((users) => res.status(200).json(users))
    .catch((err) => next(err));

exports.getById = (req, res, next) =>
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.status(200).json(user) : res.status(404)))
    .catch((err) => next(err));

exports.update = (req, res, next) =>
  userService
    .update(req.params.id, req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));

exports._delete = (req, res, next) =>
  userService
    .delete(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));
