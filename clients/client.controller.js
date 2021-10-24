const express = require('express');
const router = express.Router();
const clientService = require('./client.service');

const create = (req, res, next) => clientService.create(req.body)
  .then((service) => res.json(service))
  .catch(err => next(err));

const getAll = (req, res, next) => clientService.getAll()
  .then(services => res.json(services))
  .catch(err => next(err));

const getById = (req, res, next) => clientService.getById(req.params.id)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

const getByUser = (req, res, next) => clientService.getByUser(req.params.user)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

const _delete = (req, res, next) => clientService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))

router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:user', getByUser);
router.delete('/:id', _delete);

module.exports = router;