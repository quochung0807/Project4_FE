import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useStore } from '@/store/useStore';
import { Order } from '@/types';
import QRPayment from '@/components/payment/QRPayment';
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const Checkout = () => {
  const { cart, user, isAuthenticated, clearCart, addOrder } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.first_name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    address: '',
    ward: '',
    district: '',
    city: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [showQRPayment, setShowQRPayment] = useState(false);
  const accessToken = useStore(state => state.accessToken);

  const orderSummary = {
    subtotal: cart.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    shippingFee: 30000,
    tax: 0.1,
    discount: 0,
    get total() {
      return this.subtotal * (1 + this.tax) + this.shippingFee - this.discount;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    if (value === 'qr') {
      setShowQRPayment(true);
    } else {
      setShowQRPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đặt hàng");
      return;
    }
    if (cart.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Lưu order
      const res = await fetch('http://https://electrostore-ofl1.onrender.com/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          shipping_address: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`
        })
      });
      
      if (!res.ok) {
        throw new Error('Đặt hàng thất bại');
      }

      // 2. Lấy order mới nhất
      const ordersRes = await fetch('http://https://electrostore-ofl1.onrender.com/api/orders/me/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const ordersData = await ordersRes.json();
      const latestOrder = ordersData.results ? ordersData.results[0] : ordersData[0];

      // 3. Xác nhận thanh toán
      if (latestOrder && latestOrder.id) {
        await fetch(`http://https://electrostore-ofl1.onrender.com/api/orders/${latestOrder.id}/confirm_payment/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }

      clearCart();
      toast.success("Đặt hàng thành công!");
      window.location.href = '/orders';
    } catch (err) {
      toast.error("Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Giao Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Input
                    type="text"
                    id="ward"
                    name="ward"
                    value={shippingInfo.ward}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Input
                    type="text"
                    id="district"
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">Tỉnh/Thành phố</Label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương Thức Thanh Toán</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={handlePaymentMethodChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="r1" />
                  <Label htmlFor="r1">Thanh toán khi nhận hàng (COD)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="r2" />
                  <Label htmlFor="r2">Chuyển khoản ngân hàng</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qr" id="r3" />
                  <Label htmlFor="r3">Thanh toán bằng QR Code</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* QR Payment */}
          {showQRPayment && (
            <QRPayment 
              amount={orderSummary.total} 
              orderInfo={`DH-${Date.now()}`}
            />
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t py-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền hàng:</span>
                  <span className="font-medium">{formatPrice(orderSummary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">{formatPrice(orderSummary.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thuế (10%):</span>
                  <span className="font-medium">{formatPrice(orderSummary.subtotal * orderSummary.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-medium">{formatPrice(orderSummary.discount)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Tổng cộng:</span>
                <span>{formatPrice(orderSummary.total)}</span>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  paymentMethod === 'qr' ? 'Xác nhận đã thanh toán' : 'Đặt Hàng'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
