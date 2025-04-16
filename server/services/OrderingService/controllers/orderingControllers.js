const Order = require("../models/Order");
const mongoose = require('mongoose');
const axios = require("axios");

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "ID không hợp lệ" });
        }
        const objectId = new mongoose.Types.ObjectId(id);
        const order = await Order.findOne({ orderID: objectId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({
            order_id: order._id,
            orderID: order.orderID,
            orderDetailsID: order.orderDetailsID,
            table_id: order.tableID,
            table_number: order.tableNumber,
            total_price: order.totalPrice,
            note: order.note,
            created_time: order.createdTime,
            order_status: order.orderStatus,
            listMeal: order.listMeal
        });
    } catch (error) {
        console.error('Error in getOrderDetails:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateMealStatus = async (req, res) => {
    const { orderId, mealId } = req.params;
    const { status } = req.body;

    try {
        const objectOrderId = new mongoose.Types.ObjectId(orderId);
        const objectMealId = new mongoose.Types.ObjectId(mealId);

        const order = await Order.findOne({ orderID: objectOrderId });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const meal = order.listMeal.find(m => m.mealID.equals(objectMealId));
        if (!meal) {
            return res.status(404).json({ error: 'Meal not found in order' });
        }

        meal.status = status;
        const hasProcessing = order.listMeal.some(m => m.status === "processing");
        if (hasProcessing) {
            order.orderStatus = "processing";
        }
        await order.save();

        res.status(200).json({
            message: 'Cập nhật trạng thái món thành công',
            orderStatus: order.orderStatus,
            updatedMeal: meal
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái món:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const enrichMealSnapshot = async (mealID, quantity, status = "confirmed") => {
  const { data } = await axios.get(`http://localhost:1234/menu/api/meal/${mealID}`);
  return {
    mealID,
    name: data.name,
    image: data.image,
    price: data.price,
    quantity,
    statusUpdatedAt: new Date(),
    status,
  };
};

const getShiftIdByCreatedTime = async (createdTime) => {
  try {
    const response = await axios.get("http://localhost:3003/api/shifts");
    const shifts = response.data;

    const vnTime = new Date(createdTime.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const orderMinutes = vnTime.getHours() * 60 + vnTime.getMinutes();

    for (const shift of shifts) {
      const fromVN = new Date(new Date(shift.fromTime).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
      const toVN = new Date(new Date(shift.toTime).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

      const fromMinutes = fromVN.getHours() * 60 + fromVN.getMinutes();
      const toMinutes = toVN.getHours() * 60 + toVN.getMinutes();

      if (orderMinutes >= fromMinutes && orderMinutes <= toMinutes) {
        console.log(`✅ Khớp ca: ${shift.shiftCode}`);
        return shift.shiftCode;
      }
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy ca trực:", error);
    return null;
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      tableNumber,
      tableID,
      listMeal,
      createdTime,
      totalPrice,
      note
    } = req.body;

    const objectTableId = new mongoose.Types.ObjectId(tableID);
    const shiftID = await getShiftIdByCreatedTime(createdTime);

    const existingOrder = await Order.findOne({
      tableID: objectTableId,
      orderStatus: { $ne: "completed" }
    });

    if (existingOrder) {
      for (const item of listMeal) {
        const snapshot = await enrichMealSnapshot(item.mealID, item.quantity);
        existingOrder.listMeal.push(snapshot);
      }
      existingOrder.totalPrice += totalPrice;
      await existingOrder.save();
      return res.status(200).json({ message: "Thêm món vào order cũ", order: existingOrder });
    }

    const enrichedMeals = await Promise.all(
      listMeal.map((item) => enrichMealSnapshot(item.mealID, item.quantity))
    );

    const neworder = await Order.create({
      orderID: new mongoose.Types.ObjectId(), 
      orderDetailsID: new mongoose.Types.ObjectId().toString(),
      tableID: objectTableId,
      tableNumber,
      note,
      totalPrice,
      createdTime: new Date(),
      orderStatus: "confirmed", 
      shiftID,
      listMeal: enrichedMeals,
    });

    try {
      const updateTableRes = await axios.put(
        `http://localhost:3002/api/${tableID}/status`, 
        { status: "full" }
      );
      console.log("Đã cập nhật trạng thái bàn:", updateTableRes.data);
    } catch (err) {
      console.error("Không thể cập nhật trạng thái bàn:", err.message);
    }

    res.status(201).json({ message: "Order created successfully", neworder });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateOrderById = async (req, res) => {
  const { id } = req.params;
  const { listMeal, totalPrice } = req.body;

  try {
    const objectOrderId = new mongoose.Types.ObjectId(id);

    const order = await Order.findOne({ orderID: objectOrderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    listMeal.forEach((newMeal) => {
      const existingIndex = order.listMeal.findIndex(
        (item) => String(item.mealID?.toString()) === String(newMeal.mealID)
      );

      if (existingIndex !== -1) {
        order.listMeal[existingIndex].quantity += newMeal.quantity;
      } else {
        order.listMeal.push({
          ...newMeal,
          statusUpdatedAt: new Date(),
        });
      }
    });

    order.totalPrice += totalPrice;
    order.markModified("listMeal");
    await order.save();

    res.status(200).json({
      message: "Cập nhật đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.updateOrderItems = async (req, res) => {
  const { id } = req.params;
  const { listMeal, totalPrice } = req.body;

  try {
    const objectOrderId = new mongoose.Types.ObjectId(id);
    const order = await Order.findOne({ orderID: objectOrderId });

    if (!order) return res.status(404).json({ error: "Order not found" });

    order.listMeal = listMeal;
    order.totalPrice = totalPrice;

    order.markModified("listMeal");
    await order.save();

    res.status(200).json({ message: "Đã cập nhật đơn hàng", order });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const objectOrderId = new mongoose.Types.ObjectId(id);

    const order = await Order.findOne({ orderID: objectOrderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.orderStatus = status;
    if(status === "completed"){
      order.endTime = new Date();
    }
    await order.save();

    if (status === "completed" && order.tableID) {
      try {
        const apiRes = await axios.put(
          `http://localhost:3002/api/${order.tableID}/status`,
          { status: "free" }
        );

        console.log("Cập nhật status bàn thành công:", apiRes.data);
      } catch (err) {
        console.error("Lỗi khi gọi API cập nhật bàn:", err.message);
      }
    }

    res.status(200).json({
      message: 'Cập nhật trạng thái đơn hàng thành công',
      tableID: order.tableID,
      orderStatus: order.orderStatus,
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.filterOrders = async (req, res) => {
  try {
    const { tableNumber, date } = req.query;

    const filter = {};

    if (tableNumber) {
      filter.tableNumber = Number(tableNumber);
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.createdTime = { $gte: start, $lte: end };
    }

    if (!tableNumber && !date) {
      return res.status(400).json({ error: "Vui lòng cung cấp ít nhất một tiêu chí lọc (bàn hoặc ngày)" });
    }

    const orders = await Order.find(filter);
    const result = orders.map(order => ({
      orderID: order.orderID,
      tableNumber: order.tableNumber,
      totalPrice: order.totalPrice,
      createdTime: order.createdTime,
      note: order.note,
      shiftID: order.shiftID,
      orderStatus: order.orderStatus,
    }));
    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi khi lọc orders:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const objectOrderId = new mongoose.Types.ObjectId(id);

    const deleted = await Order.findOneAndDelete({ orderID: objectOrderId });

    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrderID: deleted.orderID,
    });
  } catch (error) {
    console.error("Lỗi khi xóa order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getActiveTableIDs = async (req, res) => {
  try {
    const activeOrders = await Order.find({ orderStatus: { $ne: "completed" } }).select("tableID");
    const tableIds = activeOrders.map(order => order.tableID);
    res.status(200).json({ tableIds });
  } catch (err) {
    console.error("Lỗi lấy danh sách tableID từ order chưa hoàn tất:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
  
exports.getRevenue = async (req, res) => {
    try {
      const { start_date, end_date, shift_id } = req.query;
      const filter = { orderStatus: "completed" };

      if (start_date) {
        const startDate = new Date(start_date);
        const endDate = end_date ? new Date(end_date) : new Date();
  
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
  
        filter.createdTime = { $gte: startDate, $lte: endDate };
      }

      if (shift_id) {
        filter.shiftID = shift_id;
      }
  
      const orders = await Order.find(filter).lean();
      const total_orders = orders.length;
      const total_revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  
      res.status(200).json({
        total_orders,
        total_revenue,
        detail_orders: orders
      });
    } catch (error) {
      console.error('Error in getRevenue:', error);
      res.status(500).json({ error: 'Server error' });
    }
};
  
exports.getOrderHistory = async (req, res) => {
  try {
    const { start_date, end_date, shift_id } = req.query;

    if (!start_date) {
      return res.status(400).json({ error: "start_date is required" });
    }

    const startDate = new Date(start_date);
    const endDateFinal = end_date ? new Date(end_date) : new Date();

    const filter = {
      createdTime: { $gte: startDate, $lte: endDateFinal },
      orderStatus: "completed"
    };

    if (shift_id) {
      filter.shiftID = shift_id;
    }

    const orders = await Order.find(filter)
      .select("_id tableID totalPrice orderStatus createdTime tableNumber shiftID listMeal")
      .lean();

    const orderHistory = orders.map(order => ({
      order_id: order._id,
      table_id: order.tableID,
      total_price: order.totalPrice,
      status: order.orderStatus,
      timestamp: order.createdTime,
      tableNumber: order.tableNumber,
      shiftID: order.shiftID,
      listMeal: order.listMeal,
    }));

    res.status(200).json({ orders: orderHistory });
  } catch (error) {
    console.error("Error in getOrderHistory:", error);
    res.status(500).json({ error: "Server error" });
  }
};

  