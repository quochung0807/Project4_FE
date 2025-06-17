import { useEffect, useState } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get('http://https://electrostore-ofl1.onrender.com/api/orders/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setOrders(res.data.results || []);
      } catch (err) {
        setError('Không thể tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Package className="h-4 w-4 text-yellow-500" />;
      case 'delivery':
        return <Truck className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xác nhận';
      case 'delivery':
        return 'Đang giao';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'default';
      case 'delivery':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const searchedOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      ((order.user?.first_name + ' ' + order.user?.last_name).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.patch(
        `http://https://electrostore-ofl1.onrender.com/api/orders/${orderId}/status/`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá đơn hàng này?')) return;
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`http://https://electrostore-ofl1.onrender.com/api/orders/${orderId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setOrders(orders => orders.filter(o => o.id !== orderId));
    } catch (err) {
      alert('Xoá đơn hàng thất bại');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý đơn hàng</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo ID, tên khách hàng hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({searchedOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải đơn hàng...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Đơn hàng</th>
                  <th className="text-left py-3 px-4">Khách hàng</th>
                  <th className="text-left py-3 px-4">Ngày đặt</th>
                  <th className="text-left py-3 px-4">Tổng tiền</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                  <th className="text-left py-3 px-4">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {searchedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.user?.first_name} {order.user?.last_name}</p>
                        <p className="text-sm text-gray-600">{order.user?.email}</p>
                        <p className="text-sm text-gray-600">{order.user?.phone_number}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{formatPrice(order.total_amount)}</p>
                      <p className="text-sm text-gray-600">
                        {order.payment_method === 'cod' ? 'COD' :
                         order.payment_method === 'transfer' ? 'Chuyển khoản' : 'QR Code'}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Dialog open={openEdit && editOrder?.id === order.id} onOpenChange={v => { setOpenEdit(v); if (!v) setEditOrder(null); }}>
                        <DialogTrigger asChild>
                          <Badge variant={getStatusVariant(order.status)} className="cursor-pointer" onClick={() => { setEditOrder(order); setNewStatus(order.status); setOpenEdit(true); }}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                            <DialogDescription>Chọn trạng thái mới cho đơn hàng #{order.id}.</DialogDescription>
                          </DialogHeader>
                          <select
                            className="w-full border rounded px-3 py-2 mb-4"
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                          >
                            <option value="processing">Đang xử lý</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="delivery">Đang giao</option>
                          </select>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Huỷ</Button>
                            </DialogClose>
                            <Button type="button" onClick={() => { handleStatusChange(order.id, newStatus); setOpenEdit(false); }}>Lưu</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                    <td className="py-4 px-4">
                      <Select 
                        value={order.status} 
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Đang xử lý</SelectItem>
                          <SelectItem value="pending">Chờ xác nhận</SelectItem>
                          <SelectItem value="delivery">Đang giao</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td>
                    <Button variant="ghost" size="icon" className="ml-2 text-red-500 hover:bg-red-100" title="Xoá đơn hàng" onClick={() => handleDeleteOrder(order.id)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
