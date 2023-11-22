const tagService = require('./tag.service')

exports.verify = (req, res, next) =>
    tagService.verify(req.body)
        .then(data => res.status(200).json(data))
        .catch(err => next(err))

exports.connect = (req, res, next) =>
    tagService.connect(req.params.id)
        .then(({tag, users}) => res.render(
            'db/connect-tag',
            {
                id: tag,
                users,
                message: null,
                error: null
            }
        ))
        .catch(err => next(err))
exports.create = (req, res, next) =>
    tagService.create(req.body)
        .then(tag => res.status(200).json({ tag }))
        .catch(err => next(err))
exports.authenticate = (req, res, next) =>
    tagService.authenticate(req.params.id)
        .then(data => res.status(200).json(data))
        .catch(err => next(err))
        
exports.getAll = (req, res, next) =>
    tagService.getAll()
        .then(tags => res.status(200).json({ tags }))
        .catch(err => next(err))

exports.get = (req, res, next) =>
    tagService.get(req.params.id)
        .then(tag => res.status(200).json({ tag }))
        .catch(err => next(err))

exports._delete = (req, res, next) =>
    tagService.delete(req.params.id)
        .then(tag => res.status(200).json({ tag }))
        .catch(err => next(err))
