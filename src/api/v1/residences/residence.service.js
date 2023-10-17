const db = require("../_helpers/db");
const {
  ValidationError,
} = require("../../../_helpers/customErrors/customErrors");
const {
  validate,
  residenceSchema,
} = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");

const Residence = db.Residence;

const create = async (residenceParam) => {
  await validate(residenceSchema, residenceParam);
  const residence = await Residence.create(residenceParam);
  if (residence) {
    return residence;
  }
  throw new ValidationError(`Error while creating residence`);
};

const update = async (id, residenceParam) => {
  validate(residenceSchema, residenceParam);
  isValidObjectId(id);
  const residence = await Residence.findByIdAndUpdate(
    id,
    { $set: residenceParam },
    { new: true },
  );
  if (residence) {
    return residence;
  }
  throw new ValidationError(`Error while updating residence with id ${id}`);
};

const getAll = async () => {
  const residences = await Residence.find();
  if (residences) {
    return residences;
  }
  throw new ValidationError(`Error while getting residences`);
};

const getById = async (id) => {
  isValidObjectId(id);
  const residence = await Residence.findById(id);
  if (residence) {
    return residence;
  }
  throw new ValidationError(`Error while getting residence by id ${id}`);
};

const _delete = async (id) => {
  isValidObjectId(id);
  const residence = await Residence.findByIdAndRemove(id);
  if (residence) {
    return residence;
  }
  throw new ValidationError(`Error while deleting residence with id ${id}`);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: _delete,
};
