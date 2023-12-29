const router = require("express").Router();
const CategoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");

const { verifyTokenAndAdmin } = require("../verification");

//Get all category
router.get("/", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({ list: categories });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Add Category
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newCategory = new CategoryModel({
    name: req.body.name,
    subCategory: req.body.subCategory,
    image: req.body.image,
  });
  try {
    const subCategories = [];
    for (const sub of newCategory.subCategory) {
      const id = sub._id;
      console.log("sub._id", id);
      const subCategory = await subCategoryModel.findOne({ _id: id });
      console.log("sub-ca", subCategory);
      if (subCategory) {
        subCategories.push(subCategory);
      }
    }
    console.log("sub", subCategories);
    newCategory.subCategory = subCategories;
    const saveCategory = await newCategory.save();
    res.status(200).json(saveCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE CATEGORY ADMIN
router.put("/", verifyTokenAndAdmin, async (req, res) => {
  const id = req.body.id;
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
