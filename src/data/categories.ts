// @/data/categories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { Category } from "@/types"; // Đảm bảo đường dẫn đúng

export const useCategories = (accessToken: string | null) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Luôn gọi API, chỉ truyền Authorization nếu có token
        const headers = {
          accept: "application/json",
        };
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const res = await axios.get("https://electrostore-ofl1.onrender.com/api/categories/", {
          headers,
        });
        setCategories(res.data.results || res.data);
      } catch (err) {
        setError("Không thể tải danh mục");
        console.error("Lỗi khi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [accessToken]);

  return { categories, loading, error };
};
