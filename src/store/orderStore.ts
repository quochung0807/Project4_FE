// store/orderStore.ts
import { create } from 'zustand';

type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
};

type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
  price_at_order: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  address: string;
};

type Order = {
  id: number;
  user: User;
  items: OrderItem[];
  order_date: string;
  status: string;
  total_amount: string;
  payment_method: string;
  shipping_address: string;
};

type OrderStore = {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loading: false,
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const res = await fetch("https://electrostore-ofl1.onrender.com/api/orders/");
      const data = await res.json();
      set({ orders: data.results });
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      set({ loading: false });
    }
  }
}));
