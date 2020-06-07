const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');

const jwt = () => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      //public routes that don't require auth
      '/users/authenticate',
      '/users/register',
      '/users/user'
    ]
  });
}

const isRevoked = async (req, payload, done) => {
  const user = await userService.getById(payload.sub);
  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }
  done();
}

module.exports = jwt;