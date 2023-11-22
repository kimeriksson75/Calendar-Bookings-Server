const userService = require("./user.service");

exports.authenticate = (req, res, next) =>
  userService
    .authenticate(req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));

exports.authenticateWithToken = (req, res, next) =>
  userService
    .authenticateWithToken(req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));

exports.refreshToken = (req, res, next) =>
  userService
    .refreshToken(req.body)
    .then((accessToken) => res.status(200).json(accessToken))
    .catch((err) => next(err))

exports.resetPasswordLink = (req, res, next) =>
  userService
    .resetPasswordLink(req.body)
    .then((user) =>
      user
        ? res.status(200).json(user)
        : res.status(400).json({ message: "Error generating reset password link" }),
    )
    .catch((err) => next(err));

exports.resetPasswordForm = (req, res) =>
  res.render(
    "forms/reset-password",
    {
      id: req.params.id,
      token: req.params.token,
      message: null,
      error: null
    }
  )
exports.resetPassword = (req, res) =>
  userService
    .resetPassword(req.params.id, req.params.token, req.body)
    .then((user) => res.render(
      "forms/reset-password-success",
      {
        message: `${user.firstname}, your password has now successfully been updated. You may now login with your new password.`,
      })
    )
    .catch((err) => res.render(
      "forms/reset-password",
      {
        id: req.params.id,
        token: req.params.token,
        message: null,
        error:  err?.message
      })
    )

exports.signOut = (req, res, next) =>
  userService
    .signOut(req.body)
    .then(() => res.status(200).json({ message: "Successfully signed out" }))
    .catch((err) => next(err))
      
exports.create = (req, res, next) =>
  userService
    .create(req.body)
    .then((user) =>
      user
        ? res.status(201).json(user)
        : res.status(400).json({ message: "Error while creating user" }),
    )
    .catch((err) => next(err));

exports.getAll = (req, res, next) =>
  userService
    .getAll()
    .then((users) => res.status(200).json(users))
    .catch((err) => next(err));

exports.getById = (req, res, next) =>
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.status(200).json(user) : res.status(404)))
    .catch((err) => next(err));

exports.update = (req, res, next) =>
  userService
    .update(req.params.id, req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));

exports._delete = (req, res, next) =>
  userService
    .delete(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));
