const router = require("express").Router();
const userModel = require("../models/userModel");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../verification");
const CryptoJs = require("crypto-js");

//GET USER BY ADMIN

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL USER BY ADMIN

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await userModel.find();
    // const { password, ...others } = user._doc;
    const response = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    res.status(200).json({ list: response });
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE USER BY USER OR ADMIN
router.put("/", verifyTokenAndAuthorization, async (req, res) => {
  const id = req.body.id;
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      password.env.KEY
    ).toString();
  }
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE USER BY ADMIN
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (user) {
      await userModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted successfully");
    } else {
      res.status(200).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
