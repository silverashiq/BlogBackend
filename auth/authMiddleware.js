const jwt = require("jsonwebtoken");
const { getJwtExpirationTime } = require("../TokenChecker/ExpireToken");

const VerifyToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.send({
      msg: "No Access Token found",
    });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  getJwtExpirationTime(token);
  if (!token) {
    return res.send({
      msg: "No Access Token found",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.send({
        msg: "Token Verification Failed",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { VerifyToken };
