import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import { useStaffCustomer } from "../context/StaffCustomerContext";
import { OrderType } from "../type";
import OrderItem from "./OrderItem";

const STAFF_SECRET = "ChangeTable";
const ROLE_TOGGLE_SECRET = "SR";

type TypeRole = "staff" | "customer";
function OrderInMenuPage() {
  const navigate = useNavigate();
  const {
    placeOrder,
    setNote,
    cartItems,
    totalPrice,
    selectedTable,
    setSelectedTable,
    note,
    clearCart,
  } = useCart();

  const {
    currentRole,
    isTableOpened,
    // selectedTable,
    switchToCustomer,
    switchToStaff,
    clearTableData,
    setIsTableOpened,
    setCurrentRole,
  } = useStaffCustomer();

  const { role } = useParams();
  // const [isTableOpened, setIsTableOpened] = useState(false);
  const [freeTables, setFreeTables] = useState<
    { _id: string; tableNumber: number; isOccupied?: boolean }[]
  >([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tempTable, setTempTable] = useState<string | null>(null);
  const [isResetConfirm, setIsResetConfirm] = useState(false);
  const [staffSecret, setStaffSecret] = useState("");
  const [roleSecret, setRoleSecret] = useState("");
  const [isRoleSwitch, setIsRoleSwitch] = useState(false);
  // const [currentRole, setCurrentRole] = useState<TypeRole>("staff");

  // console.log("aaaa", currentRole);

  useEffect(() => {
    fetch("http://localhost:3002/api/tables/free")
      .then((res) => res.json())
      .then((data) => {
        setFreeTables(data);
        if (data.length > 0 && !selectedTable) {
          setSelectedTable(`Table ${data[0].tableNumber}`);
        }
        const savedTable = localStorage.getItem("openedTable");
        if (savedTable) {
          const parsed = JSON.parse(savedTable);
          if (parsed.isOpened) {
            setSelectedTable(parsed.name);
            setIsTableOpened(true);
          }
        }

        // Kiểm tra vai trò đã lưu trong localStorage
        const savedRole = localStorage.getItem("currentRole");
        if (savedRole === "customer") {
          setCurrentRole("customer");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách bàn trống:", err);
      });
  }, []);

  const tableOptions = freeTables.map((table) => ({
    value: `Table ${table.tableNumber}`,
    label: `Table ${table.tableNumber}`,
    isOccupied: table.isOccupied,
    _id: table._id,
  }));
  const customStyles = {
    option: (provided: any, state: any) => {
      const isOccupied = state.data.isOccupied;
      return {
        ...provided,
        backgroundColor: isOccupied
          ? state.isFocused
            ? "#9ca3af"
            : "#d1d5db"
          : state.isFocused
          ? "#fef3c7"
          : "white",
        color: isOccupied ? "white" : "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        cursor: "pointer",
      };
    },
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
    }),
  };

  const formatOptionLabel = (data: any) => (
    <div className="flex justify-between items-center w-full">
      <span>{data.label}</span>
      {data.isOccupied && (
        <button
          className="text-xs text-white bg-green-500 px-2 py-0.5 rounded"
          disabled
        >
          Occupied
        </button>
      )}
    </div>
  );

  const handleOpenTable = () => {
    if (!tempTable)
      return Swal.fire("Chưa chọn bàn", "Vui lòng chọn bàn", "warning");
    setSelectedTable(tempTable);
    setIsOpenModal(false);
    setIsTableOpened(true);
    localStorage.setItem(
      "openedTable",
      JSON.stringify({
        name: tempTable,
        isOpened: true,
      })
    );

    Swal.fire("Bàn đã được mở", "Bây giờ có thể order", "success");
  };

  const handleAddToOrder = async () => {
    try {
      const tableNumber = parseInt(selectedTable.replace("Table ", ""));
      const selected = freeTables.find((t) => t.tableNumber === tableNumber);

      if (!selected) {
        console.error("Không tìm thấy thông tin bàn đã chọn.");
        return;
      }
      const tableID = selected._id;
      const createdTime = new Date();
      const orderRes = await fetch("http://localhost:3001/api/orders");
      const allOrders = await orderRes.json();

      const existingOrder = allOrders.find(
        (order: OrderType) =>
          order.tableID === tableID && order.orderStatus !== "completed"
      );
      const newMeals = cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        mealID: item._id,
        image: item.image,
        status: "confirmed",
      }));

      if (existingOrder) {
        const updateData = {
          listMeal: newMeals,
          totalPrice: totalPrice,
        };

        const updateRes = await fetch(
          `http://localhost:3001/api/orders/${existingOrder.orderID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          }
        );

        if (!updateRes.ok) throw new Error("Cập nhật order thất bại");
        console.log("Đã thêm món vào order cũ");
        placeOrder(existingOrder.orderID, tableID);
        navigate(`/${role}/dashboard/orders/${existingOrder.orderID}`);
      } else {
        const orderData = {
          tableNumber,
          tableID,
          createdTime,
          totalPrice,
          note: note || "",
          listMeal: newMeals,
        };

        const res = await fetch("http://localhost:3001/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) throw new Error("Tạo order thất bại");
        const resData = await res.json();
        const createdOrderID = resData.neworder.orderID;
        placeOrder(createdOrderID, tableID);
        navigate(`/${role}/dashboard/orders/${createdOrderID}`);
      }
    } catch (err) {
      console.error("Lỗi khi tạo order:", err);
    }
  };

  // Hàm xử lý chuyển đổi vai trò
  const handleRoleSwitch = () => {
    if (roleSecret === ROLE_TOGGLE_SECRET) {
      const newRole = currentRole === "staff" ? "customer" : "staff";
      setCurrentRole(newRole);
      localStorage.setItem("currentRole", newRole);
      setRoleSecret("");
      setIsRoleSwitch(false);
      Swal.fire(
        "Đã chuyển vai trò",
        `Bạn đang ở vai trò ${newRole === "staff" ? "Server" : "Customer"}`,
        "success"
      );
    } else {
      Swal.fire(
        "Mã không hợp lệ",
        "Vui lòng nhập đúng mã để chuyển vai trò",
        "error"
      );
    }
  };

  return (
    <div
      className={`${
        cartItems.length !== 0 ? "col-span-3" : "col-span-0"
      }  bg-menu  sticky h-full top-0 p-4 pr-7`}
    >
      <div className="text-center mb-3">
        <span className="text-red-600 font-bold text-3xl ">Order</span>
        {/* Hiển thị vai trò hiện tại */}
        <div className="text-sm text-gray-500 mt-1">
          {currentRole === "staff" ? "Server" : "Customer"}
        </div>
      </div>

      {/* Phần chuyển đổi vai trò */}
      <div className="mb-3">
        {!isRoleSwitch ? (
          <button
            className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded w-full"
            onClick={() => setIsRoleSwitch(true)}
          >
            {currentRole === "staff"
              ? "Concert to customer"
              : "Convert to server"}
          </button>
        ) : (
          <div className="bg-white border p-3 rounded shadow mb-3">
            <div className="text-sm mb-2">Nhập mã để chuyển vai trò:</div>
            <input
              type="password"
              value={roleSecret}
              onChange={(e) => setRoleSecret(e.target.value)}
              className="p-1 border rounded w-full mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsRoleSwitch(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleRoleSwitch}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chỉ hiện setup bàn khi ở vai trò nhân viên và chưa mở bàn */}
      {currentRole === "staff" && !isTableOpened && (
        <div className="mb-4">
          <button
            className=" bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded w-full"
            onClick={() => setIsOpenModal(true)}
          >
            Set up a table 🔓
          </button>
        </div>
      )}

      {isOpenModal && currentRole === "staff" && (
        <div className="bg-white border p-4 rounded shadow text-black">
          <label className="block mb-2">Choose table</label>
          <Select
            options={tableOptions}
            onChange={(e) => {
              setTempTable(e?.value || null);
            }}
            styles={customStyles}
            formatOptionLabel={formatOptionLabel}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsOpenModal(false)}
              className="bg-gray-400 text-white px-4 py-1 rounded"
            >
              Cancle
            </button>
            <button
              onClick={handleOpenTable}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {isTableOpened && (
        <div className="mb-3">
          <div className="bg-gray-100 p-2 rounded text-black mb-2">
            {selectedTable}
          </div>
          {/* Chỉ hiện nút đổi bàn khi ở vai trò nhân viên */}
          {currentRole === "staff" && !isResetConfirm && (
            <button
              className="text-sm px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              onClick={() => setIsResetConfirm(true)}
            >
              Change table 🔄
            </button>
          )}
          {currentRole === "staff" && isResetConfirm && (
            <div className="mt-2">
              <input
                type="password"
                placeholder="Enter secret code"
                value={staffSecret}
                onChange={(e) => setStaffSecret(e.target.value)}
                className="p-1 border rounded w-full mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsResetConfirm(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (staffSecret === STAFF_SECRET) {
                      setIsTableOpened(false);
                      setSelectedTable("");
                      setTempTable(null);
                      setIsResetConfirm(false);
                      setStaffSecret("");
                      // Xóa bàn đã lưu
                      localStorage.removeItem("openedTable");
                      // Nếu đang ở vai trò khách, chuyển về vai trò nhân viên
                      if (currentRole === ("customer" as TypeRole)) {
                        setCurrentRole("staff");
                        localStorage.setItem("currentRole", "staff");
                      }
                      Swal.fire(
                        "Table reset",
                        "You can set up another table now",
                        "info"
                      );
                    } else {
                      Swal.fire(
                        "Invalid code",
                        "Please enter the correct staff code",
                        "error"
                      );
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        {cartItems.length === 0 ? (
          <div className="text-center mb-3">
            <p className="text-black">No meals in the cart.</p>
          </div>
        ) : (
          cartItems.map((item) => <OrderItem key={item._id} item={item} />)
        )}
      </div>

      {cartItems.length !== 0 && (
        <div className="flex items-center justify-between mt-6">
          <span className="font-bold">Total price</span>
          <span className="font-bold">${totalPrice}</span>
        </div>
      )}

      {/* Chỉ hiện phần ghi chú khi là khách hàng hoặc đã ở vai trò khách hàng */}
      {currentRole === "customer" && (
        <div>
          <input
            className="mt-3 mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Note"
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            handleAddToOrder();
          }}
          className="px-3 py-2 text-sm rounded-md inline-block font-semibold border-none cursor-pointer transition-all duration-300 bg-orange-600 text-white hover:bg-orange-700"
          disabled={
            cartItems.length === 0 ||
            cartItems.every((item) => item.quantity === 0)
          }
        >
          Add to order
        </button>
      </div>
    </div>
  );
}

export default OrderInMenuPage;

function getShiftByTime(date: Date): string {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();

  if (totalMinutes >= 410 && totalMinutes < 570) return "CA1"; // 6:50–9:30
  if (totalMinutes >= 570 && totalMinutes < 765) return "CA2"; // 9:30–12:45
  if (totalMinutes >= 765 && totalMinutes < 925) return "CA3"; // 12:45–15:25
  if (totalMinutes >= 925 && totalMinutes < 1075) return "CA4"; // 15:25–17:55
  if (totalMinutes >= 1075 && totalMinutes < 1320) return "CA5"; // 17:55–22:00
  return "Overtime";
}
