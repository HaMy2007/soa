// trang menu, khong tinh phan sidebar vi da duoc goi trong dashboard

import MenuSection from "../components/MenuSection";
import MainHeadingTitle from "../components/MainHeadingTitle";
import OrderInMenuPage from "../components/OrderInMenuPage";
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Meal = {
  _id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  description: string;
  isLocked: boolean;
};

const Menu = () => {
  const { cartItems, clearCart } = useCart();
  const [meals, setMeals] = useState<Meal[]>([]);
  const categories = ["APPETIZER", "MAIN COURSE", "FAST FOOD", "DRINKS"];
  const { role } = useParams();

  useEffect(() => {
    fetch("http://localhost:1234/menu/api/meals")
      .then((res) => res.json())
      .then((data) => {
        setMeals(data);
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu meal:", err);
      });
  }, []);

  useEffect(() => {
    if (role === "manager") {
      clearCart(); 
    }
  }, [role]);
  
  const handleLockToggle = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:1234/menu/api/meals/${id}/lock`, {
        method: "PUT",
      });

      const data = await res.json();
      console.log("Lock updated:", data);

      if (res.ok) {
        setMeals((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isLocked: data.meal.isLocked } : item
          )
        );
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái khóa:", err);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-3.5 h-full">
      <div
        className={` 
          ${role === "chef" ? "col-span-12" : "col-span-9"}   
          flex flex-col gap-4 items-center bg-menu py-4 px-2 col-span-9 h-full overflow-y-auto `}
      >
        <MainHeadingTitle
          title="Our Menu"
          subtitle="Discover a feast of flavors with our exciting menu!"
        />

        <div>
        {categories.map((category) => (
            <MenuSection
              key={category}
              title={category}
              menuItems={meals
                .filter((meal) => meal.category === category)
                .map((meal) => ({
                  _id: meal._id,
                  name: meal.name,
                  price: meal.price,
                  image: meal.image,
                  description: meal.description,
                  isLocked: meal.isLocked,
                  quantity: 1,
                  status: "confirmed",
                }))
              }
              handleLockToggle={handleLockToggle}
            />
          ))}
        </div>
      </div>

      {role !== "chef" && (
    <div className="col-span-3">
      <OrderInMenuPage />
    </div>
  )}
      </div>
  );
};

export default Menu;
