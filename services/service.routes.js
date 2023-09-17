const express = require('express');
const router = express.Router();
const { create, getAll, getById, getByResidence, _delete } = require('./service.controller');

router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/residence/:residence', getByResidence);
router.delete('/:id', _delete);

module.exports = router;