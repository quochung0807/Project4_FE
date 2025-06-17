
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  phone_number?: string;
  avatar?: string;
  role?: 'customer' | 'admin';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  id: number;
  category: Category;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: string; // Giá từ API thường là string để tránh vấn đề làm tròn số thập phân
  stock: number;
  image: string;
  is_visible: boolean;
  is_featured: boolean; // Đã đổi từ camelCase sang snake_case
  created_at: string;
  updated_at: string;
  rating?: number; // `rating` và `review_count` có thể không luôn có, hoặc được tính toán ở frontend
  review_count?: number; // Đã đổi từ camelCase sang snake_case
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  paymentMethod: 'cod' | 'transfer' | 'qr';
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}
