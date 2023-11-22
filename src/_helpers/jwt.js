const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({message: 'Token does not exist'});
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({message: 'Invalid token'});
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
