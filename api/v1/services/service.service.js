const db = require("../_helpers/db");
const {
  ValidationError,
  NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const Service = db.Service;

const create = async (serviceParam) => {
  const service = await Service.create(serviceParam);
  if (service) {
    return service;
  }
  throw new ValidationError(`Error while creating service`);
};

const getAll = async () => {
  const services = await Service.find();
  if (services) {
    return services;
  }
  throw new ValidationError(`Error while getting services`);
};

const getById = async (id) => {
  const service = await Service.findById(id);
  if (service) {
    return service;
  }
  throw new NotFoundError(`Service with id ${id} does not exists`);
};

const getByResidence = async (residence) => {
  const services = await Service.find({ residence });
  if (services) {
    return services;
  }
  throw new ValidationError(
    `Error while getting services by residence id ${residence}`,
  );
};

const update = async (id, serviceParam) => {
  const service = await Service.findOneAndUpdate(
    { _id: id },
    { $set: serviceParam },
    { new: true },
  );
  if (service) {
    return service;
  }
  throw new NotFoundError(`Service with id ${id} does not exists`);
};

const _delete = async (id) => {
  const service = await Service.findByIdAndRemove(id);
  if (service) {
    return service;
  }
  throw new NotFoundError(`Service with id ${id} does not exists`);
};

module.exports = {
  create,
  getAll,
  getById,
  getByResidence,
  update,
  delete: _delete,
};
