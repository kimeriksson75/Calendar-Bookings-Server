const express = require('express');
const router = express.Router();
const serviceService = require('./service.service');

const create = (req, res, next) => serviceService.create(req.body)
  .then((service) => res.json(service))
  .catch(err => next(err));

const getAll = (req, res, next) => serviceService.getAll()
  .then(services => res.json(services))
  .catch(err => next(err));

const getById = (req, res, next) => serviceService.getById(req.params.id)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

const getByResidence = (req, res, next) => serviceService.getByResidence(req.params.residence)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

const _delete = (req, res, next) => serviceService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))

router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:residence', getByResidence);
router.delete('/:id', _delete);

module.exports = router;