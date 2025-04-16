const Table = require('../models/Table');
const axios = require("axios");

exports.getFreeTables = async (req, res) => {
  try {
    const orderRes = await axios.get("http://localhost:3001/api/active-table-ids");
    const activeTableIds = orderRes.data.tableIds;

    const tables = await Table.find({
      $or: [
        { status: "free" },
        { _id: { $in: activeTableIds } }
      ]
    });

    const markedTables = tables.map(table => ({
      _id: table._id,
      tableNumber: table.tableNumber,
      status: table.status,
      updatedAt: table.updatedAt,
      isOccupied: activeTableIds.includes(String(table._id)), 
    }));
    res.status(200).json(markedTables);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bàn:", error.message);
    res.status(500).json({ error: "Lỗi server" });
  }
};


exports.updateTableStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const table = await Table.findByIdAndUpdate(id, { status }, { new: true });
  
      if (!table) {
        return res.status(404).json({ error: "Table not found" });
      }
  
      res.json({ message: "Cập nhật trạng thái bàn thành công", table });
    } catch (error) {
      console.error("Lỗi khi cập nhật bàn:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  