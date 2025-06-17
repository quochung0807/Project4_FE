import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Filter, Grid, List, Star, ShoppingCart, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { fetchProducts } from '@/data/products'; // Import hàm fetchProducts mới
import { useCategories } from '@/data/categories';
import { useStore } from '@/store/useStore';
import { Product } from '@/types'; // Đảm bảo type Product khớp với API response

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // State mới cho sản phẩm từ API và trạng thái tải
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]); // Giá trị khởi tạo
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || ''); // Khởi tạo từ URL

  const { addToCart } = useStore();
  const accessToken = useStore((state) => state.accessToken);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(accessToken);

  // Lấy danh sách thương hiệu duy nhất từ sản phẩm đã tải
  const brands = Array.from(new Set(products.map(p => p.brand)));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hàm debounce cho tìm kiếm để tránh gọi API quá nhiều
  const debouncedSetSearchQuery = useCallback((value: string) => {
    const timer = setTimeout(() => {
      setSearchQuery(value);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, []);

  const [productRatings, setProductRatings] = useState<{[key: number]: {avgRating: number, reviewCount: number}}>({});

  // Thêm useEffect để lấy tất cả reviews
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await fetch('http://https://electrostore-ofl1.onrender.com/api/reviews/product/');
        if (!res.ok) return;
        const data = await res.json();
        // Convert array to object: { [product_id]: { avgRating, reviewCount } }
        const ratingsObj: { [key: number]: { avgRating: number, reviewCount: number } } = {};
        data.forEach((item: any) => {
          ratingsObj[item.product_id] = {
            avgRating: item.avg_rating,
            reviewCount: item.review_count
          };
        });
        setProductRatings(ratingsObj);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchAllReviews();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);

      try {
        const data = await fetchProducts(accessToken);
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setProductsError(err.message);
        } else {
          setProductsError("Đã xảy ra lỗi khi tải sản phẩm.");
        }
      } finally {
        setProductsLoading(false);
      }
    };

    // Khi categories được tải, kiểm tra lại searchParams và cập nhật state nếu cần
    // Điều này đảm bảo rằng category filter từ URL được áp dụng đúng
    if (!categoriesLoading && categories) {
      const categoryParam = searchParams.get('category');
      if (categoryParam && !selectedCategories.includes(categoryParam)) {
        setSelectedCategories([categoryParam]);
      }
    }

    getProducts();
  }, [
    accessToken,
    searchParams,
    searchQuery,
    selectedBrands,
    selectedCategories,
    priceRange,
    sortBy,
    categories, // Thêm categories vào dependency array để re-run khi categories loaded
    categoriesLoading // Thêm categoriesLoading để re-run khi trạng thái tải categories thay đổi
  ]);

  // Thêm useEffect mới để xử lý filtering
  useEffect(() => {
    let result = [...products];

    // Lọc theo tìm kiếm
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category.slug)
      );
    }

    // Lọc theo thương hiệu
    if (selectedBrands.length > 0) {
      result = result.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Lọc theo khoảng giá
    result = result.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sắp xếp
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'featured':
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands(prev =>
      checked ? [...prev, brand] : prev.filter(b => b !== brand)
    );
  };

  const handleCategoryChange = (slug: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, slug] : prev.filter(s => s !== slug)
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 100000000]);
    setSearchQuery('');
    setSearchParams({}); // Xóa tất cả search params trên URL
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Card className="sticky top-20 animate-slide-in-up">
            <CardContent className="p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>Xóa tất cả</Button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => debouncedSetSearchQuery(e.target.value)} // Sử dụng debounced
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Danh mục</label>
                <div className="space-y-2">
                  {categoriesLoading && <p>Đang tải danh mục...</p>}
                  {categoriesError && <p className="text-red-500">{categoriesError}</p>}
                  {!categoriesLoading && categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.slug, checked as boolean)
                        }
                      />
                      <label htmlFor={category.slug} className="text-sm cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Thương hiệu</label>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) =>
                          handleBrandChange(brand, checked as boolean)
                        }
                      />
                      <label htmlFor={brand} className="text-sm cursor-pointer">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Khoảng giá</label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange as (value: number[]) => void} 
                    max={100000000}
                    min={0}
                    step={1000000}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 animate-slide-in-up">
            <div>
              <h1 className="text-2xl font-bold mb-2">Sản phẩm</h1>
              <div className="text-gray-600">Tìm thấy {filteredProducts.length} sản phẩm</div>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {productsLoading ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-gray-500 text-lg">Đang tải sản phẩm...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-red-500 text-lg mb-4">{productsError}</p>
              <Button onClick={clearFilters}>Thử lại</Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
              <Button onClick={clearFilters}>Xóa bộ lọc</Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 h-full product-card hover-lift"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fade-in 0.6s ease-out forwards'
                  }}
                >
                  <CardContent className={viewMode === 'grid' ? 'p-0 h-full flex flex-col' : 'p-0'}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {product.is_featured && ( 
                            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white flash-animation">
                              HOT
                            </Badge>
                          )}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <Button size="sm" variant="secondary" asChild className="hover:scale-110 transition-transform">
                              <Link to={`/products/${product.slug}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(productRatings[product.id]?.avgRating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
                              ({productRatings[product.id]?.reviewCount || 0})
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                            <Link to={`/products/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                            {product.description}
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                            <span className="text-xl font-bold text-orange-600">
                              {formatPrice(parseFloat(product.price))} 
                            </span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Mua ngay
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex p-4">
                        <div className="w-32 h-32 flex-shrink-0 mr-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2 hover:text-orange-600 transition-colors">
                                <Link to={`/products/${product.slug}`}>
                                  {product.name}
                                </Link>
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center mb-3">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(productRatings[product.id]?.avgRating || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({productRatings[product.id]?.reviewCount || 0})
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex flex-col justify-between">
                              <span className="text-xl font-bold text-orange-600">
                                {formatPrice(parseFloat(product.price))}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(product)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Mua ngay
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;