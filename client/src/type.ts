export interface MenuItemType {
  _id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  isLocked: boolean;
}

export interface OrderType {
  id: string;
  items: MenuItemType[];
  totalPrice: number;
  date: string;
  tableNumber: string;
  orderStatus: string;
  tableID: string;
  note: string;
}
