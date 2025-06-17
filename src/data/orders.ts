
import { Order } from "../types";

export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        product: {
          id: 1,
          name: "iPhone 15 Pro Max",
          slug: "iphone-15-pro-max",
          brand: "Apple",
          description: "iPhone 15 Pro Max 256GB",
          price: 34990000,
          originalPrice: 39990000,
          stock: 50,
          image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600",
          images: ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"],
          category_id: 1,
          rating: 4.8,
          reviewCount: 156,
          isFeatured: true,
          tags: ["smartphone", "apple", "premium"],
          specifications: {
            "Màn hình": "6.7 inch Super Retina XDR",
            "Chip": "A17 Pro",
            "RAM": "8GB",
            "Bộ nhớ": "256GB"
          }
        },
        quantity: 1
      }
    ],
    total: 38589000, // Including tax
    status: 'delivered',
    createdAt: '2024-05-15T10:30:00Z',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    paymentMethod: 'cod',
    customerInfo: {
      fullName: 'Nguyễn Văn A',
      email: 'nguyen.a@example.com',
      phone: '0123456789'
    }
  },
  {
    id: 2,
    userId: 1,
    items: [
      {
        product: {
          id: 3,
          name: "AirPods Pro 2nd Generation",
          slug: "airpods-pro-2nd-generation",
          brand: "Apple",
          description: "AirPods Pro thế hệ 2",
          price: 6490000,
          originalPrice: 6990000,
          stock: 100,
          image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600",
          images: ["https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600"],
          category_id: 3,
          rating: 4.7,
          reviewCount: 234,
          isFeatured: true,
          tags: ["airpods", "wireless", "apple"],
          specifications: {
            "Chip": "Apple H2",
            "Chống ồn": "Active Noise Cancellation"
          }
        },
        quantity: 2
      }
    ],
    total: 14278000,
    status: 'shipped',
    createdAt: '2024-06-01T14:20:00Z',
    shippingAddress: '456 Đường XYZ, Quận 3, TP.HCM',
    paymentMethod: 'transfer',
    customerInfo: {
      fullName: 'Nguyễn Văn A',
      email: 'nguyen.a@example.com',
      phone: '0123456789'
    }
  }
];
