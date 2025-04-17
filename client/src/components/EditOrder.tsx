import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import MainHeadingTitle from "./MainHeadingTitle";
import { MenuItemType } from "../type";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const EditOrder = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/orders/${orderId}`);
        const data = await res.json();
        setItems(data.listMeal); // listMeal là mảng các món ăn
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleQuantityChange = (itemId: string, change: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  const handleSave = async () => {
    try {
      const updateRes = await fetch(`http://localhost:3001/api/orders/updateQuantity/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listMeal: items, totalPrice: calcTotal() }),
      });

      if (!updateRes.ok) throw new Error("Update failed");
      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        text: "Đơn hàng đã được cập nhật!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      });
      navigate(-1);
    } catch (err) {
      console.error("❌ Lỗi khi lưu đơn hàng:", err);
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: "Vui lòng thử lại sau!",
      });
    }
  };

  const calcTotal = () =>
    items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  return (
    <div className="h-full flex items-center flex-col p-4 bg-menu gap-3">
      <div className="flex items-center justify-between w-4/5">
        <MainHeadingTitle title="Edit your order" />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
      <div className="h-full items-center w-4/5 bg-white shadow-2xl rounded-3xl p-4">
        <div className="flex flex-col gap-3 items-center">
          <ul className="w-full">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center p-4 border-b hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="font-bold">{item.name}</span>
                </div>

                <div className="flex items-center gap-8">
                  <span className="text-gray-600">
                    Price: ${Number(item.price) * item.quantity}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="p-1 rounded-full bg-orange-100 hover:bg-orange-200"
                    >
                      <MinusIcon className="w-5 h-5 text-orange-600" />
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="p-1 rounded-full bg-orange-100 hover:bg-orange-200"
                    >
                      <PlusIcon className="w-5 h-5 text-orange-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between w-full mt-4 text-xl">
            <span className="font-bold">Total price:</span>
            <span className="font-bold">${calcTotal()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditOrder;
