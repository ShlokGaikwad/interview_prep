const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const userRouter = express.Router();
const auth = require("../middleware/auth.middleware");
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User is already registered" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        try {
          if (hash) {
            const user = new UserModel({
              email,
              password: hash,
            });
            await user.save();
            res.status(200).json({ message: "new user is registered", user });
          }
        } catch (error) {
          console.log(error);
          res.status(400).json(error);
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: user._id }, process.env.token);
          res.status(201).json({ message: "user login successfully", token });
        } else {
          res.status(400).json({ message: "password incorrect" });
        }
      });
    } else {
      res.status(400).json({ message: "no email found please register" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.get("/logout", auth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const blackListToken = new blacklistModel({ token });
    await blackListToken.save();
    res.status(200).json({ msg: "User logged out" });
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = userRouter;
