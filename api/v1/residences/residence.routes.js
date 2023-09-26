const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, _delete } = require('./residence.controller');

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', _delete);

module.exports = router;