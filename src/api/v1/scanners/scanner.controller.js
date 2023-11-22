const scannerService = require('./scanner.service');

exports.verify = (req, res, next) =>
    scannerService.verify(req.body)
        .then((data) => {
            res.status(200).json(data)
            
        })
        .catch(err => next(err))

exports.connect = (req, res, next) =>
    scannerService.connect(req.params.id)
        .then(({scanner, residences}) => res.render(
            'db/connect-scanner',
            {
                id: scanner,
                residences,
                message: null,
                error: null
            }
        ))
        .catch(err => next(err))
    

exports.create = (req, res, next) => 
    scannerService.create(req.params.id, req.body)
        .then(scanner => res.status(201).json({scanner}))
        .catch(err => next(err))

exports.authenticate = (req, res, next) =>
    scannerService.authenticate(req.params.id)
        .then(data => res.status(200).json(data))
        .catch(err => next(err))
