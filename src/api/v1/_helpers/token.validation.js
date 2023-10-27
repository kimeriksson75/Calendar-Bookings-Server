const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = require('../../../config');
const jwt = require("jsonwebtoken");
const {
    ValidationError,
  } = require("../../../_helpers/customErrors/customErrors");

const { Token } = require('./db')
const { isValidObjectId } = require('./db.document.validation')

const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(
            payload,
            ACCESS_TOKEN_SECRET,
            { expiresIn: "14m" }
        );
        const refreshToken = jwt.sign(
            payload,
            REFRESH_TOKEN_SECRET,
            { expiresIn: "30d" }
        );

        await Token.findOneAndRemove({ userId: user._id });

        await new Token({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

const verifyRefreshToken = async (refreshToken) => {
    const existingRefreshToken = await Token.findOne({ token: refreshToken })
    if (!existingRefreshToken) {
        throw new ValidationError('Invalid refresh token')
    }

    const { _id, roles } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, tokenDetails) => {
        if (err) {
            throw new ValidationError('Invalid refresh token')
        }
        return tokenDetails;
    });

    const payload = { _id: _id, roles: roles };
    const accessToken = jwt.sign(
        payload,
        ACCESS_TOKEN_SECRET,
        { expiresIn: "14m" }
    );
    return accessToken
};

const verifyToken = async ({ _id, roles }) => {
    isValidObjectId(_id);
    let token = await Token.findOne({ _id });
    if (!token) {
        const payload = { _id, roles };
        token = {
            userId: _id,
            token: jwt.sign(
                payload,
                ACCESS_TOKEN_SECRET,
                { expiresIn: "14m" }
            )
        }
        await Token.create(token);
    }
    return token
}



module.exports = {
    verifyToken,
    verifyRefreshToken,
    generateTokens
}