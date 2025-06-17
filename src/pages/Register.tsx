import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    address: '',
    phone_number: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi xác nhận mật khẩu",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast({
        title: "Đăng ký thành công!",
        description: "Tài khoản của bạn đã được tạo và đăng nhập",
      });
      navigate('/');
    } catch (error: any) {
      if (error?.response?.status === 201) {
        toast({
          title: "Đăng ký thành công!",
          description: "Tài khoản của bạn đã được tạo và đăng nhập",
        });
        navigate('/');
      } else {
        toast({
          title: "Lỗi đăng ký",
          description: error.response?.data?.detail || "Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 rounded bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">ElectroStore</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
            <CardDescription className="text-center">
              Tạo tài khoản mới để bắt đầu mua sắm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Họ</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Nhập họ"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Tên</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Nhập tên"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Số điện thoại</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" required />
                <span className="text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Điều khoản dịch vụ
                  </Link>{' '}
                  và{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Chính sách bảo mật
                  </Link>
                </span>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
