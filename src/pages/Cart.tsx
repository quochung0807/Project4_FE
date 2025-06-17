import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useStore();
  const accessToken = useStore(state => state.accessToken);
  const [isSyncing, setIsSyncing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleProceedToCheckout = async () => {
    setIsSyncing(true);
    try {
      for (const item of cart) {
        const res = await fetch('http://https://electrostore-ofl1.onrender.com/api/cart/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            product_id: item.product.id,
            quantity: item.quantity
          })
        });
        if (!res.ok) {
          const errData = await res.json();
          alert('Lỗi lưu cart: ' + (errData.detail || JSON.stringify(errData)));
          setIsSyncing(false);
          return;
        }
      }
      window.location.href = '/checkout';
    } catch (err) {
      alert('Lưu giỏ hàng thất bại!');
    } finally {
      setIsSyncing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-8">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <Button asChild size="lg">
            <Link to="/products">
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{item.product.brand}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(item.product.price)}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-gray-500 line-through text-sm">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 border-x min-w-[60px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(cartTotal())}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>VAT (10%):</span>
                  <span>{formatPrice(cartTotal() * 0.1)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatPrice(cartTotal() * 1.1)}</span>
                </div>
              </div>

              <button
                className="w-full mt-6 btn-lazada text-lg font-semibold h-12 rounded-lg"
                onClick={handleProceedToCheckout}
                disabled={isSyncing}
              >
                {isSyncing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
              </button>

              <Button asChild variant="outline" className="w-full mt-3">
                <Link to="/products">
                  Tiếp tục mua sắm
                </Link>
              </Button>

              {/* Promotions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">🎉 Ưu đãi đặc biệt</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Miễn phí vận chuyển cho đơn hàng từ 500k</li>
                  <li>• Tặng voucher 100k cho lần mua tiếp theo</li>
                  <li>• Bảo hành mở rộng 6 tháng</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
