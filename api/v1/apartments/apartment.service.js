const db = require("../_helpers/db");
const {
  ValidationError,
  NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const Apartment = db.Apartment;
const {
  validate,
  apartmentSchema,
} = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");

const create = async (apartmentParam) => {
  await validate(apartmentSchema, apartmentParam);

  const apartment = Apartment.create(apartmentParam);
  if (apartment) {
    return apartment;
  }
  throw new ValidationError(`Error while creating apartment`);
};

const getAll = async () => {
  const apartments = await Apartment.find();
  if (apartments) {
    return apartments;
  }
  throw new ValidationError(`Error while getting apartments`);
};

const getByResidence = async (residence) => {
  const apartments = await Apartment.find({ residence });
  if (apartments) {
    return apartments;
  }
  new ValidationError(
    `Error while getting apartments by residence id ${residence}`,
  );
};

const getById = async (id) => {
  isValidObjectId(id);

  const apartment = await Apartment.findById(id);
  if (apartment) {
    return apartment;
  }
  throw new NotFoundError(`Apartment with id ${id} does not exists`);
};

const update = async (id, apartmentParam) => {
  await validate(apartmentSchema, apartmentParam);
  isValidObjectId(id);

  const apartment = await Apartment.findOneAndUpdate(
    { _id: id },
    { $set: apartmentParam },
    { new: true },
  );
  if (apartment) {
    return apartment;
  }
  throw new NotFoundError(`Apartment with id ${id} does not exists`);
};

const _delete = async (id) => {
  isValidObjectId(id);
  const apartment = await Apartment.findByIdAndRemove(id);
  if (apartment) {
    return apartment;
  }
  throw new NotFoundError(`Apartment with id ${id} does not exists`);
};

module.exports = {
  create,
  getAll,
  getByResidence,
  getById,
  update,
  delete: _delete,
};
