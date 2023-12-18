const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, NODE_ENV } = require("../config");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!NODE_ENV === "development") {
    
    if (token == null) return res.status(401).json({ message: 'Token does not exist' });
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {

      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } else {
    next();
  }
};

module.exports = {
  authenticateToken,
};
