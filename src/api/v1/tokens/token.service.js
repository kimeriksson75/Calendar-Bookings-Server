const { ACCESS_TOKEN_SECRET } = require("../../../config");
const jwt = require("jsonwebtoken");
const db = require("../_helpers/db");
const {
  ValidationError,
  NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const { validate, tokenSchema } = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");

const Token = db.Token;

const create = async (params) => {
  await validate(tokenSchema, params);
  const { userId } = params;
  const generatedAccessToken = jwt.sign(userId, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  })
  const token = await new Token({
    userId,
    token: generatedAccessToken,
  }).save();
  if (token) {
    return token;
  }
  throw new ValidationError(`Error while creating token`);
};

const update = async (id) => {
  isValidObjectId(id);
  const token = await Token.findByIdAndUpdate(
    id,
    { $set: { expiresAt: new Date() } },
    { new: true },
  );
  if (!token) {
    throw new NotFoundError(`Token with id ${id} does not exist`);
  }
  return token;
};
const getAll = async () => {
  const tokens = await Token.find();
  if (!tokens) {
    throw new NotFoundError(`Error while getting tokens`);
  }
  return tokens;
};
const getById = async (id) => {
  isValidObjectId(id);
  const token = await Token.findById(id);
  if (!token) {
    throw new NotFoundError(`Token with id ${id} does not exist`);
  }
  return token;
};

const getByUserId = async (id) => {
  const token = await Token.findOne({ userId: id });
  if (!token) {
    throw new NotFoundError(`Token with user id ${id} does not exist`);
  }
  return token;
};

const _delete = async (id) => {
  isValidObjectId(id);
  const token = await Token.findByIdAndRemove(id);
  if (!token) {
    throw new ValidationError(`Token with id ${id} does not exist`);
  }
  return token;
};

module.exports = {
  create,
  getAll,
  getById,
  getByUserId,
  update,
  delete: _delete,
};
