const mongoose = require("mongoose");

const OtherDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OtherDetailsSchema", OtherDetailsSchema);
