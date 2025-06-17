import { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import { Plus, Search, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { useToast } from "@/hooks/use-toast";

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

const AdminCategories = () => {
   const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const accessToken = useStore.getState().accessToken;

  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const editNameRef = useRef<HTMLInputElement>(null);
  const editSlugRef = useRef<HTMLInputElement>(null);
  const editDescRef = useRef<HTMLInputElement>(null);
  const { toast  } = useToast();

  // Load danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!accessToken) return;
        const res = await axios.get('http://127.0.0.1:8000/api/categories/', {
          headers: { 'accept': 'application/json', 'Authorization': `Bearer ${accessToken}` }
        });
        setCategories(res.data.results);
       
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, [accessToken]);

  // Thêm danh mục
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/categories/', {
        name: nameRef.current?.value,
        slug: slugRef.current?.value,
        description: descRef.current?.value
      }, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setCategories(prev => [...prev, res.data]);
      setOpenCreate(false);
      toast ({
            title: "Thành công",
            description: `Đã thêm danh mục "${res.data.name}"`,
      })
    } catch (err) {
       toast ({
            title: "Thất bại",
            description: `Lỗi khi thêm danh mục: "${err}"`,
      })
    }
  };

  // Sửa danh mục
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/categories/${editCategory.id}/`, {
        name: editNameRef.current?.value,
        slug: editSlugRef.current?.value,
        description: editDescRef.current?.value
      }, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      setCategories(prev => prev.map(c => c.id === res.data.id ? res.data : c));
      setOpenEdit(false);
      setEditCategory(null);
      toast ({
            title: "Thành công",
            description: `Sữa danh mục "${res.data.name}" thành công`,
      })
    } catch (err) {
      toast ({
            title: "Thất bại",
            description: `Lỗi khi cập nhật danh mục: "${err}"`,
      })
    }
  };

  // Xoá danh mục
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xoá danh mục này không?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setCategories(prev => prev.filter(c => c.id !== id));
      toast ({
            title: "Thành công",
            description: `Xóa danh mục thành công`,
      })
    } catch (err) {
       toast ({
            title: "Thất bại",
            description: `Lỗi khi xoá danh mục: "${err}"`,
      })
    }
  };
  const getProductCount = (categoryId: number) => {
    return 0; // Nếu sau này có API sản phẩm thì sửa lại
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2" onClick={() => setOpenCreate(true)}>
              <Plus className="h-4 w-4" />
              <span>Thêm danh mục</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm danh mục mới</DialogTitle>
              <DialogDescription>Nhập thông tin danh mục mới vào form bên dưới.</DialogDescription>
            </DialogHeader>
           <form className="space-y-4" onSubmit={handleCreateCategory}>
              <Input placeholder="Tên danh mục" ref={nameRef} />
              <Input placeholder="Slug" ref={slugRef} />
              <Input placeholder="Mô tả" ref={descRef} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Huỷ</Button>
                </DialogClose>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>

          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {getProductCount(category.id)} sản phẩm
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Dialog open={openEdit && editCategory?.id === category.id} onOpenChange={v => { setOpenEdit(v); if (!v) setEditCategory(null); }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => { setEditCategory(category); setOpenEdit(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sửa danh mục</DialogTitle>
                        <DialogDescription>Chỉnh sửa thông tin danh mục.</DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={handleUpdateCategory}>
                        <Input defaultValue={editCategory?.name} placeholder="Tên danh mục" ref={editNameRef} />
                        <Input defaultValue={editCategory?.slug} placeholder="Slug" ref={editSlugRef} />
                        <Input defaultValue={editCategory?.description} placeholder="Mô tả" ref={editDescRef} />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Huỷ</Button>
                          </DialogClose>
                          <Button type="submit">Lưu</Button>
                        </DialogFooter>
                      </form>

                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>
                <Badge variant="outline">ID: {category.id}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted flex items-center justify-center rounded font-bold text-white bg-primary">
                        {category.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      /{category.slug}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate" title={category.description}>
                      {category.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getProductCount(category.id)} sản phẩm
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog open={openEdit && editCategory?.id === category.id} onOpenChange={v => { setOpenEdit(v); if (!v) setEditCategory(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => { setEditCategory(category); setOpenEdit(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sửa danh mục</DialogTitle>
                            <DialogDescription>Chỉnh sửa thông tin danh mục.</DialogDescription>
                          </DialogHeader>
                          <form className="space-y-4" onSubmit={handleUpdateCategory}>
                              <Input defaultValue={editCategory?.name} placeholder="Tên danh mục" ref={editNameRef} />
                              <Input defaultValue={editCategory?.slug} placeholder="Slug" ref={editSlugRef} />
                              <Input defaultValue={editCategory?.description} placeholder="Mô tả" ref={editDescRef} />
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Huỷ</Button>
                                </DialogClose>
                                <Button type="submit">Lưu</Button>
                              </DialogFooter>
                            </form>

                        </DialogContent>
                      </Dialog>
                      <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
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

export default AdminCategories;
