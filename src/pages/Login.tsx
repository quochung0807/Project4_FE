import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAdmin } = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn quay lại ElectroStore",
      });

      if (isAdmin()) {
        navigate('/admin');
      } else {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from);
      }
    } catch (error: any) {
      toast({
        title: "Lỗi đăng nhập",
        description: error.response?.data?.detail || "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      });
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
            <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
