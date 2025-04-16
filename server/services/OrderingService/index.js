const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001; 
const orderingRoutes = require("./routes/orderingRoutes");

require('./config/db');
app.use(cors());
app.use(express.json());


app.use("/api", orderingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });