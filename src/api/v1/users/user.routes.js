const express = require("express");
const router = express.Router();
const {
  authenticate,
  refreshToken,
  resetPasswordLink,
  resetPasswordForm,
  resetPassword,
  signOut,
  create,
  getAll,
  getById,
  update,
  _delete,
} = require("./user.controller");

router.post("/authenticate", authenticate);
router.post("/reset-password-link", resetPasswordLink);
router.get("/reset-password-form/:id/:token", resetPasswordForm);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/refresh-token", refreshToken)
router.post("/sign-out", signOut)
router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;
