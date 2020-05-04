const db = require('_helpers/db');
const moment = require('moment');

const Booking = db.Booking;

const create = async bookingParam => {
  const booking = new Booking(bookingParam);
  await booking.save();
  return booking;
}


const update = async (id, bookingParam) => {
  console.log('id', id)
  Booking.findById(id, (err, doc) => {
    if (err) throw 'Booking not found';
    console.log('document validation', doc)
  });
  // validate booking

  return await Booking.findOneAndUpdate({ _id: id }, { $set: bookingParam }, (err, doc) => {
    if (err) throw err;
    console.log('updated doc', doc);
    return doc
  });
}

const getAll = async () => await Booking.find();

const getById = async id => await Booking.findById(id);

const getByDate = async date => {
  console.log('getByDate', date);
  const start = moment(date).startOf('day');
  const end = moment(date).endOf('day');
  console.log('start', date, 'end', end);
  const booking = await Booking.findOne({ date: { '$gte': start, '$lte': end } });
  const doc = booking ? booking : {}
  console.log('getByDate', doc);
  return doc;
}
const _delete = async id => await Booking.findOneAndRemove(id);

module.exports = {
  create,
  getAll,
  getById,
  getByDate,
  update,
  delete: _delete
};