const express = require('express');
const router = express.Router();
const bookingService = require('./booking.service');

const create = (req, res, next) => bookingService.create(req.body)
  .then((booking) => res.json(booking))
  .catch(err => next(err));

const getAll = (req, res, next) => bookingService.getAll()
  .then(bookings => res.json(bookings))
  .catch(err => next(err));

const getById = (req, res, next) => bookingService.getById(req.params.id)
  .then(booking => booking ? res.json(booking) : res.status(404))
  .catch(err => next(err));

const getByDate = (req, res, next) => bookingService.getByDate(req.params.date)
  .then(booking => booking ? res.json(booking) : res.status(404))
  .catch(err => next(err));

const update = (req, res, next) => bookingService.update(req.params.id, req.body)
  .then((booking) => {
    console.log('update controller', booking)
    res.json(booking)
  })
  .catch(err => next(err));

const _delete = (req, res, next) => bookingService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))

router.post('/create', create);
router.get('/', getAll);
router.get('/date/:date', getByDate);
router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', _delete);

module.exports = router;