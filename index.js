const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const colorRoute = require("./routes/color");
const categoryRoute = require("./routes/category");
const brandRoute = require("./routes/brand");
const productRoute = require("./routes/product");
const otherDetailsRoute = require("./routes/otherDetails");
const subCategoryRoute = require("./routes/subCategory");
const cors = require("cors");

dotenv.config();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => {
    console.log("error", err);
  });

app.use("/api/v1/user", userRoute);
app.use("/api/v1/", authRoute);
app.use("/api/v1/co", colorRoute);
app.use("/api/v1/ca", categoryRoute);
app.use("/api/v1/br", brandRoute);
app.use("/api/v1/pr", productRoute);
app.use("/api/v1/od", otherDetailsRoute);
app.use("/api/v1/sub-ca", subCategoryRoute);

app.listen(process.env.PORT, () => {
  console.log("backend server is started");
});
