const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, NODE_ENV } = require("../config");
const authenticateToken = (req, res, next) => {
  if (NODE_ENV === 'test') {
    return next();
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: 'Token does not exist' });
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {

    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
