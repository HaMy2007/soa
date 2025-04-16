const express = require("express");
const router = express.Router();
const orderingController = require("../controllers/orderingControllers");

router.get("/orders/filter", orderingController.filterOrders); 
router.post("/orders", orderingController.createOrder);  
router.get("/orders", orderingController.getOrders);
router.get("/orders/:id", orderingController.getOrderDetails);
router.put('/orders/:orderId/meals/:mealId/status', orderingController.updateMealStatus);  
router.get('/bills', orderingController.getOrderHistory);  
router.get('/revenue', orderingController.getRevenue);     
router.put('/orders/:id/status', orderingController.updateOrderStatus);  
router.put("/orders/:id", orderingController.updateOrderById); //thêm món vào order (khách gọi thêm món)
router.delete("/orders/:id", orderingController.deleteOrderById);
router.put("/orders/updateQuantity/:id", orderingController.updateOrderItems);   //cập nhật số lượng hoặc món ăn khi đơn hàg chưa được chế biến 
router.get('/active-table-ids', orderingController.getActiveTableIDs);  

module.exports = router;
