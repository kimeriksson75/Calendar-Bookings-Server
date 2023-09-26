const serviceService = require('./service.service');

exports.create = (req, res, next) => serviceService.create(req.body)
  .then((service) => res.status(201).json(service))
  .catch(err => next(err));

exports.getAll = (req, res, next) => serviceService.getAll()
  .then(services => res.status(200).json(services))
  .catch(err => next(err));

exports.getById = (req, res, next) => serviceService.getById(req.params.id)
  .then(service => service ? res.status(200).json(service) : res.status(404))
  .catch(err => next(err));

exports.getByResidence = (req, res, next) => serviceService.getByResidence(req.params.residence)
  .then(service => service ? res.status(200).json(service) : res.status(404))
  .catch(err => next(err));

exports.update = (req, res, next) => serviceService.update(req.params.id, req.body)
  .then((service) => res.status(200).json(service))
  .catch(err => next(err));
  
exports._delete = (req, res, next) => serviceService.delete(req.params.id)
  .then(() => res.status(200).json({}))
  .catch(err => next(err))
