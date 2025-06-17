
import { Review } from "../types";

export const mockReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    userName: "Nguyễn Văn A",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40",
    rating: 5,
    comment: "Sản phẩm rất tốt, chất lượng như mô tả. Giao hàng nhanh chóng.",
    createdAt: "2024-05-20T09:15:00Z",
    helpful: 12
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    userName: "Trần Thị B",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40",
    rating: 4,
    comment: "iPhone đẹp, camera chụp ảnh rất rõ nét. Giá hơi cao nhưng xứng đáng.",
    createdAt: "2024-05-18T16:30:00Z",
    helpful: 8
  },
  {
    id: 3,
    productId: 3,
    userId: 3,
    userName: "Lê Văn C",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40",
    rating: 5,
    comment: "AirPods Pro chống ồn rất tốt, âm thanh chất lượng cao.",
    createdAt: "2024-06-02T11:45:00Z",
    helpful: 15
  }
];
