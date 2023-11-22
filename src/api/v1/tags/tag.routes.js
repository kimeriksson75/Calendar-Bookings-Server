const express = require("express");
const router = express.Router();
const { verify, connect, create, authenticate, getAll, get, _delete } = require('./tag.controller')

router.post('/verify/:id', verify);
router.post('/connect:/id', connect);
router.get('/authenticate/:id', authenticate);
router.post('/', create)
router.get('/', getAll);
router.get('/:id', get);
router.delete('/:id', _delete);

module.exports = router;
