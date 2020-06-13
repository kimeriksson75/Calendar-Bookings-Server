const express = require('express');
const router = express.Router();
const residenceService = require('./residence.service');

const create = (req, res, next) => residenceService.create(req.body)
  .then((apartment) => res.json(apartment))
  .catch(err => next(err));

const getAll = (req, res, next) => residenceService.getAll()
  .then(apartments => res.json(apartments))
  .catch(err => next(err));

const getById = (req, res, next) => residenceService.getById(req.params.id)
  .then(apartment => apartment ? res.json(apartment) : res.status(404))
  .catch(err => next(err));

const _delete = (req, res, next) => residenceService.delete(req.params.id)
  .then(() => res.json({}))
  .catch(err => next(err))

router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getById);
router.delete('/:id', _delete);

module.exports = router;