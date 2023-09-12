const db = require('_helpers/db');
const moment = require('moment');

const Booking = db.Booking;

const create = async bookingParam => {
  try {
    const booking = await Booking.create(bookingParam);
    return booking || {};
  } catch (err) {
    throw new Error(err);
  }
}

const update = async (id, bookingParam) => {
  const existingBooking = await Booking.findById(id);
  if(!existingBooking) {
    throw new Error(`Booking with id ${bookingParam.id} does not exists`);
  }

  try {
    const updatedBooking = await Booking.findOneAndUpdate({ _id: id }, { $set: bookingParam });
    return updatedBooking || {};
  } catch (err) {
    throw new Error(err);
  }
}



const getByService = async service => {
  try {
    const bookings = await Booking.find({ service });
    return bookings || [];
  } catch (err) {
    throw new Error(err);
  }
}

const getByDate = async (service, date) => {
  try {
    const start = moment(date).startOf('day');
    const end = moment(date).endOf('day');
    const booking = await Booking.findOne({ service, date: { '$gte': start, '$lte': end } });
    return booking || {};
  } catch (err) {
    throw new Error(err);
  }
}

const getByMonth = async (service, date) => {
  try {
    const start = moment(date).startOf('month');
    const end = moment(date).endOf('month');
    const bookings = await Booking.find({ service, date: { '$gte': start, '$lte': end } });
    return bookings || [];
  } catch (err) {
    throw new Error(err);
  }
}
const getByUser = async (service, id) => {
  try {
    const bookings = await Booking.find({ service, 'timeslots.userId': id })
    return bookings || [];
  } catch (err) {
    throw new Error(err);
  }
}

const _delete = async id => {
  try {
    const booking = await Booking.findOneAndRemove(id);
    return booking || {};
  } catch (err) {
    throw new Error(err);
  }
}

/*
const getById = async (service, id) => {
  try {
    const booking = await Booking.findById({ service, id });
    return booking;
  } catch (err) {
    throw new Error(err);
  }
}
*/

module.exports = {
  create,
  getByService,
  getByDate,
  getByMonth,
  getByUser,
  update,
  delete: _delete
  //getById,
};