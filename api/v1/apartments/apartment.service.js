const db = require('../_helpers/db');
const moment = require('moment');

const Apartment = db.Apartment;

const create = async apartmentParam => {
  const existingApartment = await Apartment.findOne({ name: apartmentParam.name, residence: apartmentParam.residence })
  if (existingApartment) {
    throw new Error (`Apartment with name ${apartmentParam.name} already exists`);
  }
  
  try {
    const apartment = await Apartment.create(apartmentParam);
    return apartment;
  } catch (err) {
    throw new Error(err);
  }
}

const getAll = async () => {
  try {
    const apartments = await Apartment.find();
    return apartments;
  } catch (err) {
    throw new Error(err);
  }
}

const getByResidence = async residence => {
  try {
    const apartments = await Apartment.find({ residence });
    return apartments;
  } catch (err) {
    throw new Error(err);
  }
}

const getById = async id => {
  try {
    const apartment = await Apartment.findById(id);
    return apartment;
  } catch (err) {
    throw new Error(err);
  }
}

const _delete = async id => {
  try {
    await Apartment.findByIdAndRemove(id);
    return null;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  create,
  getAll,
  getByResidence,
  getById,
  delete: _delete
};