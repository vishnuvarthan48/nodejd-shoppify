const UserModel = require("../models/userModel");
const CryptoJs = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const apiResponse = require("../constants/response");

dotenv.config();

const router = require("express").Router();

router.post("/signup", async (req, res) => {
  const newUser = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(req.body.password, process.env.KEY),
  });

  const existingUser = await UserModel.findOne({ email: req.body.email });
  const existingUsername = await UserModel.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    const response = apiResponse(200, "Email Already Exists.", []);
    res.status(200).json(response);
  } else if (existingUsername) {
    const response = apiResponse(200, "Username Already Exists.", []);
    res.status(200).json(response);
  } else {
    try {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      const response = apiResponse(500, "Internal Server Error.", [error]);

      res.status(500).json(response);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    !user && res.status(202).json("User Not Found");

    const originalPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.KEY
    ).toString(CryptoJs.enc.Utf8);
    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT,
      { expiresIn: "7d" }
    );
    if (originalPassword === req.body.password) {
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    } else {
      res.status(202).json("Wrong Password");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
