const router = require("express").Router();
const OtherDetailsModel = require("../models/otherDetailsModel");

const { verifyTokenAndAdmin } = require("../verification");

//Get OtherDetails
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const otherDetails = await OtherDetailsModel.find();
    res.status(200).json(otherDetails);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Add OtherDetails
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newOtherDetails = new OtherDetailsModel({
    name: req.body.name,
  });
  try {
    const saveOtherDetails = await newOtherDetails.save();
    res.status(200).json(saveOtherDetails);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
