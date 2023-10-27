const tokeService = require("./token.service");

exports.create = (req, res, next) =>
  tokeService
    .create(req.body)
    .then((token) => res.status(201).json(token))
    .catch((err) => next(err));

exports.getAll = (req, res, next) =>
  tokeService
    .getAll()
    .then((tokens) => res.status(200).json(tokens))
    .catch((err) => next(err));

exports.getById = (req, res, next) =>
  tokeService
    .getById(req.params.id)
    .then((token) => (token ? res.status(200).json(token) : res.status(404)))
    .catch((err) => next(err));

exports.getByUserId = (req, res, next) =>
  tokeService
    .getByUserId(req.params.id)
    .then((token) => res.status(200).json(token))
    .catch((err) => next(err));

exports.update = (req, res, next) =>
  tokeService
    .update(req.params.id)
    .then((token) => res.status(200).json(token))
    .catch((err) => next(err));

exports._delete = (req, res, next) =>
  tokeService
    .delete(req.params.id)
    .then(() => res.status(200).json({}))
    .catch((err) => next(err));
