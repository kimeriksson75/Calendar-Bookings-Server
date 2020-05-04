const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

const User = db.User;
const Apartment = db.Apartment;

const create = async userParam => {
  // unique username validation
  if (await User.findOne({ username: userParam.username })) {
    throw `Username ${userParam.username} is not available`;
  }
  if (await User.findOne({ apartmentid: userParam.apartmentid })) {
    throw `Apartment ${userParam.apartmentid} is already taken`;
  }

  if (! await Apartment.findOne({ apartment: userParam.apartmentid })) {
    throw `Apartment ${userParam.apartmentid} is not a valid apartment`;
  }
  const user = new User(userParam);

  // hash user password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }
  await user.save();
  return user;
}

const authenticate = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw 'User not found';
  // user and password validation
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
      ...userWithoutHash,
      token
    };
  }
}

const update = async (id, userParam) => {
  const user = User.findById(id);
  // validate user
  if (!user) throw 'User not found';

  // validate unique user name
  if (user.username !== userParam.username && await user.findOne({ username: userParam.username })) {
    throw `Username ${userParam.username} is already taken`;
  }

  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  const updated = await User.findOneAndUpdate(id, { $set: userParam }, { upsert: true }, (err, doc) => {
    if (err) throw err;
  });

  return updated;
}

const getAll = async () => await User.find();

const getById = async id => await User.findById(id);

const _delete = async id => await User.findOneAndRemove(id);

module.exports = {
  authenticate,
  create,
  getAll,
  getById,
  update,
  delete: _delete
};