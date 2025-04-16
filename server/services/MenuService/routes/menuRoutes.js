const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuControllers");

router.put("/meals/:id/lock", menuController.toggleMealLock);
router.get("/meals", menuController.getMeals);
router.get("/meal/:id", menuController.getMealById);

module.exports = router;
