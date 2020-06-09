const express = require('express');
const router = express.Router();
const bookingService = require('./booking.service');

const create = (req, res, next) => bookingService.create(req.body)
  .then((booking) => res.json(booking))
  .catch(err => next(err));

const getAll = (req, res, next) => bookingService.getAll(req.params.service)
  .then(bookings => res.json(bookings))
  .catch(err => next(err));

const getById = (req, res, next) => bookingService.getById(req.params.service, req.params.id)
  .then(booking => booking ? res.json(booking) : res.status(404))
  .catch(err => next(err));

const getByDate = (req, res, next) => bookingService.getByDate(req.params.service, req.params.date)
  .then(booking => booking ? res.json(booking) : res.status(404))
  .catch(err => next(err));

const getByMonth = (req, res, next) => bookingService.getByMonth(req.params.service, req.params.date)
  .then(booking => booking ? res.json(booking) : res.status(404))
  .catch(err => next(err));

const getByUser = (req, res, next) => bookingService.getByUser(req.params.service, req.params.id)
  .then(booking => booking ? res.json(booking) : res.status(404))
  .catch(err => next(err));

const update = (req, res, next) => bookingService.update(req.params.id, req.body)
  .then((booking) => res.json(booking))
  .catch(err => next(err));

const _delete = (req, res, next) => bookingService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))

router.post('/create', create);
router.get('/:service', getAll);
router.get('/:service/date/:date', getByDate);
router.get('/:service/month/:date', getByMonth)
router.get('/:service/user/:id', getByUser)
router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', _delete);

module.exports = router;