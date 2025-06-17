import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch('http://localhost:8000/api/orders/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!res.ok) throw new Error('Không thể tải đơn hàng');
        const data = await res.json();
        setOrders(data.results || []);
      } catch (err) {
        setOrders([]);
        setError('Không thể tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      case 'processing':
        return 'Đang xử lý';
      default:
        return status;
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lịch sử đơn hàng</h1>
      {loading ? (
        <div className="text-center py-16 text-lg">Đang tải đơn hàng...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Chưa có đơn hàng nào</h2>
          <p className="text-gray-600 mb-8">
            Bạn chưa đặt đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <Button asChild size="lg">
            <Link to="/products">Mua sắm ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Đơn hàng #{order.id}</span>
                      <Badge variant={getStatusVariant(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Đặt ngày: {formatDate(order.created_at || order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(order.total_amount || order.total)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {(order.items || []).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity} • {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(Number(item.product.price) * Number(item.quantity))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Shipping Info */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Địa chỉ giao hàng:</p>
                        <p className="text-gray-600">{order.shipping_address || order.shippingAddress}</p>
                      </div>
                      <div>
                        <p className="font-medium">Phương thức thanh toán:</p>
                        <p className="text-gray-600">
                          {order.payment_method === 'cod' || order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' :
                           order.payment_method === 'transfer' || order.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'QR Code'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  {order.status === 'delivered' && (
                    <div className="border-t pt-4 flex space-x-3">
                      <Button variant="outline" size="sm">
                        Đánh giá sản phẩm
                      </Button>
                      <Button variant="outline" size="sm">
                        Mua lại
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
