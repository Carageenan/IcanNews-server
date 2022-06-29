if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const jwt = require("jsonwebtoken");
const secretKey = process.env.Secret_Key;

const makeTokenFromPayload = (payload) => {
  return jwt.sign(payload, secretKey);
};

const readTokenFromPayload = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  makeTokenFromPayload,
  readTokenFromPayload,
};
