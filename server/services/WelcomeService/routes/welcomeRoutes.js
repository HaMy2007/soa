const express = require('express');
const router = express.Router();
const tableController = require('../controllers/welcomeControllers');

router.get('/tables/free', tableController.getFreeTables);
router.put("/:id/status", tableController.updateTableStatus);

module.exports = router;
