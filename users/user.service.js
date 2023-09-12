const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Apartment} = require('_helpers/db');

const register = async body => {
  // unique username validation
  
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

  // hash user password
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
  const user = User.findById(id);
  // validate user
  if (!user) new Error(`Username ${userParam.username} is not found`);

  // validate unique user name
  if (user.username !== userParam.username && await user.findOne({ username: userParam.username })) {
    throw new Error(`Username ${userParam.username} is not related to this user id`);
  }

  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  const updated = await User.findOneAndUpdate(id, { $set: userParam }, { upsert: true }, (err, doc) => {
    if (err) throw new Error(err);
  });

  return updated;
}

const getAll = async () => await User.find();

const getById = async id => await User.findById(id);

const _delete = async id => await User.findOneAndRemove(id);

module.exports = {
  authenticate,
  register,
  getAll,
  getById,
  update,
  delete: _delete
};