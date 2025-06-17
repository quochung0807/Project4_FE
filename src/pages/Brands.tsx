
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Brands = () => {
  const brands = [
    {
      id: 1,
      name: "Apple",
      logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200",
      productCount: 156,
      description: "Thiết bị công nghệ cao cấp từ Apple"
    },
    {
      id: 2,
      name: "Samsung",
      logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200",
      productCount: 203,
      description: "Điện tử gia dụng và di động Samsung"
    },
    {
      id: 3,
      name: "Sony",
      logo: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200",
      productCount: 98,
      description: "Âm thanh và hình ảnh chất lượng cao"
    },
    {
      id: 4,
      name: "LG",
      logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200",
      productCount: 145,
      description: "Thiết bị gia dụng thông minh"
    },
    {
      id: 5,
      name: "Xiaomi",
      logo: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200",
      productCount: 87,
      description: "Công nghệ thông minh với giá cả hợp lý"
    },
    {
      id: 6,
      name: "Dell",
      logo: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200",
      productCount: 76,
      description: "Máy tính và laptop chuyên nghiệp"
    },
    {
      id: 7,
      name: "HP",
      logo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200",
      productCount: 92,
      description: "Giải pháp máy tính và in ấn"
    },
    {
      id: 8,
      name: "Asus",
      logo: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200",
      productCount: 64,
      description: "Gaming và máy tính hiệu năng cao"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Thương Hiệu Nổi Bật</h1>
        <p className="text-gray-600 text-lg">
          Khám phá các thương hiệu hàng đầu trong lĩnh vực công nghệ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Card 
            key={brand.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-20 h-20 object-contain mx-auto rounded-lg group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{brand.description}</p>
              <Badge variant="secondary">
                {brand.productCount} sản phẩm
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Thương Hiệu Được Yêu Thích Nhất</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <img
                  src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100"
                  alt="Apple"
                  className="w-24 h-24 object-contain"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Apple</h3>
                  <p className="text-gray-600 mb-4">
                    Thương hiệu công nghệ hàng đầu thế giới với các sản phẩm 
                    iPhone, iPad, MacBook và nhiều thiết bị khác.
                  </p>
                  <Badge className="bg-blue-500">Thương hiệu #1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100"
                  alt="Samsung"
                  className="w-20 h-20 object-contain mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2">Samsung</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Đối thủ đáng gờm với Apple trong lĩnh vực smartphone và TV.
                </p>
                <Badge variant="outline">Thương hiệu #2</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Brands;
