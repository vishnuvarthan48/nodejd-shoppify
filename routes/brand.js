const router = require("express").Router();
const BrandModel = require("../models/brandModel");

const { verifyTokenAndAdmin } = require("../verification");
//Get all Brand
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const brands = await BrandModel.find();
    res.status(200).json({ list: brands });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Add Brand
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newBrand = new BrandModel({
    name: req.body.name,
    description: req.body.description ? req.body.description : "",
    image: req.body.image,
  });
  try {
    const saveBrand = await newBrand.save();
    res.status(200).json(saveBrand);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE BRAND ADMIN
router.put("/", verifyTokenAndAdmin, async (req, res) => {
  const id = req.body.id;
  try {
    const updatedBrand = await BrandModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBrand);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
