const db = require('_helpers/db');
const moment = require('moment');

const Apartment = db.Apartment;

const create = async apartmentParam => {
  const apartment = new Apartment(apartmentParam);
  await apartment.save();
  return apartment;
}

const getAll = async residence => await Apartment.find({ residence });

const getById = async id => await Apartment.findById(id);

const _delete = async id => await Apartment.findOneAndRemove(id);

module.exports = {
  create,
  getAll,
  getById,
  delete: _delete
};