const express = require('express');
const router = express.Router();
const { create, getAll, getByResidence, getById, _delete } = require('./apartment.controller');

router.post('/create', create);
router.get('/', getAll);
router.get('/residence/:residence', getByResidence);
router.get('/:id', getById);
router.delete('/:id', _delete);

module.exports = router;