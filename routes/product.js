const router = require("express").Router();
const ProductModel = require("../models/productModel");
const BrandModel = require("../models/brandModel");
const CategoryModel = require("../models/categoryModel");
const colorModel = require("../models/colorModel");
const { verifyTokenAndAdmin } = require("../verification");
const subCategoryModel = require("../models/subCategoryModel");

//Get all products

router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({ list: products });
  } catch (error) {
    res.status(500).json(error);
  }
});

//get products for a Category and filter by color and brand
router.get("/ca/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { brandId, colorId } = req.body;

    const query = { category: categoryId };

    if (brandId) {
      query.brand = brandId;
    }

    if (colorId) {
      query["colors"] = { $elemMatch: { color: colorId, stock: { $gt: 0 } } };
    }

    const products = await ProductModel.find(query);

    if (!products || products.length === 0) {
      const products = await ProductModel.find({
        category: categoryId,
      });
      return res.status(404).json({
        message: "No products found for these filters. You may also like",
        products,
      });
    }

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//chat gpt multiple method

// GET request to filter products by color and brand
// router.get("/ca/:categoryId/filter", async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     const colorIds = req.query.colorIds; // Array of color IDs as query parameter
//     const brandIds = req.query.brandIds; // Array of brand IDs as query parameter

//     // Build the query to filter products based on colorIds, brandIds, and categoryId
//     const query = { category: categoryId };

//     if (colorIds && colorIds.length > 0) {
//       query["colors"] = { $elemMatch: { color: { $in: colorIds }, stock: { $gt: 0 } } };
//     }

//     if (brandIds && brandIds.length > 0) {
//       query.brand = { $in: brandIds };
//     }

//     const products = await ProductModel.find(query);

//     // Handle the response
//     if (!products || products.length === 0) {
//       return res.status(404).json({
//         message: "No products found for these filters. You may also like",
//         products: [],
//       });
//     }

//     res.json({ products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

//add a product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new ProductModel({
    name: req.body.name,
    brand: await BrandModel.findById(req.body.brand._id),
    description: req.body.description,
    colors: req.body.colors,
    price: req.body.price,
    category: await CategoryModel.findById(req.body.category._id),
    subCategory: await subCategoryModel.findById(req.body.subCategory._id),
    images: req.body.images,
    manufacturer: req.body.manufacturer,
    otherDetails: req.body.otherDetails,
    warranty: req.body.warranty,
    warrantyPeriod: req.body.warrantyPeriod,
  });

  try {
    const invalidColors = [];
    const validColors = [];
    for (const variant of newProduct.colors) {
      const colorId = variant.color._id;
      const stock = variant.stock;
      const color = await colorModel.findById(colorId);
      if (!color || typeof stock !== "number" || stock <= 0) {
        invalidColors.push({ colorId, message: "Invalid color or stock ID" });
      } else {
        validColors.push({ color: color, stock: stock });
      }
    }
    const brandId = await BrandModel.findById(newProduct.brand._id);
    const colorsTrue = invalidColors.length === 0 ? true : false;
    const categoryId = await CategoryModel.findById(newProduct.category._id);
    newProduct.colors = validColors;
    if (brandId && colorsTrue && categoryId) {
      const saveProduct = await newProduct.save();
      res.status(201).json(saveProduct);
    } else {
      res.status(400).json("Categories or color or brand not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE PRODUCT ADMIN
router.put("/", verifyTokenAndAdmin, async (req, res) => {
  const id = req.body.id;
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
