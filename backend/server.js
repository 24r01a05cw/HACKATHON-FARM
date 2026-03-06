const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const consumerRoutes = require("./routes/consumerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/farmdirect")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/farmer", productRoutes);
app.use("/api/consumer", consumerRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});