import { useStore } from '@/store/useStore';

export interface AnalyticsData {
  keyMetrics: any;
  monthlyTrend: any;
  dailySales: any;
  orderStatus: any;
  categoryDistribution: any;
  topProducts: any;
  recentOrders: any;
  stats: any;
  statsOrders: any;
  statsProducts: any;
  statsUsers: any;
}

export const fetchAdminAnalytics = async (accessToken: string | null): Promise<AnalyticsData> => {
  const BASE_URL = "http://https://electrostore-ofl1.onrender.com/api";

  const endpoints = {
    keyMetrics: `${BASE_URL}/admin/analytics/key-metrics/`,
    monthlyTrend: `${BASE_URL}/admin/analytics/monthly-trend/`,
    dailySales: `${BASE_URL}/admin/analytics/daily-sales/`,
    orderStatus: `${BASE_URL}/admin/analytics/order-status/`,
    categoryDistribution: `${BASE_URL}/admin/analytics/category-distribution/`,
    topProducts: `${BASE_URL}/admin/analytics/top-products/`,
    recentOrders: `${BASE_URL}/admin/recent-orders/`,
    stats: `${BASE_URL}/admin/stats/`,
    statsOrders: `${BASE_URL}/admin/stats/orders/`,
    statsProducts: `${BASE_URL}/admin/stats/products/`,
    statsUsers: `${BASE_URL}/admin/stats/users/`
  };

  const fetchWithErrorHandler = async (url: string) => {
    try {
      // Log URL của API trước khi gọi
      console.log(`📡 Calling API: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
      });

      if (!response.ok) {
        console.error(`❌ Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        // Log phản hồi lỗi nếu có thể
        try {
          const errorData = await response.json();
          console.error(`🚨 Error Response for ${url}:`, errorData);
        } catch (e) {
          console.error(`🚨 Could not parse error response for ${url}.`);
        }
        return null;
      }

      const data = await response.json();
      // Log dữ liệu phản hồi thành công
      console.log(`✅ Response for ${url}:`, data);
      return data;

    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error);
      return null;
    }
  };

  const [
    keyMetrics,
    monthlyTrend,
    dailySales,
    orderStatus,
    categoryDistribution,
    topProducts,
    recentOrders,
    stats,
    statsOrders,
    statsProducts,
    statsUsers
  ] = await Promise.all([
    fetchWithErrorHandler(endpoints.keyMetrics),
    fetchWithErrorHandler(endpoints.monthlyTrend),
    fetchWithErrorHandler(endpoints.dailySales),
    fetchWithErrorHandler(endpoints.orderStatus),
    fetchWithErrorHandler(endpoints.categoryDistribution),
    fetchWithErrorHandler(endpoints.topProducts),
    fetchWithErrorHandler(endpoints.recentOrders),
    fetchWithErrorHandler(endpoints.stats),
    fetchWithErrorHandler(endpoints.statsOrders),
    fetchWithErrorHandler(endpoints.statsProducts),
    fetchWithErrorHandler(endpoints.statsUsers)
  ]);

  return {
    keyMetrics,
    monthlyTrend,
    dailySales,
    orderStatus,
    categoryDistribution,
    topProducts,
    recentOrders,
    stats,
    statsOrders,
    statsProducts,
    statsUsers
  };
};