import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useStore } from '@/store/useStore';
import { useToast } from "@/hooks/use-toast";
// Mock users data
const mockUsers = [
  {
    id: 1,
    username: 'nguyen_van_a',
    email: 'nguyenvana@gmail.com',
    first_name: 'Nguyễn',
    last_name: 'Văn A',
    phone_number: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    role: 'customer',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-06-10'
  },
  {
    id: 2,
    username: 'tran_thi_b',
    email: 'tranthib@gmail.com',
    first_name: 'Trần',
    last_name: 'Thị B',
    phone_number: '0987654321',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    role: 'customer',
    status: 'active',
    createdAt: '2024-02-20',
    lastLogin: '2024-06-09'
  },
  {
    id: 3,
    username: 'le_van_c',
    email: 'levanc@gmail.com',
    first_name: 'Lê',
    last_name: 'Văn C',
    phone_number: '0369258147',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'customer',
    status: 'inactive',
    createdAt: '2024-03-10',
    lastLogin: '2024-05-15'
  }
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const { toast } = useToast();
  const accessToken = useStore.getState().accessToken;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://electrostore-ofl1.onrender.com/api/profile/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setUsers(data.results);
      } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      fullName.includes(search);

    const isActiveBoolean = statusFilter === 'active' ? true
      : statusFilter === 'inactive' ? false
        : 'all';

    const matchesStatus = isActiveBoolean === 'all' || user.is_active === isActiveBoolean;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteUser = async (id) => {
    if (!confirm("Chủ nhân có chắc chắn muốn xoá người dùng này không?")) return;

    try {
      const res = await fetch(`https://electrostore-ofl1.onrender.com/api/profile/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // nếu dùng JWT token
        },
      });

      if (!res.ok) {
        toast({
          title: "Thất bại",
          description: `Đã xảy ra lỗi khi xoá người dùng`,
        })
        throw new Error("Xoá không thành công");
      }
      toast({
        title: "Thành công",
        description: `Xóa người dùng thành công`,
      })
      // Cập nhật lại danh sách người dùng sau khi xoá
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      toast({
        title: "Thất bại",
        description: `Đã xảy ra lỗi khi xoá người dùng`,
      })
      console.error("Lỗi khi xoá người dùng:", error);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  // const handleEditUser = async (e) => {
  //   e.preventDefault();
  //   if (!editUser) return;

  //   try {
  //     const res = await fetch(`https://electrostore-ofl1.onrender.com/api/profile/${editUser.id}/`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`, 
  //         body: editUser
  //       }
  //     });

  //     if (!res.ok) {
  //       console.log(res);
  //       throw new Error("Cập nhật thất bại");
  //     }

  //     const updated = await res.json();
  //     setUsers(prev =>
  //       prev.map(u => (u.id === editUser.id ? updated : u))
  //     );
  //     setOpenEdit(false);
  //     setEditUser(null);
  //   } catch (err) {
  //     console.error("Lỗi khi cập nhật người dùng:", err);
  //     alert("Có lỗi xảy ra khi cập nhật người dùng.");
  //   }
  // };


  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      const res = await fetch(`https://electrostore-ofl1.onrender.com/api/profile/${editUser.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(editUser)
      });

      if (!res.ok) {
        console.log(res);
        throw new Error("Cập nhật thất bại");
      }

      const updated = await res.json();
      setUsers(prev =>
        prev.map(u => (u.id === editUser.id ? updated : u))
      );
      setOpenEdit(false);
      setEditUser(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      alert("Có lỗi xảy ra khi cập nhật người dùng.");
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <div className="text-sm text-muted-foreground">
          Tổng: {users.length} người dùng
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hoạt động</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Không hoạt động</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đăng ký tuần này</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đăng nhập hôm nay</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-10 h-10 object-cover rounded-full"
                      />

                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate" title={user.address}>
                      {user.address}
                    </p>
                  </TableCell>
                  <TableCell>{formatDate(user.date_joined)}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>

                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog open={openEdit && editUser?.id === user.id} onOpenChange={v => { setOpenEdit(v); if (!v) setEditUser(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => { setEditUser(user); setOpenEdit(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sửa người dùng</DialogTitle>
                            <DialogDescription>Chỉnh sửa thông tin người dùng.</DialogDescription>
                          </DialogHeader>
                          <form className="space-y-4" onSubmit={handleEditUser}>
                            <Input value={editUser?.first_name || ""} onChange={e => setEditUser({ ...editUser, first_name: e.target.value })} placeholder="Họ" />
                            <Input value={editUser?.last_name || ""} onChange={e => setEditUser({ ...editUser, last_name: e.target.value })} placeholder="Tên" />
                            <Input value={editUser?.email || ""} onChange={e => setEditUser({ ...editUser, email: e.target.value })} placeholder="Email" />
                            <Input value={editUser?.phone_number || ""} onChange={e => setEditUser({ ...editUser, phone_number: e.target.value })} placeholder="Số điện thoại" />
                            <Input value={editUser?.address || ""} onChange={e => setEditUser({ ...editUser, address: e.target.value })} placeholder="Địa chỉ" />
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Huỷ</Button>
                              </DialogClose>
                              <Button type="submit">Lưu</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={() => handleDeleteUser(user.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
