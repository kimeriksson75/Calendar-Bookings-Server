
const express = require('express');
const router = express.Router();
const activityService = require('./activity.service');

const create = (req, res, next) => activityService.create(req.body)
  .then((service) => res.json(service))
  .catch(err => next(err));

const getAll = (req, res, next) => activityService.getAll()
  .then(services => res.json(services))
  .catch(err => next(err));

const getById = (req, res, next) => activityService.getById(req.params.id)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

const getByUser = (req, res, next) => activityService.getByUser(req.params.client)
  .then(service => service ? res.json(service) : res.status(404))
  .catch(err => next(err));

const _delete = (req, res, next) => activityService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))

router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:client', getByUser);
router.delete('/:id', _delete);

module.exports = router;