import { useState, useEffect } from 'react';
import { User, Package, Heart, Settings, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Profile = () => {
  const { isAuthenticated } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile('');
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch('http://https://electrostore-ofl1.onrender.com/api/profile/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!res.ok) throw new Error('Không thể tải thông tin cá nhân');
        const data = await res.json();
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          address: data.address || ''
        });
      } catch (err) {
        setErrorProfile('Không thể tải thông tin cá nhân');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setErrorOrders('');
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch('http://https://electrostore-ofl1.onrender.com/api/orders/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!res.ok) throw new Error('Không thể tải đơn hàng');
        const data = await res.json();
        setOrders((data.results || []).slice(0, 3));
      } catch (err) {
        setOrders([]);
        setErrorOrders('Không thể tải đơn hàng');
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
        <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem thông tin cá nhân</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch('http://https://electrostore-ofl1.onrender.com/api/profile/me/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address
        })
      });
      if (!res.ok) throw new Error('Không thể cập nhật thông tin');
      const data = await res.json();
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        address: data.address || ''
      });
      setIsEditing(false);
      toast({
        title: 'Cập nhật thành công!',
        description: 'Thông tin cá nhân đã được cập nhật',
      });
    } catch (err) {
      toast({
        title: 'Cập nhật thất bại!',
        description: 'Không thể cập nhật thông tin cá nhân',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch('http://https://electrostore-ofl1.onrender.com/api/profile/me/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.old_password || err.new_password || err.detail || 'Đổi mật khẩu thất bại');
      }
      toast({
        title: 'Đổi mật khẩu thành công!',
        description: 'Bạn đã đổi mật khẩu thành công.',
      });
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast({
        title: 'Đổi mật khẩu thất bại!',
        description: err.message || 'Không thể đổi mật khẩu',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Thông tin</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Đơn hàng</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Yêu thích</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Cài đặt</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Thông tin cá nhân</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <>
                  {loadingProfile ? (
                    <div className="text-center py-8">Đang tải thông tin cá nhân...</div>
                  ) : errorProfile ? (
                    <div className="text-center py-8 text-red-500">{errorProfile}</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">Họ</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Tên</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Số điện thoại</Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </>
                  )}
                </>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lịch sử đơn hàng</CardTitle>
                <Button asChild variant="outline">
                  <Link to="/orders">Xem tất cả</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="text-center py-12">Đang tải đơn hàng...</div>
                ) : errorOrders ? (
                  <div className="text-center py-12 text-red-500">{errorOrders}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                    <Button asChild>
                      <Link to="/products">Tiếp tục mua sắm</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Đơn hàng #{order.id}</h4>
                            <p className="text-sm text-gray-600">{formatDate(order.created_at || order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusVariant(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{getStatusText(order.status)}</span>
                            </Badge>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                              {formatPrice(order.total_amount || order.total)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {(order.items || []).slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.product.name}</p>
                                <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                          {order.items && order.items.length > 2 && (
                            <p className="text-sm text-gray-500">
                              và {order.items.length - 2} sản phẩm khác...
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách yêu thích</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Danh sách yêu thích trống</p>
                  <Button>Khám phá sản phẩm</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt tài khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Thông báo</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked />
                      <span>Nhận thông báo về đơn hàng</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked />
                      <span>Nhận email khuyến mãi</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" />
                      <span>Nhận tin tức sản phẩm mới</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Bảo mật</h3>
                  <Button variant="outline" onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</Button>
                </div>
              </CardContent>
            </Card>
            <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Đổi mật khẩu</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="old_password">Mật khẩu cũ</Label>
                    <Input
                      id="old_password"
                      type="password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new_password">Mật khẩu mới</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={() => setShowChangePassword(false)} disabled={isChangingPassword}>Hủy</Button>
                  <Button onClick={handleChangePassword} disabled={isChangingPassword || !oldPassword || !newPassword}>
                    {isChangingPassword ? 'Đang đổi...' : 'Lưu'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
