const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJwt = (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.accessToken) {
    return res.status(401).json({
      status: "error",
      message: "not authenticated",
    });
  }
  const token = cookie.accessToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "not authenticated",
      });
    }
    req.user = user.username;
    req.roles = user.roles;
    next();
  });
};

module.exports = verifyJwt;
