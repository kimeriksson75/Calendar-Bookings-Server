const apartmentService = require('./apartment.service');

exports.create = (req, res, next) => apartmentService.create(req.body)
  .then((apartment) => res.status(200).json(apartment))
  .catch(err => next(err));

exports.getAll = (req, res, next) => apartmentService.getAll()
  .then(apartments => res.status(200).json(apartments))
  .catch(err => next(err));
  
exports.getByResidence = (req, res, next) => apartmentService.getByResidence(req.params.residence)
  .then(apartments => res.status(200).json(apartments))
  .catch(err => next(err));

exports.getById = (req, res, next) => apartmentService.getById(req.params.id)
  .then(apartment => apartment ? res.status(200).json(apartment) : res.status(404))
  .catch(err => next(err));

exports._delete = (req, res, next) => apartmentService.delete(req.params.id)
  .then(() => res.status(200).json({}))
  .catch(err => next(err))
