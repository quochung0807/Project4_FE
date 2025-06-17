import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { fetchAdminAnalytics, AnalyticsData } from '@/data/adminAnalytics';

const AdminDashboard = () => {
  const accessToken = useStore((state) => state.accessToken);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnalyticsData = async () => {
      if (!accessToken) {
        setError("Không tìm thấy Access Token. Vui lòng đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchAdminAnalytics(accessToken);
        setAnalyticsData(data);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Không thể tải dữ liệu phân tích. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    getAnalyticsData();
  }, [accessToken]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return <div className="text-center text-lg font-medium">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center text-lg font-medium text-red-500">{error}</div>;
  }

  // --- Cập nhật truy cập dữ liệu để khớp với response API ---

  // Sử dụng dữ liệu từ API, hoặc dữ liệu mặc định nếu API trả về null/undefined
  const totalOrders = analyticsData?.statsOrders?.order_count ?? 0; // Đổi totalOrders -> order_count
  const totalRevenue = analyticsData?.statsOrders?.total_revenue ?? 0; // Đổi totalRevenue -> total_revenue
  const totalProducts = analyticsData?.statsProducts?.product_count ?? 0; // Đổi totalProducts -> product_count
  const totalCustomers = analyticsData?.statsUsers?.user_count ?? 0; // Đổi totalUsers -> user_count
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Dữ liệu biểu đồ từ API
  const revenueData = analyticsData?.monthlyTrend?.map((item: any) => ({
    month: `T${item.month}`,
    revenue: item.revenue // Đổi totalRevenue -> revenue
  })) ?? [];

  const orderTrendData = analyticsData?.dailySales?.map((item: any) => ({
    day: item.date, // Đổi dayOfWeek -> date
    orders: item.sales // Đổi totalOrders -> sales
  })) ?? [];

  // Đảm bảo item.name không phải là undefined trước khi gọi toLowerCase()
  // Cũng cần điều chỉnh `name` thay vì `statusName`
  const orderStatusData = analyticsData?.orderStatus?.map((item: any) => ({
    name: item.name, // Đổi statusName -> name
    value: item.value,
    color: {
      'pending': '#f59e0b',    // Màu sắc cho trạng thái 'Pending'
      'processing': '#6366f1', // Màu sắc cho trạng thái 'Processing'
      'shipped': '#3b82f6',    // Màu sắc cho trạng thái 'Shipped'
      'delivered': '#22c55e',  // Màu sắc cho trạng thái 'Delivered'
      'cancelled': '#ef4444'   // Màu sắc cho trạng thái 'Cancelled'
    }[item.name?.toLowerCase()] || '#cccccc' // <-- Thêm ?. để kiểm tra undefined và dùng item.name
  })) ?? [];


  const recentActivities = analyticsData?.recentOrders?.slice(0, 3).map((order: any) => ({
    id: order.id,
    description: `Đơn hàng #${order.id} đã ${
      order.status?.toLowerCase() === 'delivered' ? 'được giao' :
      order.status?.toLowerCase() === 'pending' ? 'chờ xử lý' :
      order.status?.toLowerCase() === 'processing' ? 'đang xử lý' :
      order.status?.toLowerCase() === 'shipped' ? 'đang vận chuyển' :
      order.status?.toLowerCase() === 'cancelled' ? 'bị hủy' : 'cập nhật trạng thái'
    }`, // Cập nhật mô tả để phản ánh trạng thái cụ thể hơn
    time: `${Math.floor(Math.random() * 60)} phút trước`, // Giữ nguyên random time, bạn có thể thay bằng order_date
    color: {
      'pending': 'bg-yellow-500',
      'processing': 'bg-indigo-500', // Màu tương ứng với processing
      'shipped': 'bg-blue-500',
      'delivered': 'bg-green-500',
      'cancelled': 'bg-red-500'
    }[order.status?.toLowerCase()] || 'bg-gray-500' // <-- Thêm ?. để kiểm tra undefined
  })) ?? [
    // Dữ liệu mặc định nếu không có recentOrders
    { description: 'Đơn hàng #1001 đã được giao', time: '2 phút trước', color: 'bg-green-500' },
    { description: 'Sản phẩm mới được thêm', time: '15 phút trước', color: 'bg-blue-500' },
    { description: 'Đánh giá mới cần kiểm duyệt', time: '1 giờ trước', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-green-600">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-green-600">+8% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-blue-600">+3 sản phẩm mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-green-600">+5% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(avgOrderValue)}</div>
            <p className="text-xs text-green-600">+3% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatPrice(Number(value))} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xu hướng đơn hàng 7 ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;