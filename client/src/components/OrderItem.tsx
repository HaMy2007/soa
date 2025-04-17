// tung order duoc them vao list order trong ben phai trang menu

import { XCircleIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import { MenuItemType } from "../type";

type Props = {
  item: MenuItemType;
};

const OrderItem = ({ item }: Props) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="relative flex items-center bg-menu-item shadow-md rounded-xl p-2 gap-2 mt-3 mb-3">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 object-cover"
      />
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h2 className="font-bold">{item.name}</h2>
          <p className="text-gray-700 text-sm">Price: ${item.price}</p>
        </div>

        <div className="flex items-center">
          <button
            className=" text-orange-600 hover:text-orange-700 text-xl cursor-pointer rounded-full text-center px-2.5"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            +
          </button>
          <p className="">{item.quantity}</p>

          <button
            className=" text-orange-600 hover:text-orange-700 text-xl cursor-pointer rounded-full text-center px-2.5"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
          >
            -
          </button>
        </div>

        <button
          className="absolute right-0 -bottom-2.5"
          onClick={() => removeFromCart(item._id)}
        >
          <XCircleIcon className="size-5 bg-orange-600 text-white hover:bg-orange-700 rounded-full" />
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
