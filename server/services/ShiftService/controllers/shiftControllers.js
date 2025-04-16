const Shift = require("../models/Shift");

exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().lean();
    res.status(200).json(shifts);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ca trực:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
