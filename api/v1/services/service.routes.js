const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  getById,
  getByResidence,
  update,
  _delete,
} = require("./service.controller");

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/residence/:residence", getByResidence);
router.patch("/:id", update);
router.delete("/:id", _delete);

module.exports = router;
