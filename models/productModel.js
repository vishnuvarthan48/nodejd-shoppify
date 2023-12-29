const mongoose = require("mongoose");
const categoryModel = require("./categoryModel");
const brandModel = require("./brandModel");
const colorModel = require("./colorModel");
const subCategoryModel = require("./subCategoryModel");
const ColorVariantSchema = new mongoose.Schema({
  color: {
    type: Object,
    ref: colorModel,
    validate: {
      validator: async function (value) {
        const colorExists = await colorModel.exists({ _id: value });
        return colorExists;
      },
      message: "Invalid color ID. The color does not exist.",
    },
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: Object,
      ref: brandModel,
      validate: {
        validator: async function (value) {
          const brandExists = await brandModel.exists({ _id: value });
          return brandExists;
        },
        message: "Invalid Brand ID. The Brand does not exist.",
      },
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    colors: [ColorVariantSchema],
    category: {
      type: Object,
      ref: categoryModel,
      validate: {
        validator: async function (value) {
          const categoryExists = await categoryModel.exists({ _id: value });
          return categoryExists;
        },
        message: "Invalid category ID. The category does not exist.",
      },
      required: true,
    },
    subCategory: {
      type: Object,
      ref: subCategoryModel,
      validate: {
        validator: async function (value) {
          const subCategoryExists = await subCategoryModel.exists({
            _id: value,
          });
          return subCategoryExists;
        },
        message: "Invalid category ID. The category does not exist.",
      },
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },

    otherDetails: {
      type: Map,
      of: String,
    },
    warranty: {
      type: Boolean,
      required: true,
    },
    warrantyPeriod: {
      type: String,
      required: this.warranty ? true : false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductSchema", ProductSchema);
