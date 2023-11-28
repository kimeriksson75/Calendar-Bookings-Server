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
router.use("/users", jwt.authenticateToken, require("./users/user.routes"));
router.use("/bookings", jwt.authenticateToken, require("./bookings/booking.routes"));
router.use("/residences", jwt.authenticateToken, require("./residences/residence.routes"));
router.use("/apartments", jwt.authenticateToken, require("./apartments/apartment.routes"));
router.use("/services", jwt.authenticateToken, require("./services/service.routes"));
router.use("/tokens", jwt.authenticateToken, require("./tokens/token.routes"));
router.use("/scanners", jwt.authenticateToken, require("./scanners/scanner.routes"));
router.use(
  "/tags",
  jwt.authenticateToken,
  require("./tags/tag.routes"));

module.exports = router;
