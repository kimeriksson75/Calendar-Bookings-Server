const residenceService = require('./residence.service');

exports.create = (req, res, next) => residenceService.create(req.body)
  .then((apartment) => res.json(apartment))
  .catch(err => next(err));

exports.getAll = (req, res, next) => residenceService.getAll()
  .then(apartments => res.json(apartments))
  .catch(err => next(err));

exports.getById = (req, res, next) => residenceService.getById(req.params.id)
  .then(apartment => apartment ? res.json(apartment) : res.status(404))
  .catch(err => next(err));

exports._delete = (req, res, next) => residenceService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))
