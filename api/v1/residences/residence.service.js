const db = require("../_helpers/db");
const {
  ValidationError,
} = require("../../../_helpers/customErrors/customErrors");

const Residence = db.Residence;

const create = async (residenceParam) => {
  const residence = await Residence.create(residenceParam);
  if (residence) {
    return residence;
  }
  throw new ValidationError(`Error while creating residence`);
};

const getAll = async () => {
  const residences = await Residence.find();
  if (residences) {
    return residences;
  }
  throw new ValidationError(`Error while getting residences`);
};

const getById = async (id) => {
  const residence = await Residence.findById(id);
  if (residence) {
    return residence;
  }
  throw new ValidationError(`Error while getting residence by id ${id}`);
};

const update = async (id, residenceParam) => {
  const residence = await Residence.findOneAndUpdate(
    { _id: id },
    { $set: residenceParam },
    { new: true },
  );
  if (residence) {
    return residence;
  }
  throw new ValidationError(`Error while updating residence with id ${id}`);
};

const _delete = async (id) => {
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
