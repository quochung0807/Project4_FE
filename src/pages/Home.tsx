import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Eye, Truck, Shield, Headphones, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/data/categories';
import { useStore } from '@/store/useStore';

const Home = () => {
  const { addToCart } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const services = [
    {
      icon: Truck,
      title: "Miễn phí vận chuyển",
      description: "Cho đơn hàng từ 300.000đ"
    },
    {
      icon: Shield,
      title: "Bảo hành chính hãng",
      description: "Bảo hành 12-24 tháng"
    },
    {
      icon: Headphones,
      title: "Hỗ trợ 24/7",
      description: "Tư vấn miễn phí"
    },
    {
      icon: CreditCard,
      title: "Thanh toán an toàn",
      description: "Nhiều phương thức"
    }
  ];

  const accessToken = useStore.getState().accessToken;
  const { categories, loading, error } = useCategories(accessToken);

  // Fetch featured products từ API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const headers = {};
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const res = await fetch("https://electrostore-ofl1.onrender.com/api/products/?is_featured=true&limit=10", { headers });
        const data = await res.json();
        setFeaturedProducts(data.results || data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm nổi bật:", error);
      }
    };

    fetchFeatured();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Banner */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden h-80">
                <CardContent className="p-0 relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 p-8 flex items-center">
                    <div className="text-white max-w-md">
                      <h1 className="text-4xl font-bold mb-4">SALE SỐC CUỐI NĂM</h1>
                      <p className="text-xl mb-2">Giảm giá đến 50%</p>
                      <p className="text-lg mb-6">Cho tất cả sản phẩm điện tử</p>
                      <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8">
                        MUA NGAY
                      </Button>
                    </div>
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
                        alt="Featured Product"
                        className="w-48 h-48 object-cover rounded-2xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Banners */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Smart Watch</h3>
                  <p className="text-sm mb-4">Từ 2.990.000đ</p>
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop"
                    alt="Smart Watch"
                    className="w-20 h-20 mx-auto rounded-full"
                  />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Gaming Gear</h3>
                  <p className="text-sm mb-4">Từ 1.500.000đ</p>
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop"
                    alt="Gaming"
                    className="w-20 h-20 mx-auto rounded-full"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center space-x-3 p-4">
                <service.icon className="h-8 w-8 text-orange-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">{service.title}</h4>
                  <p className="text-xs text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.slug}`} className="group">
                <div className="text-center p-4 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-orange-200 bg-white">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                     <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <Link to="/products" className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
              Xem thêm
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.slice(0, 5).map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 hover:border-orange-200 rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </Badge>
                    )}
                    <Button 
                      size="sm" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 hover:bg-gray-100 w-8 h-8 p-0 shadow-md"
                      asChild
                    >
                      <Link to={`/products/${product.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 5)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      <Link to={`/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-red-500">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-gray-400 line-through text-xs">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="bg-orange-500 hover:bg-orange-600 w-8 h-8 p-0 shadow-sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Đăng ký nhận tin</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và tin tức công nghệ
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 px-6">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;