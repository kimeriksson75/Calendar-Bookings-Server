const express = require('express');
const router = express.Router();
const { create, getByService, getById, getByDate, getByMonth, getByUser, update, _delete } = require('./booking.controller');

router.post('/create', create);
router.get('/:service', getByService);
router.get('/:service/date/:date', getByDate);
router.get('/:service/month/:date', getByMonth)
router.get('/:service/user/:id', getByUser)
//router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', _delete);

module.exports = router;