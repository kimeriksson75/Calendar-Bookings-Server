const bookingService = require('./booking.service');

exports.create = (req, res, next) => bookingService.create(req.body)
  .then((booking) => res.status(200).json(booking))
  .catch(err => next(err));

exports.getByService = (req, res, next) => bookingService.getByService(req.params.service)
  .then(bookings => res.status(200).json(bookings))
  .catch(err => next(err));

exports.getByDate = (req, res, next) => bookingService.getByDate(req.params.service, req.params.date)
  .then(booking => res.status(200).json(booking))
  .catch(err => next(err));
  
exports.getByMonth = (req, res, next) => bookingService.getByMonth(req.params.service, req.params.date)
  .then(booking => res.status(200).json(booking))
  .catch(err => next(err));
  
exports.getByUser = (req, res, next) => bookingService.getByUser(req.params.service, req.params.id)
  .then(booking => res.status(200).json(booking))
  .catch(err => next(err));
  
exports.update = (req, res, next) => bookingService.update(req.params.id, req.body)
  .then((booking) => res.status(200).json(booking))
  .catch(err => next(err));
  
exports._delete = (req, res, next) => bookingService.delete(req.params.id)
  .then((booking) => res.status(200).json(booking))
  .catch(err => next(err))
  
  /* @
  exports.getById = (req, res, next) => bookingService.getById(req.params.service, req.params.id)
    .then(booking => booking ? res.json(booking) : res.status(404))
    .catch(err => next(err));
  */