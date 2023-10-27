const bcrypt = require("bcryptjs");
const {
  ValidationError,
  NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const { validate, userSchema, authenticateSchema, refreshTokenSchema } = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");
const { User, Residence, Apartment, Token } = require("../_helpers/db");
const { sendEmail } = require("./user.email");
const { verifyToken, verifyRefreshToken, generateTokens } = require("../_helpers/token.validation")
const { BASE_URL, API_VERSION } = require("../../../config");

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
  delete user.password;

  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ValidationError(`Error while creating user`);
  }
  const token = await verifyToken(createdUser);
  // eslint-disable-next-line no-unused-vars
  const { hash, ...userWithoutHash } = createdUser.toObject();
  return {
    ...userWithoutHash,
    token: token.token,
  };
};

const authenticate = async (params) => {
  await validate(authenticateSchema, params);
  const { username, password } = params;
  const user = await User.findOne({ username });
  if (!user) {
    throw new NotFoundError(`Username ${username} is not found`);
  }
  
  const verifiedPassword = bcrypt.compareSync(password, user.hash);
  if (!verifiedPassword) {
    throw new ValidationError(`Invalid password`)
  }
  // eslint-disable-next-line no-unused-vars
  const { hash, ...userWithoutHash } = user.toObject();
  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    ...userWithoutHash,
    refreshToken,
    accessToken
  };  
};

const refreshToken = async (params) => {
  await validate(refreshTokenSchema, params);
  return await verifyRefreshToken(params.refreshToken)
}
const signOut = async (params) => {
  await validate(refreshTokenSchema, params);

  const userToken = await Token.findOneAndRemove({ token: params.refreshToken });
  if (!userToken) {
    throw new ValidationError("Invalid token")
  }

  return null;
}

const resetPasswordLink = async (userParam) => {
    const user = await User.findOne({ email: userParam.email });
    if (!user) {
      throw new NotFoundError(`User with email ${userParam.email} not found`);
    }
    const token = await verifyToken(user);
    const link = `${BASE_URL}/api/${API_VERSION}/users/reset-password-form/${user._id}/${token.token}`;
    console.log('link', link)
    await sendEmail(user.email, "Password reset", link);
  return user;
};

const resetPassword = async (id, token, params) => {
  const { password, verifyPassword } = params;
  if (password !== verifyPassword) {
    throw new ValidationError("Passwords do not match")
  }
  
  console.log('params', params)
  isValidObjectId(id);
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError(`User id ${id} does not exist`);
  }
  const _token = await Token.findOne({
    userId: id,
    token,
  });

  if (!_token) {
    throw new ValidationError(`Invalid or expired token`);
  }
  
  if (new Date(_token.expiresAt) < new Date()) {
    throw new ValidationError(`Token expired`);
  }

  if(!password) {
    throw new ValidationError(`Password is required`);
  }

  const nonUniquePassword = await bcrypt.compare(password, user.hash)
  if (nonUniquePassword) {
    throw new ValidationError(`Password can not be the same as the old password`);
  }
  
  user.hash = bcrypt.hashSync(password, 10);

  await user.save();
  await Token.findByIdAndRemove(_token._id);

  // eslint-disable-next-line no-unused-vars
  const { hash, ...userWithoutHash } = user.toObject();

  return {
    ...userWithoutHash,
  };
};

const update = async (id, params) => {
  if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }
  await validate(userSchema, params);
  isValidObjectId(id);
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: params },
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
  refreshToken,
  resetPasswordLink,
  resetPassword,
  signOut,
  create,
  getAll,
  getById,
  update,
  delete: _delete,
};
