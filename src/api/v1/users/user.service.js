const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  ValidationError,
  NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const { validate, userSchema } = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");

const { User, Residence, Apartment } = require("../_helpers/db");

const create = async (params) => {
  await validate(userSchema, params);

  const existingUserName = await User.findOne({
    username: params.username,
    email: params.email,
  });
  if (existingUserName) {
    throw new ValidationError(
      `User ${params.username}, ${params.email} already exists`,
    );
  }

  const existingUserApartment = await User.findOne({
    apartment: params.apartment,
  });
  if (existingUserApartment) {
    throw new ValidationError(
      `Apartment ${params.apartment} is already taken`,
    );
  }

  const existingResidence = await Residence.findById(params.residence);
  if (!existingResidence) {
    throw new NotFoundError(`Residence ${params.residence} does not exist`);
  }

  const existingApartment = await Apartment.findById(params.apartment);
  if (!existingApartment) {
    throw new NotFoundError(`Apartment ${params.apartment} does not exist`);
  }

  const user = { ...params };
  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ValidationError(`Error while creating user`);
  }
  return createdUser;
};

const authenticate = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new NotFoundError(`Username ${username} is not found`);
  }

  if (user && bcrypt.compareSync(password, user.hash)) {
    // eslint-disable-next-line no-unused-vars
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user._id }, process.env.ACCESS_TOKEN_SECRET);
    return {
      ...userWithoutHash,
      token,
    };
  }
};

const update = async (id, userParam) => {
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }
  await validate(userSchema, userParam);
  isValidObjectId(id);
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: userParam },
    { new: true },
  );
  if (updated) {
    return updated;
  }
  throw new NotFoundError(`User id ${id} does not exist`);
};

const getAll = async () => {
  const users = await User.find();
  if (users) {
    return users;
  }
  throw new NotFoundError(`Users not found`);
};

const getById = async (id) => {
  isValidObjectId(id);
  const user = await User.findById(id);
  if (user) {
    return user;
  }
  throw new NotFoundError(`User id ${id} does not exist`);
};

const _delete = async (id) => {
  isValidObjectId(id);
  const user = await User.findByIdAndRemove(id);
  if (user) {
    return user;
  }
  throw new NotFoundError(`User id ${id} does not exist`);
};

module.exports = {
  authenticate,
  create,
  getAll,
  getById,
  update,
  delete: _delete,
};
