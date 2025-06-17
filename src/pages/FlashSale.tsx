
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Flame } from 'lucide-react';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      originalPrice: 39990000,
      salePrice: 29990000,
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      sold: 45,
      total: 100,
      discount: 25
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      originalPrice: 35990000,
      salePrice: 27990000,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      sold: 78,
      total: 150,
      discount: 22
    },
    {
      id: 3,
      name: "MacBook Air M3",
      originalPrice: 34990000,
      salePrice: 28990000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      sold: 23,
      total: 50,
      discount: 17
    },
    {
      id: 4,
      name: "AirPods Pro 2",
      originalPrice: 6990000,
      salePrice: 4990000,
      image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400",
      sold: 156,
      total: 200,
      discount: 29
    },
    {
      id: 5,
      name: "iPad Pro 12.9",
      originalPrice: 28990000,
      salePrice: 23990000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      sold: 34,
      total: 80,
      discount: 17
    },
    {
      id: 6,
      name: "Apple Watch Series 9",
      originalPrice: 12990000,
      salePrice: 9990000,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
      sold: 67,
      total: 120,
      discount: 23
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Zap className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-red-500">FLASH SALE</h1>
          <Flame className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-gray-600 text-lg">
          Ưu đãi có thời hạn - Số lượng có hạn - Đừng bỏ lỡ!
        </p>
      </div>

      {/* Countdown Timer */}
      <Card className="mb-8 bg-gradient-to-r from-red-500 to-orange-500">
        <CardContent className="p-6">
          <div className="text-center text-white">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Kết thúc sau:</h2>
            </div>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-4xl font-bold bg-white text-red-500 rounded-lg px-4 py-2 min-w-[80px]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <p className="text-sm mt-1">Giờ</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-white text-red-500 rounded-lg px-4 py-2 min-w-[80px]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <p className="text-sm mt-1">Phút</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-white text-red-500 rounded-lg px-4 py-2 min-w-[80px]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <p className="text-sm mt-1">Giây</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashSaleProducts.map((product) => {
          const soldPercentage = (product.sold / product.total) * 100;
          
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-red-500">
                  -{product.discount}%
                </Badge>
                {soldPercentage > 80 && (
                  <Badge className="absolute top-3 right-3 bg-orange-500">
                    <Flame className="h-3 w-3 mr-1" />
                    Hot
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-red-500">
                      {formatPrice(product.salePrice)}
                    </span>
                  </div>
                  <span className="text-gray-500 line-through text-sm">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Đã bán: {product.sold}/{product.total}</span>
                    <span>{soldPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={soldPercentage} className="h-2" />
                </div>

                <Button 
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={product.sold >= product.total}
                >
                  {product.sold >= product.total ? 'Hết hàng' : 'Mua ngay'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Flash Sale Rules */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Điều kiện Flash Sale:</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Mỗi khách hàng chỉ được mua tối đa 2 sản phẩm cùng loại</li>
            <li>• Giá Flash Sale chỉ áp dụng trong thời gian khuyến mãi</li>
            <li>• Sản phẩm Flash Sale không được áp dụng cùng với các chương trình khuyến mãi khác</li>
            <li>• Số lượng có hạn, áp dụng theo nguyên tắc "Ai nhanh tay hơn"</li>
            <li>• Đơn hàng Flash Sale không được hủy sau khi đặt hàng thành công</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashSale;
