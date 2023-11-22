const express = require("express");
const router = express.Router();

const { verify, create, connect, authenticate } = require('./scanner.controller');

router.post('/verify/:id', verify);
router.get('/connect/:id', connect);
router.get('/authenticate/:id', authenticate);
router.post('/:id', create);

module.exports = router;