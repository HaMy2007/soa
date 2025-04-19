const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3003; 
const shiftRoutes = require("./routes/shiftRoutes");
const userRoutes = require("./routes/userRoutes");

require('./config/db');
app.use(cors());
app.use(express.json());


app.use("/api/shifts", shiftRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});