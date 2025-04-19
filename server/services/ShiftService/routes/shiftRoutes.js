const express = require("express");
const router = express.Router();
const ShiftController = require("../controllers/shiftControllers");

router.get("/", ShiftController.getShifts);
router.post('/generate-secret-code', ShiftController.generateSecretCodeForCurrentShift);
router.get("/now", ShiftController.getCurrentShift);

module.exports = router; 
