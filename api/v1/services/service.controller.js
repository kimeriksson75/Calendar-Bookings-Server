const serviceService = require('./service.service');

exports.create = (req, res, next) => serviceService.create(req.body)
  .then((service) => res.json(service))
  .catch(err => next(err));

exports.getAll = (req, res, next) => serviceService.getAll()
  .then(services => res.json(services))
  .catch(err => next(err));

exports.getById = (req, res, next) => serviceService.getById(req.params.id)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

exports.getByResidence = (req, res, next) => serviceService.getByResidence(req.params.residence)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

exports._delete = (req, res, next) => serviceService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))
