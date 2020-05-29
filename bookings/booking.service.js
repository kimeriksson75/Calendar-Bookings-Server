const db = require('_helpers/db');
const moment = require('moment');

const Booking = db.Booking;

const create = async bookingParam => {
  const booking = new Booking(bookingParam);
  await booking.save();
  return booking;
}

const update = async (id, bookingParam) => {
  // validate booking
  Booking.findById(id, (err, doc) => {
    if (err) throw 'Booking is not found';
  });

  return await Booking.findOneAndUpdate({ _id: id }, { $set: bookingParam }, (err, doc) => {
    if (err) throw err;
    return doc
  });
}
const getById = async (service, id) => await Booking.findById({ service, id });

const getAll = async service => await Booking.find({ service });

const getByDate = async (service, date) => {
  const start = moment(date).startOf('day');
  const end = moment(date).endOf('day');
  const booking = await Booking.findOne({ service, date: { '$gte': start, '$lte': end } });
  const doc = booking ? booking : {}
  return doc;
}
const getByMonth = async (service, date) => {
  const start = moment(date).startOf('month');
  const end = moment(date).endOf('month');
  const booking = await Booking.find({ service, date: { '$gte': start, '$lte': end } });
  const doc = booking ? booking : {}
  return doc;
}
const _delete = async id => await Booking.findOneAndRemove({ id });

module.exports = {
  create,
  getAll,
  getById,
  getByDate,
  getByMonth,
  update,
  delete: _delete
};