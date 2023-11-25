const db = require("../_helpers/db");
const moment = require("moment");
const {
  NotFoundError,
  ValidationError,
} = require("../../../_helpers/customErrors/customErrors");
const { validate, bookingSchema } = require("../_helpers/db.schema.validation");
const {
  isValidObjectId,
  isValidDate,
} = require("../_helpers/db.document.validation");

const Booking = db.Booking;
const Service = db.Service;
const User = db.User;

const getUserMonthlyBookings = async (userId, date, limit) => {
  isValidObjectId(userId);
  isValidDate(date);
  const start = moment(date).startOf("month");
  const end = moment(date).endOf("month");
  const bookings = await Booking.find({
    $or: [{
      "timeslots.userid": userId,
      date: { $gte: start, $lte: end },
    }, {
      "alternateTimeslots.userid": userId,
      date: { $gte: start, $lte: end },
    }],
  });
  if (!bookings) {
    return false;
  }
  return bookings.length >= limit
};

const isUpdateDeleteRequest = (current, update) => {
  const issuedTimeslots = JSON.stringify(current.timeslots) === JSON.stringify(update.timeslots) ? ['alternateTimeslots'] : ['timeslots']
  console.log(issuedTimeslots)
  const currentBookedTimeslots = current[issuedTimeslots].reduce((acc, timeslot) => {
    if (timeslot.userid) {
      acc.push(timeslot.timeslot)
    }
    return acc
  },[])
  const updateBookedTimeslots = update[issuedTimeslots].reduce((acc, timeslot) => {
    if (timeslot.userid) {
      acc.push(timeslot.timeslot)
    }
    return acc
  }, [])
  console.log(currentBookedTimeslots.length, updateBookedTimeslots.length)
  return currentBookedTimeslots.length > updateBookedTimeslots.length;
}
const create = async (userId, bookingParam) => {
  await validate(bookingSchema, bookingParam);
  isValidObjectId(bookingParam.service);
  const existingService = await Service.findById(bookingParam.service);
  if (!existingService) {
    throw new NotFoundError(
      `Service with id ${bookingParam.service} does not exists`,
    );
  }
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new NotFoundError(`User with id ${userId} does not exists`);
  }
  const { limit } = existingService;
  const userMonthlyBookings = await getUserMonthlyBookings(userId, bookingParam.date, limit);
  
  if (userMonthlyBookings) {
    throw new ValidationError(
      `User ${existingUser.username} has reached the limit of ${limit} bookings per month`,
    );
  }
  
  const booking = await Booking.create(bookingParam);
  if (booking) {
    global.io.emit('booking_updates', {
      service: bookingParam.service,
      date: bookingParam.date,
    });

    return booking;
  }
  
  throw new ValidationError(`Error while creating booking`);
};

const update = async (userId, id, bookingParam) => {
  await validate(bookingSchema, bookingParam);
  isValidObjectId(id);

  const existingService = await Service.findById(bookingParam.service);
  if (!existingService) {
    throw new NotFoundError(
      `Service with id ${bookingParam.service} does not exists`,
    );
  }
  const existingBooking = await Booking.findById(id);
  if (!existingBooking) {
    throw new NotFoundError(`Booking with id ${id} does not exists`);
  }
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new NotFoundError(`User with id ${userId} does not exists`);
  }
  const { limit } = existingService;
  const isDeleteRequest = isUpdateDeleteRequest(existingBooking, bookingParam);
  const userMonthlyBookings = await getUserMonthlyBookings(userId, bookingParam.date, limit);
  if (userMonthlyBookings && !isDeleteRequest) {
    throw new ValidationError(
      `You have reached the limit of ${limit} bookings per month`,
    );
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { $set: bookingParam },
    { new: true },
  );
  if (updatedBooking) {
    global.io.emit('booking_updates', {
      service: bookingParam.service,
      date: bookingParam.date,
    });
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
  if (bookings) {
    return bookings;
  }
  throw new ValidationError(`Error while getting bookings`);
};

const getByServiceDate = async (service, date) => {
  isValidObjectId(service);
  isValidDate(date);
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
  return booking || {};
};

const getByServiceMonth = async (service, date) => {
  isValidObjectId(service);
  isValidDate(date);
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
  if (bookings) {
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

  const bookings = await Booking.find({
    $or: [{
      "timeslots.userid": id,
      service,
    }, {
      "alternateTimeslots.userid": id,
      service,
    }]
  });
  if (bookings) {
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
