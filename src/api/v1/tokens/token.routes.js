const express = require('express')
const router = express.Router();
const {
    create,
    getAll,
    getById,
    getByUserId,
    update,
    _delete
} = require('./token.controller');

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/user/:id', getByUserId);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;