const mongoose = require("mongoose");
const categoryModel = require("./categoryModel");

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubCategorySchema", SubCategorySchema);
