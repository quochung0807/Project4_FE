import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, RefreshCw, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { Product } from '@/types';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [displayStock, setDisplayStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const { addToCart } = useStore();
  const accessToken = useStore((state) => state.accessToken);

  useEffect(() => {
    const fetchProduct = async () => {
    setIsLoading(true);
      try {
        const response = await fetch(`http://https://electrostore-ofl1.onrender.com/api/products/slug/${slug}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Không thể tải thông tin sản phẩm');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        setProduct(null);
      } finally {
      setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, accessToken]);

  useEffect(() => {
    if (product) {
      setDisplayStock(product.stock - 1); // Khi quantity = 1, stock hiển thị là stock - 1
      setQuantity(1);
      // Fetch reviews khi có product.id
      const fetchReviews = async () => {
        setIsLoadingReviews(true);
        try {
          const res = await fetch(`http://https://electrostore-ofl1.onrender.com/api/reviews/product/${product.id}/`);
          if (!res.ok) throw new Error('Không thể tải đánh giá');
          const data = await res.json();
          // Map lại key cho đúng FE (created_at -> createdAt)
          const reviews = (data.reviews || []).map(r => ({
            ...r,
            createdAt: r.created_at,
          }));
          setProductReviews(reviews);
          setAvgRating(data.avg_rating || 0);
          setReviewCount(data.review_count || 0);
        } catch (err) {
          setProductReviews([]);
          setAvgRating(0);
          setReviewCount(0);
        } finally {
          setIsLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [product]);

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
      setDisplayStock(displayStock - 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setDisplayStock(displayStock + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h1>
          <Button asChild className="btn-lazada">
            <Link to="/products">Quay lại danh sách sản phẩm</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6 animate-slide-in-up">
        <Button variant="ghost" asChild className="mb-4 hover:bg-orange-50 transition-colors">
          <Link to="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="hover:bg-orange-100 transition-colors">
                {product.brand}
              </Badge>
              {product.is_featured && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white flash-animation">
                  Nổi bật
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4 gradient-text">{product.name}</h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 transition-all duration-200 hover:scale-110 ${
                      i < Math.round(avgRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{avgRating}</span>
              <span className="text-gray-500">({reviewCount} đánh giá)</span>
            </div>

            <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-4xl font-bold text-orange-600 price-current">
                  {formatPrice(parseFloat(product.price))}
                </span>
              </div>
              <p className="text-gray-600">Đã bao gồm VAT • Miễn phí vận chuyển</p>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Số lượng:</label>
                <div className="flex items-center border-2 border-orange-200 rounded-lg overflow-hidden">
                  <button
                    onClick={handleDecrease}
                    className="px-4 py-3 hover:bg-orange-50 transition-colors border-r border-orange-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="px-4 py-3 hover:bg-orange-50 transition-colors border-l border-orange-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-gray-600">
                  (Còn {displayStock} sản phẩm)
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 btn-lazada h-14 text-lg font-semibold"
                  size="lg"
                >
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  Thêm vào giỏ hàng
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-6 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                >
                  <Heart className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300 hover-lift">
                <Truck className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">Miễn phí vận chuyển</p>
                  <p className="text-sm text-gray-600">Đơn hàng từ 500k</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 hover:shadow-md transition-all duration-300 hover-lift">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">Bảo hành chính hãng</p>
                  <p className="text-sm text-gray-600">12 tháng</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 hover:shadow-md transition-all duration-300 hover-lift">
                <RefreshCw className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="font-medium">Đổi trả dễ dàng</p>
                  <p className="text-sm text-gray-600">Trong 7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-orange-50">
            <TabsTrigger value="description" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Mô tả chi tiết
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Đánh giá ({reviewCount})
            </TabsTrigger>
            <TabsTrigger value="write-review" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Viết đánh giá
            </TabsTrigger>
          </TabsList>
            
          <TabsContent value="description" className="mt-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            
          <TabsContent value="reviews" className="mt-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {isLoadingReviews ? (
                  <div className="text-center py-8">Đang tải đánh giá...</div>
                ) : (
                  <ReviewList reviews={productReviews} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="write-review" className="mt-6">
            <ReviewForm product={product} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;