const express = require('express');
const router = express.Router();
const { authenticate, register, getAll, getById, update, _delete } = require('./user.controller');

router.post('/authenticate', authenticate);
router.post('/', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;