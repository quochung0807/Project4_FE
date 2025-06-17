import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { useStore } from '@/store/useStore'; // Import useStore để lấy accessToken
import { fetchAdminAnalytics, AnalyticsData } from '@/data/adminAnalytics'; // Import hàm fetch API và kiểu dữ liệu

const AdminAnalytics = () => {
  const accessToken = useStore((state) => state.accessToken); // Lấy accessToken từ store

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
  }, [accessToken]); // Chạy lại khi accessToken thay đổi

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return <div className="text-center text-lg font-medium">Đang tải dữ liệu phân tích...</div>;
  }

  if (error) {
    return <div className="text-center text-lg font-medium text-red-500">{error}</div>;
  }

  // --- Ánh xạ dữ liệu từ API response ---
  // Sử dụng toán tử ?? để cung cấp giá trị mặc định nếu dữ liệu là null/undefined

  // Dữ liệu cho Key Metrics (từ API /admin/analytics/key-metrics/ hoặc /admin/stats/)
  const currentMonthRevenue = analyticsData?.keyMetrics?.totalRevenue ?? 0;
  const currentMonthOrders = analyticsData?.keyMetrics?.totalOrders ?? 0;
  const newCustomers = analyticsData?.keyMetrics?.totalCustomers ?? 0; // Hoặc từ statsUsers.user_count nếu API chỉ có tổng
  const productsSold = analyticsData?.keyMetrics?.totalProductsSold ?? 0; // Hoặc từ statsProducts.product_count nếu API chỉ có tổng

  // Dữ liệu biểu đồ Daily Sales (từ API /admin/analytics/daily-sales/)
  const dailySalesData = analyticsData?.dailySales?.map((item: any) => ({
    date: item.date, // API trả về 'date'
    sales: item.sales,
    revenue: item.revenue,
  })) ?? [];

  // Dữ liệu biểu đồ Top Products (từ API /admin/analytics/top-products/)
  const topProductsData = analyticsData?.topProducts?.map((item: any) => ({
    name: item.name,
    sales: item.sales,
    revenue: item.revenue,
  })) ?? [];

  // Dữ liệu biểu đồ Category Distribution (từ API /admin/analytics/category-distribution/)
  const categoryData = analyticsData?.categoryDistribution?.map((item: any) => ({
    name: item.name,
    value: item.value,
    color: item.color, // API đã trả về màu
  })) ?? [];

  // Dữ liệu biểu đồ Monthly Trend (từ API /admin/analytics/monthly-trend/)
  const monthlyTrendData = analyticsData?.monthlyTrend?.map((item: any) => ({
    month: `T${item.month}`, // API trả về 'month' dạng số
    orders: item.orders,
    customers: item.customers,
    revenue: item.revenue,
  })) ?? [];

  // Để tính toán phần trăm thay đổi, bạn cần dữ liệu tháng trước đó.
  // Hiện tại, API chỉ trả về dữ liệu của tháng hiện tại.
  // Giả định bạn có dữ liệu tháng trước để so sánh (hoặc lấy từ keyMetrics nếu API cung cấp).
  // Ví dụ đơn giản: Giả định tăng trưởng ngẫu nhiên nếu không có dữ liệu tháng trước.
  const revenueChange = 15.2; // Dựa trên mock hoặc tính toán từ API nếu có dữ liệu tháng trước
  const ordersChange = 8.5;
  const customersChange = 12.8;
  const productsSoldChange = -2.1;

  // Xác định biểu tượng và màu sắc cho xu hướng
  const getTrendIcon = (change: number) => (change >= 0 ? <TrendingUp className="h-4 w-4 text-green-600 mr-1" /> : <TrendingDown className="h-4 w-4 text-red-600 mr-1" />);
  const getTrendColor = (change: number) => (change >= 0 ? 'text-green-600' : 'text-red-600');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Thống kê & Phân tích</h1>
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doanh thu tháng</p>
                <p className="text-2xl font-bold">{formatPrice(currentMonthRevenue)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(revenueChange)}
                  <span className={`text-sm ${getTrendColor(revenueChange)}`}>{revenueChange > 0 ? '+' : ''}{revenueChange}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đơn hàng tháng</p>
                <p className="text-2xl font-bold">{formatNumber(currentMonthOrders)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(ordersChange)}
                  <span className={`text-sm ${getTrendColor(ordersChange)}`}>{ordersChange > 0 ? '+' : ''}{ordersChange}%</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Khách hàng mới</p>
                <p className="text-2xl font-bold">{formatNumber(newCustomers)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(customersChange)}
                  <span className={`text-sm ${getTrendColor(customersChange)}`}>{customersChange > 0 ? '+' : ''}{customersChange}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sản phẩm bán</p>
                <p className="text-2xl font-bold">{formatNumber(productsSold)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(productsSoldChange)}
                  <span className={`text-sm ${getTrendColor(productsSoldChange)}`}>{productsSoldChange > 0 ? '+' : ''}{productsSoldChange}%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh số 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'sales' ? formatNumber(Number(value)) : formatPrice(Number(value)),
                    name === 'sales' ? 'Đơn hàng' : 'Doanh thu'
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng 6 tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? formatPrice(Number(value)) : formatNumber(Number(value)),
                    name === 'orders' ? 'Đơn hàng' : name === 'customers' ? 'Khách hàng' : 'Doanh thu'
                  ]}
                />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} /> {/* Thêm line cho doanh thu */}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical"> {/* Đổi layout thành vertical nếu muốn trục Y hiển thị tên sản phẩm */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} /> {/* Tăng width để hiển thị đủ tên sản phẩm */}
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? formatNumber(Number(value)) : formatPrice(Number(value)),
                  name === 'sales' ? 'Số lượng bán' : 'Doanh thu'
                ]} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
                {/* Có thể thêm Bar cho revenue nếu muốn hiển thị cả hai */}
                {/* <Bar dataKey="revenue" fill="#8884d8" /> */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê chi tiết sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Sản phẩm</th>
                  <th className="text-left py-3 px-4">Số lượng bán</th>
                  <th className="text-left py-3 px-4">Doanh thu</th>
                  <th className="text-left py-3 px-4">Tỉ lệ</th>
                  <th className="text-left py-3 px-4">Xu hướng</th>
                </tr>
              </thead>
              <tbody>
                {topProductsData.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">{product.name}</td>
                    <td className="py-4 px-4">{formatNumber(product.sales)}</td>
                    <td className="py-4 px-4">{formatPrice(product.revenue)}</td>
                    <td className="py-4 px-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        {/* Thay 450 bằng tổng doanh số cao nhất hoặc tổng doanh số để tính tỷ lệ chính xác hơn */}
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(product.sales / (analyticsData?.keyMetrics?.totalProductsSold || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {/* Xu hướng random, bạn có thể thay bằng dữ liệu thực tế nếu có */}
                        {getTrendIcon(Math.random() * 20 - 10)} {/* Random từ -10 đến +10 */}
                        <span className={`text-sm ${getTrendColor(Math.random() * 20 - 10)}`}>{(Math.random() * 20).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;