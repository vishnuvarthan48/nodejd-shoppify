const router = require("express").Router();
const categoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../models/subCategoryModel");

const { verifyTokenAndAdmin } = require("../verification");

//Get all subCategory
router.get("/", async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.find();
    res.status(200).json({ list: subCategories });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all Sub Category using Category

//Add subCategory
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newSubCategory = new SubCategoryModel({
    name: req.body.name,
    image: req.body.image,
  });
  try {
    const saveSubCategory = await newSubCategory.save();
    res.status(200).json(saveSubCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE subCategory ADMIN
router.put("/", verifyTokenAndAdmin, async (req, res) => {
  const id = req.body.id;

  try {
    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedSubCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
