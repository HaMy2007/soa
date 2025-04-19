import { useEffect, useState } from "react";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import Button from "../components/Button";
import MainHeadingTitle from "../components/MainHeadingTitle";
import { useCart } from "../context/CartContext";
import { useRole } from "../context/RoleContext";
import { useStaffCustomer } from "../context/StaffCustomerContext";

type Order = {
  id: string;
  tableNumber: number;
  totalPrice: number;
  date: string;
  note: string;
  status: string;
  shift: string;
};

const Orders = () => {
  const { removeOrderFromListOrder } = useCart();
  const { role } = useRole();
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const { currentRole, getCurrentTableNumber } = useStaffCustomer();
  const location = useLocation();

  const canManageOrders = role !== "customer";
  const isCustomerView = role === "customer" && currentRole === "customer";

  const handleFilter = async () => {
    if (!selectedTable && !selectedDate) {
      Swal.fire(
        "Thiếu thông tin",
        "Vui lòng chọn bàn hoặc ngày để lọc.",
        "warning"
      );
      return;
    }

    try {
      const params = new URLSearchParams();
      if (selectedTable) params.append("tableNumber", selectedTable.toString());
      if (selectedDate) params.append("date", selectedDate);

      const res = await fetch(
        `http://localhost:3001/api/orders/filter?${params.toString()}`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        const mapped = data.map((order: any) => ({
          id: order.orderID,
          tableNumber: order.tableNumber,
          totalPrice: order.totalPrice,
          date: order.createdTime,
          note: order.note,
          shift: order.shiftID,
          status: order.orderStatus,
        }));

        if (isCustomerView) {
          const currentTableNumber = getCurrentTableNumber();
          if (currentTableNumber) {
            const filteredOrders = mapped.filter(
              (order) => order.tableNumber === currentTableNumber
            );
            setOrders(filteredOrders);
          }
        } else {
          setOrders(mapped);
        }
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", data);
        Swal.fire("Lỗi dữ liệu", "Không thể đọc dữ liệu đơn hàng.", "error");
        setOrders([]);
      }
    } catch (err) {
      console.error("Lỗi khi lọc đơn:", err);
      Swal.fire("Lỗi", "Không thể kết nối đến server", "error");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:1234/order/api/orders");
      const data = await res.json();
      const mappedOrders = data.map((order: any) => ({
        id: order.orderID,
        tableNumber: order.tableNumber,
        totalPrice: order.totalPrice,
        date: order.createdTime,
        note: order.note,
        shift: order.shiftID,
        status: order.orderStatus,
      }));

      let filteredOrders = mappedOrders;

      if (isCustomerView) {
        const currentTableNumber = getCurrentTableNumber();
        if (currentTableNumber) {
          filteredOrders = mappedOrders.filter(
            (order) =>
              order.tableNumber === currentTableNumber &&
              order.status !== "completed"
          );
        } else {
          filteredOrders = []; 
        }
      }

      setAllOrders(filteredOrders);
      setOrders(filteredOrders);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true });
    }
  }, [role, currentRole, getCurrentTableNumber(), location.state?.refresh]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:1234/order/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedOrder = orders.find((o) => o.id === id);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Đơn hàng tại bàn ${
            updatedOrder?.tableNumber ?? "?"
          } đã được cập nhật thành công.`,
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchOrders();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái đơn hàng thất bại.");
    }
  };

  const handleEdit = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`edit-order/${orderId}`);
  };

  const handleCompleteOrder = async (orderId: string, tableNumber: number) => {
    try {
      const response = await fetch(
        `http://localhost:1234/order/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "completed",
            endTime: new Date(),
          }),
        } 
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Xuất hóa đơn thành công!",
          text: `Đơn hàng tại bàn ${tableNumber} đã hoàn tất.`,
          timer: 2000,
          showConfirmButton: false,
        });

        await fetchOrders();
      } else {
        Swal.fire(
          "Lỗi",
          data.message || "Không thể cập nhật trạng thái",
          "error"
        );
      }
    } catch (err) {
      console.error("Lỗi khi xuất hóa đơn:", err);
      Swal.fire("Lỗi", "Không thể kết nối đến server", "error");
    }
  };

  const renderFilterSection = () => {
    if (isCustomerView) return null;

    return (
      <div className="flex gap-4 items-center mb-4">
        <select
          className="p-2 border rounded"
          value={selectedTable}
          onChange={(e) => setSelectedTable(Number(e.target.value))}
        >
          <option value="">-- Chọn bàn --</option>
          {[...new Set(allOrders.map((o) => o.tableNumber))].map((num) => (
            <option key={num} value={num}>
              Bàn {num}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="p-2 border rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
    );
  };

  return (
    <div className="h-full flex items-center flex-col p-4 bg-menu gap-3">
      <div className="flex items-center justify-between w-4/5">
        <MainHeadingTitle
          title={isCustomerView ? "Your Orders" : "All Orders"}
        />
      </div>

      <div className="h-full items-center w-4/5 bg-white shadow-2xl rounded-3xl p-4 overflow-y-auto">
        {renderFilterSection()}

        {orders.length === 0 ? (
          <div className="flex items-center justify-center text-center text-gray-600">
            <p className="text-black">
              {isCustomerView
                ? "Bạn chưa có đơn hàng nào đang hoạt động cho bàn hiện tại."
                : "Không có đơn hàng nào được tìm thấy."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {orders.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/${role}/dashboard/orders/${item.id}`)}
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-200 to-pink-200 p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-300"
              >
                <div className="w-full">
                  <span className="font-bold text-lg text-red-500">
                    Bàn {item.tableNumber}
                  </span>
                  <h3 className="text-gray-700">Total: ${item.totalPrice}</h3>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(item.date).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="text-sm text-gray-600">Shift: {item.shift}</p>
                  <p className="text-sm text-gray-600">Note: {item.note}</p>
                  <p className="text-sm text-gray-600">Status: {item.status}</p>
                </div>

                {canManageOrders && (
                  <div className="flex flex-col gap-3 w-full items-end">
                    <div className="flex gap-2">
                      {item.status === "confirmed" && (
                        <>
                          <button
                            className="rounded text-white bg-red-600 hover:bg-red-700 p-2 transition duration-200"
                            onClick={async (e) => {
                              e.stopPropagation();
                              const result = await Swal.fire({
                                title:
                                  "Bạn có chắc muốn xóa hoá đơn này không?",
                                text: "Hành động này không thể hoàn tác!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#3085d6",
                                confirmButtonText: "Xóa",
                                cancelButtonText: "Hủy",
                              });
                              if (result.isConfirmed) {
                                await removeOrderFromListOrder(item.id);
                                await fetchOrders();
                                Swal.fire(
                                  "Đã xóa!",
                                  "Đơn hàng đã được xóa thành công.",
                                  "success"
                                );
                              }
                            }}
                          >
                            <MdDeleteForever />
                          </button>
                          <button
                            className="rounded text-white bg-blue-600 hover:bg-blue-700 p-2 transition duration-200"
                            onClick={(e) => handleEdit(item.id, e)}
                          >
                            <MdModeEditOutline />
                          </button>
                        </>
                      )}
                    </div>

                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={item.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateOrderStatus(item.id, e.target.value)
                      }
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>

                    {role === "manager" && item.status !== "completed" && (
                      <Button
                        className="text-sm px-3 py-2 font-thin"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteOrder(item.id, item.tableNumber);
                        }}
                      >
                        Xuất hóa đơn
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
