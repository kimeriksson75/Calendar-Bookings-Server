const Joi = require("joi");
const {
  ValidationError,
} = require("../../../_helpers/customErrors/customErrors");

const residenceSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
});
const apartmentSchema = Joi.object({
  name: Joi.string().required(),
  residence: Joi.string().hex().length(24).required(),
});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  password: Joi.string().min(4).allow(null),
  residence: Joi.string().hex().length(24).required(),
  apartment: Joi.string().hex().length(24).required(),
  hash: Joi.string(),
});

const authenticateSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(4),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().label("Refresh Token"),
});

const serviceSchema = Joi.object({
  type: Joi.string().required(),
  timeslots: Joi.array().items(
    Joi.object({
      userid: Joi.string().hex().length(24).allow(null),
      username: Joi.string().allow(""),
      start: Joi.date().required(),
      end: Joi.date().required(),
      _id: Joi.string().hex().length(24).allow(null),
    }),
  ),
  alternateTimeslots: Joi.array().items(
    Joi.object({
      userid: Joi.string().hex().length(24).allow(null),
      username: Joi.string().allow(""),
      start: Joi.date().required(),
      end: Joi.date().required(),
      _id: Joi.string().hex().length(24).allow(null),
    }),
  ),
  name: Joi.string().required(),
  residence: Joi.string().hex().length(24).required(),
  limit: Joi.number().allow(null),
  __v: Joi.number().allow(null),
});

const bookingSchema = Joi.object({
  service: Joi.string().hex().length(24).required(),
  date: Joi.date().allow(null),
  timeslots: Joi.array().items(
    Joi.object({
      userid: Joi.string().hex().length(24).allow(null),
      username: Joi.string().allow(""),
      start: Joi.date().required(),
      end: Joi.date().required(),
      _id: Joi.string().hex().length(24).allow(null),
    }),
  ),
  alternateTimeslots: Joi.array().items(
    Joi.object({
      userid: Joi.string().hex().length(24).allow(null),
      username: Joi.string().allow(""),
      start: Joi.date().required(),
      end: Joi.date().required(),
      _id: Joi.string().hex().length(24).allow(null),
    }),
  ),
  __v: Joi.number().allow(null),
});

const tokenSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  token: Joi.string().required(),
  expiresAt: Joi.date().allow(null),
  _id: Joi.string().hex().length(24).allow(null),
  __v: Joi.number().allow(null),
});

const validate = async (schema, params) => {
  try {
    const validationResult = await schema.validate(params);
    if (validationResult.error) {
      throw new ValidationError(
        validationResult.error?.message || `Error while validating document`,
      );
    }
    return validationResult;
  } catch (err) {
    throw new ValidationError(
      err?.message || `Error while validating document`,
    );
  }
};

module.exports = {
  validate,
  residenceSchema,
  apartmentSchema,
  userSchema,
  authenticateSchema,
  serviceSchema,
  bookingSchema,
  tokenSchema,
  refreshTokenSchema,
};
