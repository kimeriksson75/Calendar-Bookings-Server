const db = require("../_helpers/db");
const moment = require("moment");
const {
  NotFoundError,
  ValidationError,
} = require("../../../_helpers/customErrors/customErrors");
const { validate, bookingSchema } = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");

const Booking = db.Booking;
const Service = db.Service;
const User = db.User;

const create = async (bookingParam) => {
  await validate(bookingSchema, bookingParam);
  const booking = await Booking.create(bookingParam);
  if (booking) {
    return booking;
  }
  throw new ValidationError(`Error while creating booking`);
};

const update = async (id, bookingParam) => {
  await validate(bookingSchema, bookingParam);
  const existingBooking = await Booking.findById(id);
  if (!existingBooking) {
    throw new NotFoundError(`Booking with id ${id} does not exists`);
  }
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { $set: bookingParam },
    { new: true },
  );
  if (updatedBooking) {
    return updatedBooking;
  }
  throw new ValidationError(`Error while updating booking`);
};

const getById = async (id) => {
  isValidObjectId(id);
  const booking = await Booking.findById(id);
  if (booking) {
    return booking;
  }
  throw new NotFoundError(`Booking with id ${id} does not exists`);
};

const getAll = async () => {
  const bookings = await Booking.find();
  if (bookings) {
    return bookings;
  }
  throw new ValidationError(`Error while getting bookings`);
};

const getByService = async (service) => {
  isValidObjectId(service);
  const existingService = await Service.findById(service);
  if (!existingService) {
    throw new NotFoundError(`Service with id ${service} does not exists`);
  }

  const bookings = await Booking.find({ service });
  if (bookings && bookings.length > 0) {
    return bookings;
  }
  throw new ValidationError(`Error while getting bookings`);
};

const getByServiceDate = async (service, date) => {
  isValidObjectId(service);
  const existingService = await Service.findById(service);
  if (!existingService) {
    throw new NotFoundError(`Service with id ${service} does not exists`);
  }
  const start = moment(date).startOf("day");
  const end = moment(date).endOf("day");
  const booking = await Booking.findOne({
    service,
    date: { $gte: start, $lte: end },
  });
  if (booking) {
    return booking;
  }
  throw new NotFoundError(
    `Booking related to service ${service} and date ${date} does not exists`,
  );
};

const getByServiceMonth = async (service, date) => {
  isValidObjectId(service);
  const existingService = await Service.findById(service);
  if (!existingService) {
    throw new NotFoundError(`Service with id ${service} does not exists`);
  }
  const start = moment(date).startOf("month");
  const end = moment(date).endOf("month");
  const bookings = await Booking.find({
    service,
    date: { $gte: start, $lte: end },
  });
  if (bookings && bookings.length > 0) {
    return bookings;
  }
  throw new NotFoundError(
    `Booking with service ${service} and date ${date} does not exists`,
  );
};
const getByServiceUser = async (service, id) => {
  isValidObjectId(service);
  isValidObjectId(id);
  const existingService = await Service.findById(service);
  if (!existingService) {
    throw new NotFoundError(`Service with id ${service} does not exists`);
  }

  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw new NotFoundError(`User with id ${id} does not exists`);
  }

  const bookings = await Booking.find({ service, "timeslots.userid": id });
  if (bookings && bookings.length > 0) {
    return bookings;
  }
  throw new NotFoundError(
    `Booking with service ${service} and user ${id} does not exists`,
  );
};

const _delete = async (id) => {
  isValidObjectId(id);
  const booking = await Booking.findByIdAndRemove(id);
  if (booking) {
    return booking;
  }
  throw new NotFoundError(`Booking with id ${id} does not exists`);
};

module.exports = {
  create,
  getAll,
  getById,
  getByService,
  getByServiceDate,
  getByServiceMonth,
  getByServiceUser,
  update,
  delete: _delete,
};
