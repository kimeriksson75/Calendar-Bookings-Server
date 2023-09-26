const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ValidationError, NotFoundError } = require('../../../_helpers/customErrors/customErrors');
const { validate, userSchema } = require('../_helpers/db.schema.validation');
const  { isValidObjectId } = require('../_helpers/db.document.validation');

const { User, Residence, Apartment} = require('../_helpers/db');


const create = async userparams => {
  // console.log('userparams', {userparams})
  try {
    await validate(userSchema, userparams)
    

    const existingUserName = await User.findOne({ username: userparams.username })
    if (existingUserName) {
      throw new ValidationError(`Username ${userparams.username} is already taken`);
    }
    
    const existingUserApartment = await User.findOne({ apartment: userparams.apartment })
    if (existingUserApartment) {
      throw new ValidationError(`Apartment ${userparams.apartment} is already taken`);
    }
  
    const existingResidence = await Residence.findById(userparams.residence)
    if (!existingResidence) {
      throw new NotFoundError(`Residence ${userparams.residence} does not exist`);
    }
  
    const existingApartment = await Apartment.findById(userparams.apartment)
    if (!existingApartment) {
      throw new NotFoundError(`Apartment ${userparams.apartment} does not exist`);
    }
    
    const user = { ...userparams }
    if (userparams.password) {
      user.hash = bcrypt.hashSync(userparams.password, 10);
    }

    const createdUser = await User.create(user)
    if(!createdUser) {
      throw new ValidationError(`Error while creating user`)
    }
    return createdUser;
  } catch (err) {
    throw err;
  }
}

const authenticate = async ({ username, password }) => {
  try {

    const user = await User.findOne({ username });
    if (!user) {
      throw new NotFoundError(`Username ${username} is not found`);
    }
    
    // user and password validation
    if (user && bcrypt.compareSync(password, user.hash)) {
      const { hash, ...userWithoutHash } = user.toObject();
      const token = jwt.sign({ sub: user._id }, process.env.ACCESS_TOKEN_SECRET);
      return {
        ...userWithoutHash,
        token
      };
    }
  } catch (err) {
    throw err;
  }
}

const update = async (id, userParam) => {

  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }
  try {
    await validate(userSchema, userParam)

    isValidObjectId(id)

    const updated = await User.findByIdAndUpdate(id, { $set: userParam }, { new: true });
    if (!updated) {
      throw new NotFoundError(`User id ${id} does not exist`);
    }
    return updated;
  } catch (err) {
    throw err;
  }

}

const getAll = async () => {
  try {
    const users = await User.find();
    if (!users) {
      throw new NotFoundError(`Users not found`);
    }
    return users
  } catch (err) {
    throw err;
  }
}

const getById = async id => {
  try {
    isValidObjectId(id)

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(`User id ${id} does not exist`);
    }
    return user;
  } catch (err) {
    throw err;
  }
}

const _delete = async id => {
  try {
    isValidObjectId(id)

    const user = await User.findByIdAndRemove(id);
    if (!user) {
      throw new NotFoundError(`User id ${id} does not exist`);
    }
    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  authenticate,
  create,
  getAll,
  getById,
  update,
  delete: _delete
};