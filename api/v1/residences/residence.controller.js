const residenceService = require("./residence.service");

exports.create = (req, res, next) =>
  residenceService
    .create(req.body)
    .then((residence) => res.status(201).json(residence))
    .catch((err) => next(err));

exports.getAll = (req, res, next) =>
  residenceService
    .getAll()
    .then((residences) => res.status(200).json(residences))
    .catch((err) => next(err));

exports.getById = (req, res, next) =>
  residenceService
    .getById(req.params.id)
    .then((residence) =>
      residence ? res.status(200).json(residence) : res.status(404),
    )
    .catch((err) => next(err));

exports.update = (req, res, next) =>
  residenceService
    .update(req.params.id, req.body)
    .then((residence) => res.status(200).json(residence))
    .catch((err) => next(err));

exports._delete = (req, res, next) =>
  residenceService
    .delete(req.params.id)
    .then(() => res.status(200).json({}))
    .catch((err) => next(err));
