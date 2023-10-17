const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  getByResidence,
  getById,
  update,
  _delete,
} = require("./apartment.controller");

router.post("/", create);
router.get("/", getAll);
router.get("/residence/:residence", getByResidence);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", _delete);

module.exports = router;
