const express = require("express");
const router = express.Router();
const {
  authenticate,
  create,
  getAll,
  getById,
  update,
  _delete,
} = require("./user.controller");

router.post("/authenticate", authenticate);
router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;
