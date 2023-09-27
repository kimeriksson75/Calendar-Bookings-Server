const bookingService = require("./booking.service");

exports.create = (req, res, next) =>
  bookingService
    .create(req.body)
    .then((booking) => res.status(201).json(booking))
    .catch((err) => next(err));

exports.getAll = (req, res, next) =>
  bookingService
    .getAll()
    .then((bookings) => res.status(200).json(bookings))
    .catch((err) => next(err));

exports.getByService = (req, res, next) =>
  bookingService
    .getByService(req.params.service)
    .then((bookings) => res.status(200).json(bookings))
    .catch((err) => next(err));

exports.getByServiceDate = (req, res, next) =>
  bookingService
    .getByServiceDate(req.params.service, req.params.date)
    .then((booking) => res.status(200).json(booking))
    .catch((err) => next(err));

exports.getByServiceMonth = (req, res, next) =>
  bookingService
    .getByServiceMonth(req.params.service, req.params.date)
    .then((booking) => res.status(200).json(booking))
    .catch((err) => next(err));

exports.getByServiceUser = (req, res, next) =>
  bookingService
    .getByServiceUser(req.params.service, req.params.id)
    .then((booking) => res.status(200).json(booking))
    .catch((err) => next(err));

exports.getById = (req, res, next) =>
  bookingService
    .getById(req.params.id)
    .then((booking) => (booking ? res.json(booking) : res.status(404)))
    .catch((err) => next(err));

exports.update = (req, res, next) =>
  bookingService
    .update(req.params.id, req.body)
    .then((booking) => res.status(200).json(booking))
    .catch((err) => next(err));

exports._delete = (req, res, next) =>
  bookingService
    .delete(req.params.id)
    .then((booking) => res.status(200).json(booking))
    .catch((err) => next(err));
