const db = require('../_helpers/db');
const moment = require('moment');

const Service = db.Service;

const create = async serviceParam => {
  try {
    const service = await Service.create(serviceParam);
    return service;
  } catch (err) {
    throw new Error(err);
  }
}

const getAll = async () => {
  try {
    const services = await Service.find();
    return services;
  } catch (err) {
    throw new Error(err);
  }
}

const getById = async id => {
  try {
    const service = await Service.findById(id);
    return service;
  } catch (err) {
    throw new Error(err);
  }
}

const getByResidence = async residence => {
  try {
    const services = await Service.find({ residence });
    return services;
  } catch (err) {
    throw new Error(err);
  }
}

const _delete = async id => {
  try {
    await Service.findByIdAndRemove(id);
    return null;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  getByResidence,
  delete: _delete
};