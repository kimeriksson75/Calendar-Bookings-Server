const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Apartment} = require('_helpers/db');

const register = async body => {
  if (await User.findOne({ username: body.username })) {
    throw new Error(`Username ${body.username} is already taken`);
  }
  
  if (await User.findOne({ apartment: body.apartment })) {
    throw new Error(`Apartment ${body.apartment} is already taken`);
  }

  if (!await Apartment.findOne({ _id: body.apartment })) {
    throw new Error(`Apartment ${body.apartment} is not a valid apartment`);
  }
  const user = new User(body);

  if (body.password) {
    user.hash = bcrypt.hashSync(body.password, 10);
  }
  await user.save();
  return user;
}

const authenticate = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw `Username ${username} is not found`;
  // user and password validation
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, process.env.ACCESS_TOKEN_SECRET);
    return {
      ...userWithoutHash,
      token
    };
  }
}

const update = async (id, userParam) => {

  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }
  try {
    const updated = await User.findOneAndUpdate({ _id: id }, { $set: userParam }, { new: true });
    if (!updated) {
      throw new Error(`User with id ${id} does not exists`);
    }
    return updated;
  } catch (err) {
    throw new Error(err);
  }

}

const getAll = async () => {
  try {
    const users = await User.find();
    if (!users) {
      throw new Error(`Users not found`);
    }
    return users
  } catch (err) {
    throw new Error(err);
  }
}

const getById = async id => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} does not exists`);
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
}

const _delete = async id => {
  try {
    const user = await User.findOneAndRemove(id);
    if (!user) {
      throw new Error(`User with id ${id} does not exists`);
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  authenticate,
  register,
  getAll,
  getById,
  update,
  delete: _delete
};