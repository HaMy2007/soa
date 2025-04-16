const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3003; 
const shiftRoutes = require("./routes/shiftRoutes");

require('./config/db');
app.use(cors());
app.use(express.json());


app.use("/api/shifts", shiftRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });