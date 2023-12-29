const router = require("express").Router();
const ColorModel = require("../models/colorModel");

const { verifyTokenAndAdmin } = require("../verification");

//Get Color
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const colors = await ColorModel.find();
    res.status(200).json({ list: colors });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Add color
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newColor = new ColorModel({
    name: req.body.name,
  });
  try {
    const saveColor = await newColor.save();
    res.status(200).json(saveColor);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE COLOR ADMIN
router.put("/", verifyTokenAndAdmin, async (req, res) => {
  const id = req.body.id;
  try {
    const updatedColor = await ColorModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
