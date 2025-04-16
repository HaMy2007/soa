const Meal = require("../models/Meal");
const mongoose = require('mongoose');

exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    console.error("Lỗi truy vấn MongoDB:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.toggleMealLock = async (req, res) => {
  const { id } = req.params;

  try {
    const meal = await Meal.findById(id);
    if (!meal) return res.status(404).json({ error: "Meal not found" });

    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { isLocked: !meal.isLocked },
      { new: true }
    );

    res.json({ message: "Cập nhật trạng thái khóa thành công", meal: updatedMeal });
  } catch (err) {
    console.error("Lỗi khi khóa/unlock món:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMealById = async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  if (!meal) return res.status(404).json({ message: "Meal not found" });
  res.status(200).json(meal);
};
