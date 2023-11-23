const express = require("express");
const router = express.Router();
const jwt = require("../../_helpers/jwt");

router.get("/_health", (req, res) => {
  res.status(200).json({ status: "alive and kick'n" });
});
router.get("/", function (req, res) {
  res.status(200).send("ok");
});
router.get("/verify-access-token", jwt.authenticateToken, (req, res) =>
  res.status(200).json({ status: "ok" }),
);
router.use("/users", require("./users/user.routes"));
router.use(
  "/bookings",
  jwt.authenticateToken,
  require("./bookings/booking.routes"),
);
router.use("/residences", require("./residences/residence.routes"));
router.use("/apartments", require("./apartments/apartment.routes"));
router.use("/services", require("./services/service.routes"));
router.use("/tokens", require("./tokens/token.routes"));
router.use("/scanners", require("./scanners/scanner.routes"));
router.use(
  "/tags",
  jwt.authenticateToken,
  require("./tags/tag.routes"));

module.exports = router;
