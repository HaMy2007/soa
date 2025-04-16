const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const menuRoutes = require("./routes/menuRoutes");

app.use(cors());
require("./config/db");
app.use(express.json());

app.use("/api", menuRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
