const mongoose = require('mongoose');
const Order = require('../models/OrderDetail');

/**
 * API 1: Tạo đơn hàng mới
 * POST /api/orders/create
 */
// Hàm helper: xác định ca trực dựa trên thời gian 
function getShiftByTime(date) {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();

  // CA1: 6:50 → 9:20 → 410 → 560
  if (totalMinutes >= 410 && totalMinutes < 570) {
    return "CA1";
  }
  // CA2: 9:30 → 12:00 → 570 → 720
  else if (totalMinutes >= 570 && totalMinutes < 765) {
    return "CA2";
  }
  // CA3: 12:45 → 15:15 → 765 → 915
  else if (totalMinutes >= 765 && totalMinutes < 925) {
    return "CA3";
  }
  // CA4: 15:25 → 17:55 → 925 → 1075
  else if (totalMinutes >= 925 && totalMinutes < 1075) {
    return "CA4";
  }
  // CA5: 17:55 → 22:00 → 1075 → 1320
  else if (totalMinutes >= 1075 && totalMinutes < 1320) {
    return "CA5";
  }
  // Ngoài các ca trên
  else {
    return "Overtime";
  }
}