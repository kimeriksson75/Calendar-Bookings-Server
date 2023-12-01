const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  getByService,
  getById,
  getByServiceDate,
  getByServiceDateSpan,
  getByServiceMonth,
  getByServiceUser,
  update,
  _delete,
} = require("./booking.controller");

router.post("/:user", create);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/service/:service", getByService);
router.get("/service/:service/date/:date", getByServiceDate);
router.get("/service/:service/start/:start/end/:end", getByServiceDateSpan);
router.get("/service/:service/month/:date", getByServiceMonth);
router.get("/service/:service/user/:id", getByServiceUser);
router.patch("/:user/:id", update);
router.delete("/:id", _delete);

module.exports = router;
