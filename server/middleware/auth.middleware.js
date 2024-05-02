const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
require("dotenv").config();

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.token, async (err, payload) => {
        try {
          if (payload) {
            const user = await UserModel.findById({ _id: payload.userId });
            req.userId = payload.userId;
            next();
          } else {
            res.status(100).send({
              msg: "token expired or incorrect token",
            });
          }
        } catch (err) {
          res.status(100).send({
            msg: "error while verifyying token",
          });
        }
      });
    } else {
      res.status(501).send({
        msg: "please provide token",
      });
    }
  } catch (err) {
    res.status(500).send({
      msg: "error while authorizing",
    });
  }
}

module.exports = auth;
