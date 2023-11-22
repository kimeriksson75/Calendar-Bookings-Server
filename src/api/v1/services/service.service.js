const db = require("../_helpers/db");
const {
  ValidationError,
  NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const { validate, serviceSchema } = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");

const Service = db.Service;
const Residence = db.Residence;
const create = async (serviceParam) => {
  await validate(serviceSchema, serviceParam);
  await isValidObjectId(serviceParam.residence);

  console.log({serviceParam})
  const existingResidence = await Residence.findById(serviceParam.residence);
  if (!existingResidence) {
    throw new NotFoundError(
      `Residence with id ${serviceParam.residence} does not exists`,
    );
  }
  const service = await Service.create(serviceParam);
  if (service) {
    return service;
  }
  throw new ValidationError(`Error while creating service`);
};

const update = async (id, serviceParam) => {
  await validate(serviceSchema, serviceParam);
  await isValidObjectId(id);
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

const getAll = async () => {
  const services = await Service.find();
  if (services) {
    return services;
  }
  throw new ValidationError(`Error while getting services`);
};

const getById = async (id) => {
  await isValidObjectId(id);
  const service = await Service.findById(id);
  if (service) {
    return service;
  }
  throw new NotFoundError(`Service with id ${id} does not exists`);
};

const getByResidence = async (residence) => {
  await isValidObjectId(residence);
  const services = await Service.find({ residence });
  if (services) {
    return services;
  }
  throw new ValidationError(
    `Error while getting services by residence id ${residence}`,
  );
};

const _delete = async (id) => {
  await isValidObjectId(id);
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
