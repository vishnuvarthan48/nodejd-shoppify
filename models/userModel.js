const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: { type: String, required: true, unique: true },
    verified: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSchema", UserSchema);
