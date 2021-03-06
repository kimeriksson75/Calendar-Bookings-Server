const db = require('_helpers/db');
const moment = require('moment');

const Service = db.Service;

const create = async serviceParam => {
  const service = new Service(serviceParam);
  await service.save();
  return service;
}

const getAll = async () => await Service.find();

const getById = async id => await Service.findById(id);

const getByResidence = async residence => await Service.find({ residence });

const _delete = async id => await Service.findOneAndRemove(id);

module.exports = {
  create,
  getAll,
  getById,
  getByResidence,
  delete: _delete
};