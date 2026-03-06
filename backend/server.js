const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const consumerRoutes = require("./routes/consumerRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const publicRoutes = require("./routes/publicRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rythu_market";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/farmer", productRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api", publicRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});