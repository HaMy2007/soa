const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3002; 
const tableRoutes = require('./routes/welcomeRoutes');

require('./config/db');
app.use(cors());
app.use(express.json());

app.use('/api', tableRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });