
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-gray-600 text-lg">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Gửi Tin Nhắn</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ và tên</label>
                  <Input placeholder="Nhập họ và tên" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="Nhập email" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <Input placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Chủ đề</label>
                <Input placeholder="Nhập chủ đề" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tin nhắn</label>
                <Textarea 
                  placeholder="Nhập nội dung tin nhắn..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Gửi tin nhắn
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Liên Hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium">Địa chỉ</h4>
                  <p className="text-gray-600">
                    123 Đường Công Nghệ, Quận 1, TP.HCM
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium">Điện thoại</h4>
                  <p className="text-gray-600">
                    Hotline: 1900 1234<br />
                    Di động: 0123 456 789
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600">
                    info@elecxo.com<br />
                    support@elecxo.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium">Giờ làm việc</h4>
                  <p className="text-gray-600">
                    Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                    Thứ 7 - CN: 9:00 - 17:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Bản Đồ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Bản đồ Google Maps sẽ được hiển thị ở đây</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Câu Hỏi Thường Gặp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Làm thế nào để đặt hàng?</h3>
              <p className="text-gray-600 text-sm">
                Bạn có thể đặt hàng trực tuyến qua website hoặc gọi hotline 1900 1234.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Chính sách bảo hành như thế nào?</h3>
              <p className="text-gray-600 text-sm">
                Tất cả sản phẩm đều có bảo hành chính hãng từ 12-24 tháng.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Có giao hàng toàn quốc không?</h3>
              <p className="text-gray-600 text-sm">
                Có, chúng tôi giao hàng toàn quốc với phí ship hợp lý.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Có thể đổi trả hàng không?</h3>
              <p className="text-gray-600 text-sm">
                Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày với điều kiện hàng còn nguyên vẹn.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
