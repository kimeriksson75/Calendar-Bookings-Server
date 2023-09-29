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
  password: Joi.string().min(4).required(),
  residence: Joi.string().hex().length(24).required(),
  apartment: Joi.string().hex().length(24).required(),
  hash: Joi.string(),
});

const serviceSchema = Joi.object({
  type: Joi.string().required(),
  timeslots: Joi.array().items(
    Joi.object({
      userid: Joi.string().hex().length(24).allow(null),
      username: Joi.string().allow(""),
      timeslot: Joi.string().required(),
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
      timeslot: Joi.string().required(),
      _id: Joi.string().hex().length(24).allow(null),
    }),
  ),
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
  serviceSchema,
  bookingSchema,
};
