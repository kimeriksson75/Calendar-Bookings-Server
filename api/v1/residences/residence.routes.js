const express = require('express');
const router = express.Router();
const { create, getAll, getById, _delete } = require('./residence.controller');

router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getById);
router.delete('/:id', _delete);

module.exports = router;