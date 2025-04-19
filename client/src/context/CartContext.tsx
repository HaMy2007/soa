import React, { createContext, useContext, useState } from "react";
import { MenuItemType, OrderType } from "../type";

type CartContextType = {
  cartItems: MenuItemType[];
  orders: OrderType[];
  menuItems: MenuItemType[];
  totalPrice: number;
  selectedTable: string;
  note: string;
  addToCart: (item: MenuItemType) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeOrderFromListOrder: (id: string) => Promise<void>;
  placeOrder: (orderId: string, tableID: string) => void;
  setSelectedTable: (name: string) => void;
  setNote: (note: string) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItemType>) => void;
  updateOrderStatusForMeal: (
    orderId: string,
    itemId: string,
    newStatus: string
  ) => void;
  clearCart: () => void;
  updateOrderItem: (orderId: string, updatedItems: MenuItemType[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<MenuItemType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  const [selectedTable, setSelectedTable] = useState<string>("Table 1");
  const [note, setNote] = useState<string>("");

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const placeOrder = (orderId: string, tableID: string) => {
    const newOrder: OrderType = {
      id: orderId, // orderID từ server trả về
      items: cartItems,
      totalPrice: totalPrice,
      tableNumber: selectedTable,
      tableID: tableID,
      date: new Date().toLocaleString(),
      note: note,
      orderStatus: "confirmed",
    };

    setOrders([...orders, newOrder]);
    setCartItems([]);
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedTable("");
    setNote("");
  };

  const addToCart = (item: MenuItemType) => {
    if (!item._id) {
      console.error("❌ Món ăn không có _id hợp lệ:", item);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id);
      console.log("id meal: ", item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      quantity = 1;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const removeOrderFromListOrder = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Xóa order thất bại");
      }

      setOrders((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log("✅ Đã xóa order thành công");
    } catch (error) {
      console.error("❌ Lỗi khi xóa order:", error);
      alert("Không thể xóa đơn hàng. Vui lòng thử lại.");
    }
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItemType>) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, ...updates } : item
      )
    );
  };

  const updateOrderStatusForMeal = (
    orderId: string,
    itemId: string,
    newStatus: string
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) =>
            item._id === itemId ? { ...item, status: newStatus } : item
          );
          return { ...order, items: updatedItems };
        }
        return order;
      })
    );
  };

  const updateOrderItem = (orderId: string, updatedItems: MenuItemType[]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: updatedItems,
              totalPrice: updatedItems.reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
              ),
            }
          : order
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        updateOrderItem,
        setNote,
        note,
        menuItems,
        updateMenuItem,
        selectedTable,
        setSelectedTable,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        placeOrder,
        orders,
        removeOrderFromListOrder,
        updateOrderStatusForMeal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
