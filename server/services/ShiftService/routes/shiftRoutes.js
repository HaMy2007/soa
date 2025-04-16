const express = require("express");
const router = express.Router();
const ShiftController = require("../controllers/shiftControllers");

router.get("/", ShiftController.getShifts);

module.exports = router; 
