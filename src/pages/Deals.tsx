
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Percent, Clock, Zap } from 'lucide-react';

const Deals = () => {
  const [activeTab, setActiveTab] = useState('all');

  const deals = [
    {
      id: 1,
      title: "Flash Sale Điện Thoại",
      description: "Giảm giá đến 50% cho tất cả điện thoại iPhone và Samsung",
      discount: "50%",
      endTime: "2024-06-15T23:59:59Z",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      type: "flash"
    },
    {
      id: 2,
      title: "Tuần lễ Laptop",
      description: "Mua laptop tặng chuột và bàn phím wireless",
      discount: "Bundle",
      endTime: "2024-06-20T23:59:59Z",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
      type: "weekly"
    },
    {
      id: 3,
      title: "Tai nghe Premium",
      description: "Giảm 30% cho tất cả tai nghe cao cấp",
      discount: "30%",
      endTime: "2024-06-18T23:59:59Z",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      type: "category"
    }
  ];

  const getTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Đã hết hạn";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days} ngày ${hours} giờ`;
  };

  const filteredDeals = activeTab === 'all' ? deals : deals.filter(deal => deal.type === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Khuyến Mãi Đặc Biệt</h1>
        <p className="text-gray-600 text-lg">Đừng bỏ lỡ những ưu đãi hấp dẫn từ Elecxo</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('all')}
            className="rounded-md"
          >
            Tất cả
          </Button>
          <Button
            variant={activeTab === 'flash' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('flash')}
            className="rounded-md"
          >
            <Zap className="h-4 w-4 mr-1" />
            Flash Sale
          </Button>
          <Button
            variant={activeTab === 'weekly' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('weekly')}
            className="rounded-md"
          >
            Tuần lễ
          </Button>
          <Button
            variant={activeTab === 'category' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('category')}
            className="rounded-md"
          >
            Theo danh mục
          </Button>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal) => (
          <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-red-500">
                <Percent className="h-3 w-3 mr-1" />
                {deal.discount}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{deal.title}</span>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {getTimeLeft(deal.endTime)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{deal.description}</p>
              <Button className="w-full">Xem chi tiết</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Deals;
