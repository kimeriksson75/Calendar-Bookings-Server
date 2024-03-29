const bcrypt = require("bcryptjs");
const {
  ValidationError,
  NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const {
  validate,
  userSchema,
  authenticateSchema,
  refreshTokenSchema,
} = require("../_helpers/db.schema.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");
const { User, Residence, Token } = require("../_helpers/db");
const { sendEmail } = require("./user.email");
const {
  verifyToken,
  verifyRefreshToken,
  generateTokens,
} = require("../_helpers/token.validation");
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

  const existingResidence = await Residence.findById(params.residence);
  if (!existingResidence) {
    throw new NotFoundError(`Residence ${params.residence} does not exist`);
  }

  // implement .getSalt, https://blog.logrocket.com/password-hashing-node-js-bcrypt/
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
    throw new ValidationError(`Invalid password`);
  }
  // eslint-disable-next-line no-unused-vars
  const { hash, ...userWithoutHash } = user.toObject();
  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    ...userWithoutHash,
    refreshToken,
    accessToken,
  };
};

const authenticateWithToken = async ({ token }) => {
  console.log('authenticateWithToken', token)
  const existingToken = await Token.findOne({ token });
  if (!existingToken) {
    throw new NotFoundError(`Token ${token} does not exist`);
  }

  const user = await User.findById(existingToken.userId);
  if (!user) {
    throw new NotFoundError(`User connected to token ${token} does not exist`);
  }

  // eslint-disable-next-line no-unused-vars
  const { hash, ...userWithoutHash } = user.toObject();
  const { accessToken, refreshToken } = await generateTokens(user);

  await Token.findByIdAndRemove(existingToken._id);

  return {
    ...userWithoutHash,
    refreshToken,
    accessToken,
  };
};

const refreshToken = async (params) => {
  await validate(refreshTokenSchema, params);
  return await verifyRefreshToken(params.refreshToken);
};
const signOut = async ({ refreshToken, accessToken }) => {
  console.log(refreshToken, accessToken)
  // await validate(refreshTokenSchema, refreshToken);

  await Token.findOneAndRemove({
    token: refreshToken,
  });
  await Token.findOneAndRemove({
    token: accessToken,
  });
  

  return null;
};

const resetPasswordLink = async (userParam) => {
  const user = await User.findOne({ email: userParam.email });
  if (!user) {
    throw new NotFoundError(`User with email ${userParam.email} not found`);
  }
  const token = await verifyToken(user);
  const link = `${BASE_URL}/api/${API_VERSION}/users/reset-password-form/${user._id}/${token.token}`;
  await sendEmail(user.email, "Password reset", link);
  return user;
};

const resetPassword = async (id, token, params) => {
  const { password = null, verifyPassword = null } = params;
  console.log("resetPassword", 'password:', password, 'verifyPassword:',verifyPassword);
  if (!password) {
    throw new ValidationError(`Password is required`);
  }
  if (password !== verifyPassword) {
    throw new ValidationError("Passwords do not match");
  }

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


  const nonUniquePassword = await bcrypt.compare(password, user.hash);
  if (nonUniquePassword) {
    throw new ValidationError(
      `Password can not be the same as the old password`,
    );
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
  authenticateWithToken,
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
