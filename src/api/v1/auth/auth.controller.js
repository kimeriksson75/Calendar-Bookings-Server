const authService = require("./auth.service");

exports.authenticate = (req, res, next) =>
  authService
    .authenticate(req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));