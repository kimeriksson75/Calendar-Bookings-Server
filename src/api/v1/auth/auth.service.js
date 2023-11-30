const bcrypt = require("bcryptjs");

const {
    ValidationError,
    NotFoundError,
} = require("../../../_helpers/customErrors/customErrors");
const {
validate,
    authenticateSchema,
    refreshTokenSchema
} = require("../_helpers/db.schema.validation");
const { User, Token } = require("../_helpers/db");
const {
    generateTokens,
    verifyRefreshToken,
    verifyToken,
} = require("../_helpers/token.validation");
const { isValidObjectId } = require("../_helpers/db.document.validation");
const { sendEmail } = require("./user.email");
const { BASE_URL, API_VERSION } = require("../../../config");

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
    console.log("link", link);
    await sendEmail(user.email, "Password reset", link);
    return user;
  };
  
  const resetPassword = async (id, token, params) => {
    const { password, verifyPassword } = params;
    console.log("resetPassword", password, verifyPassword);
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
  
    if (!password) {
      throw new ValidationError(`Password is required`);
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
  
module.exports = {
    authenticate,
    authenticateWithToken,
    refreshToken,
    resetPasswordLink,
    resetPassword,
    signOut,
};