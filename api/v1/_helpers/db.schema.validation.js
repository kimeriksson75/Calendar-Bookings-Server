const Joi = require('joi');
const { ValidationError } = require('../../../_helpers/customErrors/customErrors');

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
    hash: Joi.string()
})

const validate = async (schema, params) => {
  try {
    const validationResult = await schema.validate(params)
    if (validationResult.error) {
      throw new ValidationError(validationResult.error?.message || `Error while validating document`);
    }
    return validationResult;
  } catch (err) {
    throw new ValidationError(err?.message || `Error while validating document`);
  }
}
  
module.exports = {
    validate,
    apartmentSchema,
    userSchema
}