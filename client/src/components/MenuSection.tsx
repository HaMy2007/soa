import MenuItem from "./MenuItem";
import { MenuItemType } from "../type";
type Props = {
  menuItems: MenuItemType[];
  title: string;
  handleLockToggle: (id: string, currentLock: boolean) => void;
};

const MenuSection = ({ menuItems, title, handleLockToggle }: Props) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="bg-menu-title rounded-sm px-4 py-2">
        <span className="text-2xl font-bold text-gray-800">{title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item, index) => (
          <MenuItem
            key={item._id}
            image={item.image}
            name={item.name}
            description={item.description}
            price={item.price}
            quantity={item.quantity}
            _id={item._id}
            status={item.status}
            isLocked={item.isLocked}
            handleLockToggle={handleLockToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
