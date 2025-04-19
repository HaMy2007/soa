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

exports.generateSecretCodeForCurrentShift = async (req, res) => {
  try {
    const now = new Date();
    const totalMinutesNow = now.getHours() * 60 + now.getMinutes();

    const shifts = await Shift.find();

    for (const shift of shifts) {
      const from = new Date(shift.fromTime);
      const to = new Date(shift.toTime);

      const fromMinutes = from.getHours() * 60 + from.getMinutes();
      const toMinutes = to.getHours() * 60 + to.getMinutes();

      if (totalMinutesNow >= fromMinutes && totalMinutesNow <= toMinutes) {
        const newCode = generateSecretCode();
        shift.secretCode = newCode;
        await shift.save();

        return res.status(200).json({
          message: `Đã cập nhật secretCode cho ca ${shift.shiftCode}`,
          shiftCode: shift.shiftCode,
          secretCode: newCode,
        });
      }
    }

    res.status(404).json({ message: "Không tìm thấy ca phù hợp với thời điểm hiện tại." });
  } catch (error) {
    console.error("[ShiftService] Lỗi khi tạo mã:", error);
    res.status(500).json({ error: "Server error" });
  }
};

function generateSecretCode(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

exports.getCurrentShift = async (req, res) => {
  try {
    const nowVN = new Date(new Date().getTime());
    const nowMinutes = nowVN.getHours() * 60 + nowVN.getMinutes();

    const shifts = await Shift.find();
    for (const shift of shifts) {
      const from = new Date(shift.fromTime);
      const to = new Date(shift.toTime);
      const fromMins = from.getHours() * 60 + from.getMinutes();
      const toMins = to.getHours() * 60 + to.getMinutes();

      if (nowMinutes >= fromMins && nowMinutes <= toMins) {
        return res.json(shift);
      }
    }

    res.status(404).json({ message: "Không tìm thấy ca hiện tại" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy ca hiện tại" });
  }
};