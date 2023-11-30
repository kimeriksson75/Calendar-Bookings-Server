const express = require("express");
const router = express.Router();
const {
    authenticate,
  } = require("./auth.controller");
  
router.post("/", authenticate);

module.exports = router;
