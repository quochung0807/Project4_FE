import { useEffect, useState, useRef } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Upload, Download, UploadCloud } from 'lucide-react';
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
import { useCategories } from '@/data/categories';
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
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { useStore } from '@/store/useStore';

const AdminProducts = () => {
  // States cho danh sách sản phẩm
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // States cho form tạo mới
  const [createName, setCreateName] = useState('');
  const [createBrand, setCreateBrand] = useState('');
  const [createPrice, setCreatePrice] = useState('');
  const [createStock, setCreateStock] = useState('');
  const [createCategoryId, setCreateCategoryId] = useState('');
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createImageUrl, setCreateImageUrl] = useState('');
  const [dragImageActive, setDragImageActive] = useState(false);

  // States cho form chỉnh sửa
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [dragEditImageActive, setDragEditImageActive] = useState(false);

  // States cho dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  // States cho import Excel
  const [importStep, setImportStep] = useState(1);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalProducts, setTotalProducts] = useState(0);

  const { toast } = useToast();
  const accessToken = useStore.getState().accessToken;
  const { categories, loading: loadingCategories, error } = useCategories(accessToken);

  // Fetch danh sách sản phẩm (có phân trang)
  const fetchProducts = async (page = null, pageSizeParam = null) => {
    let url = 'http://127.0.0.1:8000/api/products/';
    if (page && pageSizeParam) {
      url += `?page=${page}&page_size=${pageSizeParam}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Lỗi khi lấy sản phẩm");
      const data = await response.json();
      if (Array.isArray(data.results)) {
        setProducts(data.results);
        setTotalProducts(data.count || data.results.length);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalProducts(data.count || data.data.length);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalProducts(data.count || data.products.length);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalProducts(data.length);
      } else {
        throw new Error("Dữ liệu trả về không đúng định dạng mảng.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API sản phẩm:", error);
    }
  };

  useEffect(() => {
    // Nếu currentPage = 1 và tổng số sản phẩm chưa biết, gọi lấy hết (không truyền params)
    if (currentPage === 1 && totalProducts === 0) {
      fetchProducts();
    } else {
      fetchProducts(currentPage, pageSize);
    }
    // eslint-disable-next-line
  }, [currentPage]);

  // Cập nhật editProduct => fill dữ liệu
  useEffect(() => {
    if (editProduct) {
      setEditName(editProduct.name || '');
      setEditPrice(editProduct.price?.toString() || '');
      setEditBrand(editProduct.brand || '');
      setEditStock(editProduct.stock?.toString() || '');
      setEditCategoryId(editProduct.category?.id?.toString() || '');
    }
  }, [editProduct]);

  // Hàm tiện ích
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không xác định';
  };

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  // Xử lý tạo sản phẩm
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createName || !createPrice || !createCategoryId) {
      toast({ title: "❌ Lỗi", description: "Vui lòng nhập đầy đủ thông tin bắt buộc." });
      return;
    }

    const formData = new FormData();
    formData.append("name", createName);
    formData.append("slug", generateSlug(createName));
    formData.append("brand", createBrand);
    formData.append("description", "Mặc định");
    formData.append("price", createPrice);
    formData.append("stock", createStock.toString());
    formData.append("is_visible", "true");
    formData.append("is_featured", "false");
    formData.append("category_id", createCategoryId);
    if (createImage) {
      formData.append("image", createImage);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "❌ Thất bại",
          description: `Có lỗi khi tạo sản phẩm!`,
        });
        return;
      }

      toast({
        title: "✅ Thành công",
        description: `Tạo sản phẩm thành công!`,
      });

      // Reset form
      setCreateName('');
      setCreatePrice('');
      setCreateBrand('');
      setCreateStock("0");
      setCreateCategoryId('');
      setCreateImage(null);
      setCreateImageUrl('');
      setOpenCreate(false);

      // Refresh danh sách
      await fetchProducts();

    } catch (error) {
      toast({
        title: "❌ Thất bại",
        description: `Đã xảy ra lỗi trong quá trình gửi dữ liệu.`,
      });
    }
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProduct) return;

    const formData = new FormData();

    formData.append("name", editName);
    formData.append("brand", editBrand);
    formData.append("price", parseFloat(editPrice).toFixed(2));
    formData.append("stock", editStock);
    formData.append("description", "Mặc định");
    formData.append("category_id", editCategoryId);
    formData.append("slug", generateSlug(editName));
    formData.append("is_visible", "true");
    formData.append("is_featured", String(editProduct.is_featured || false));

    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${editProduct.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: "❌ Cập nhật thất bại", description: JSON.stringify(data) });
        return;
      }

      toast({ title: "✅ Thành công", description: "Đã cập nhật sản phẩm." });
      await fetchProducts();

      setOpenEdit(false);
      setEditProduct(null);
      setEditImage(null);
      setEditImageUrl('');
      setDragEditImageActive(false);

    } catch (error) {
      toast({ title: "❌ Lỗi hệ thống", description: "Không thể cập nhật sản phẩm." });
    }
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        fetchProducts();
        toast({
          title: "✅ Thành công",
          description: `Đã xoá sản phẩm thành công.`,
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "❌ Thất bại",
          description: `Lỗi khi xoá sản phẩm`,
        });
      }
    } catch (err) {
      toast({
        title: "❌ Thất bại",
        description: `Lỗi kết nối khi xoá sản phẩm`,
      });
    }
  };

  // Xử lý import Excel
  const handleExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result) return;

      const data = new Uint8Array(result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setImportPreview(jsonData.slice(0, 100));
    };
    reader.readAsArrayBuffer(file);
  };

  // Kiểm tra giá trị có phải là URL ảnh hoặc base64 không
  const isImage = (value) => {
    if (typeof value !== 'string') return false;
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(value)) return true;
    if (/^data:image\/(png|jpg|jpeg|gif|webp|bmp);base64,/.test(value)) return true;
    return false;
  };

  // Thêm hàm xử lý import sản phẩm từ Excel
  const handleImportProducts = async () => {
    if (!importPreview.length) return;
    const header = importPreview[0];
    const rows = importPreview.slice(1);
    let success = 0;
    let fail = 0;

    // Tìm map category name/slug sang id
    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.name?.toLowerCase()] = cat.id;
      catMap[cat.slug?.toLowerCase()] = cat.id;
    });

    for (const row of rows) {
      // [Tên, Giá, Brand, Tồn kho, Danh mục, Slug danh mục, Link ảnh]
      const [name, price, brand, stock, categoryName, categorySlug, imageUrl] = row;
      if (!name || !price) continue;
      let categoryId = '';
      if (categorySlug && catMap[categorySlug.toLowerCase()]) categoryId = catMap[categorySlug.toLowerCase()];
      else if (categoryName && catMap[categoryName.toLowerCase()]) categoryId = catMap[categoryName.toLowerCase()];
      if (!categoryId) continue;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', generateSlug(name));
      formData.append('brand', brand || '');
      formData.append('description', 'Import từ Excel');
      formData.append('price', price);
      formData.append('stock', stock || '0');
      formData.append('is_visible', 'true');
      formData.append('is_featured', 'false');
      formData.append('category_id', categoryId);

      // Xử lý ảnh từ link
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        try {
          const imgRes = await fetch(imageUrl);
          const imgBlob = await imgRes.blob();
          const ext = imgBlob.type.split('/')[1] || 'jpg';
          const file = new File([imgBlob], `image.${ext}`, { type: imgBlob.type });
          formData.append('image', file);
        } catch (err) {
          // Nếu lỗi ảnh thì bỏ qua ảnh
        }
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/api/products/', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        });
        if (res.ok) success++; else fail++;
      } catch (err) {
        fail++;
      }
    }
    toast({ title: 'Import hoàn tất', description: `Thành công: ${success}, Thất bại: ${fail}` });
    setImportStep(3);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex space-x-2">
          {/* Import Excel */}
          <Dialog open={openImport} onOpenChange={setOpenImport}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2" onClick={() => { setImportStep(1); setImportFile(null); setImportPreview([]); }}>
                <Upload className="h-4 w-4" />
                <span>Import Excel</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl">Import sản phẩm từ Excel</DialogTitle>
                <DialogDescription>
                  {importStep === 1 && 'Kéo thả hoặc chọn file Excel để import sản phẩm.'}
                  {importStep === 2 && 'Xem trước dữ liệu trước khi import.'}
                  {importStep === 3 && 'Xác nhận import dữ liệu vào hệ thống.'}
                </DialogDescription>
              </DialogHeader>
              {importStep === 1 && (
                <div
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 my-4 transition-all ${dragActive ? 'border-primary bg-accent/30' : 'border-muted bg-muted/50'}`}
                  style={{ minHeight: 220 }}
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                  onDrop={e => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setImportFile(e.dataTransfer.files[0]);
                      handleExcelFile(e.dataTransfer.files[0]);
                      setImportStep(2);
                    }
                  }}
                >
                  <UploadCloud className="w-12 h-12 text-primary mb-2" />
                  <div className="font-semibold mb-2">Kéo & thả file Excel vào đây</div>
                  <div className="mb-4 text-sm text-muted-foreground">hoặc</div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImportFile(e.target.files[0]);
                        handleExcelFile(e.target.files[0]);
                        setImportStep(2);
                      }
                    }}
                  />
                  <Button onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                    Chọn file Excel
                  </Button>
                  {importFile && <div className="mt-2 text-sm text-green-600">Đã chọn: {importFile.name}</div>}
                </div>
              )}
              {importStep === 2 && (
                <div>
                  <div className="mb-4 font-semibold">Xem trước dữ liệu (tối đa 100 dòng):</div>
                  <div className="overflow-x-auto border rounded bg-muted mb-4 max-h-80" style={{ minHeight: 120 }}>
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-accent">
                          {importPreview[0]?.map((col, idx) => (
                            <th key={idx} className="px-3 py-2">{col || `Cột ${idx+1}`}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.slice(1).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="px-3 py-2">
                                {isImage(cell)
                                  ? <img src={cell} alt="img" className="max-h-16 max-w-[100px] object-contain border rounded shadow" />
                                  : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setImportStep(1); setImportFile(null); setImportPreview([]); }}>Chọn lại file</Button>
                    <Button onClick={handleImportProducts}>Xác nhận import</Button>
                  </DialogFooter>
                </div>
              )}
              {importStep === 3 && (
                <div className="text-center space-y-4">
                  <div className="text-green-600 font-semibold text-lg">Import thành công!</div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button onClick={() => setImportStep(1)}>Đóng</Button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Export */}
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>

          {/* Thêm sản phẩm */}
          <Dialog open={openCreate} onOpenChange={v => { setOpenCreate(v); if (!v) { setCreateImage(null); setCreateImageUrl(''); setDragImageActive(false); } }}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2" onClick={() => setOpenCreate(true)}>
                <Plus className="h-4 w-4" />
                <span>Thêm sản phẩm</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogDescription>Nhập thông tin sản phẩm mới vào form bên dưới.</DialogDescription>
              </DialogHeader>
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 mb-4 transition-all ${dragImageActive ? 'border-primary bg-accent/30' : 'border-muted bg-muted/50'}`}
                style={{ minHeight: 120 }}
                onDragOver={e => { e.preventDefault(); setDragImageActive(true); }}
                onDragLeave={e => { e.preventDefault(); setDragImageActive(false); }}
                onDrop={e => {
                  e.preventDefault();
                  setDragImageActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    setCreateImage(file);
                    setCreateImageUrl(URL.createObjectURL(file));
                  }
                }}
              >
                <UploadCloud className="w-10 h-10 text-primary mb-2" />
                <div className="font-semibold mb-2">Kéo & thả hình ảnh vào đây</div>
                <div className="mb-2 text-sm text-muted-foreground">hoặc</div>
                <input
                  type="file"
                  accept="image/*"
                  id="create-image-input"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setCreateImage(e.target.files[0]);
                      setCreateImageUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
                <Button onClick={() => document.getElementById('create-image-input').click()}>
                  Chọn hình ảnh
                </Button>
                {createImageUrl && (
                  <div className="mt-4">
                    <img src={createImageUrl} alt="preview" className="max-h-32 max-w-xs rounded shadow border object-contain" />
                  </div>
                )}
              </div>
              <form className="space-y-4" onSubmit={handleCreateProduct}>
                <Input placeholder="Tên sản phẩm" value={createName} onChange={e => setCreateName(e.target.value)} />
                <Input placeholder="Giá" type="number" value={createPrice} onChange={e => setCreatePrice(e.target.value)} />
                <Input placeholder="Thương hiệu" value={createBrand} onChange={e => setCreateBrand(e.target.value)} />
                <Input placeholder="Tồn kho" type="number" value={createStock} onChange={e => setCreateStock(e.target.value)} />
                <select value={createCategoryId} onChange={e => setCreateCategoryId(e.target.value)}
                  className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm ({totalProducts})</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(product.category.id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                        {product.stock} sản phẩm
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isFeatured ? 'default' : 'secondary'}>
                        {product.isFeatured ? 'Nổi bật' : 'Bình thường'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {/* View Dialog */}
                        <Dialog open={openView && viewProduct?.id === product.id} onOpenChange={v => { setOpenView(v); if (!v) setViewProduct(null); }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { setViewProduct(product); setOpenView(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg w-full">
                            <DialogHeader>
                              <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center mb-4">
                              <img src={product.image} alt={product.name} className="max-h-48 max-w-xs rounded shadow border object-contain mb-2" />
                              <div className="font-bold text-lg mb-1">{product.name}</div>
                              <div className="text-muted-foreground mb-2">{product.brand}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="font-medium">Giá:</div>
                              <div>{formatPrice(product.price)}</div>
                              <div className="font-medium">Tồn kho:</div>
                              <div>{product.stock}</div>
                              <div className="font-medium">Danh mục:</div>
                              <div>{getCategoryName(product.category.id)}</div>
                              <div className="font-medium">Trạng thái:</div>
                              <div>{product.isFeatured ? 'Nổi bật' : 'Bình thường'}</div>
                            </div>
                            {product.originalPrice && (
                              <div className="mb-2 text-sm text-muted-foreground line-through">Giá gốc: {formatPrice(product.originalPrice)}</div>
                            )}
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Đóng</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Edit Dialog */}
                        <Dialog open={openEdit && editProduct?.id === product.id} onOpenChange={v => {
                          setOpenEdit(v);
                          if (!v) {
                            setEditProduct(null);
                            setEditImage(null);
                            setEditImageUrl('');
                            setDragEditImageActive(false);
                          } else {
                            setEditImage(null);
                            setEditImageUrl('');
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditProduct(product);
                              setOpenEdit(true);
                              setEditImage(null);
                              setEditImageUrl('');
                              setDragEditImageActive(false);
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Sửa sản phẩm</DialogTitle>
                              <DialogDescription>Chỉnh sửa thông tin sản phẩm.</DialogDescription>
                            </DialogHeader>
                            <div
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 mb-4 transition-all ${dragEditImageActive ? 'border-primary bg-accent/30' : 'border-muted bg-muted/50'}`}
                              style={{ minHeight: 120 }}
                              onDragOver={e => { e.preventDefault(); setDragEditImageActive(true); }}
                              onDragLeave={e => { e.preventDefault(); setDragEditImageActive(false); }}
                              onDrop={e => {
                                e.preventDefault();
                                setDragEditImageActive(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  const file = e.dataTransfer.files[0];
                                  setEditImage(file);
                                  setEditImageUrl(URL.createObjectURL(file));
                                }
                              }}
                            >
                              <UploadCloud className="w-10 h-10 text-primary mb-2" />
                              <div className="font-semibold mb-2">Kéo & thả hình ảnh mới vào đây</div>
                              <div className="mb-2 text-sm text-muted-foreground">hoặc</div>
                              <input
                                type="file"
                                accept="image/*"
                                id={`edit-image-input-${product.id}`}
                                className="hidden"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    setEditImage(e.target.files[0]);
                                    setEditImageUrl(URL.createObjectURL(e.target.files[0]));
                                  }
                                }}
                              />
                              <Button onClick={() => document.getElementById(`edit-image-input-${product.id}`).click()}>
                                Chọn hình ảnh mới
                              </Button>
                              <div className="mt-4">
                                {editImageUrl ? (
                                  <img src={editImageUrl} alt="preview" className="max-h-32 max-w-xs rounded shadow border object-contain" />
                                ) : (
                                  <img src={product.image} alt="old" className="max-h-32 max-w-xs rounded shadow border object-contain opacity-80" />
                                )}
                                <div className="text-xs text-muted-foreground mt-1">{editImageUrl ? 'Ảnh mới' : 'Ảnh hiện tại'}</div>
                              </div>
                            </div>
                            <form className="space-y-4" onSubmit={handleUpdateProduct}>
                              <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Tên sản phẩm" />
                              <Input value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="Giá" type="number" />
                              <Input value={editBrand} onChange={e => setEditBrand(e.target.value)} placeholder="Thương hiệu" />
                              <Input value={editStock} onChange={e => setEditStock(e.target.value)} placeholder="Tồn kho" type="number" />
                              <select
                                value={editCategoryId}
                                onChange={e => setEditCategoryId(e.target.value)}
                                className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                              >
                                <option value="">Chọn danh mục</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Huỷ</Button>
                                </DialogClose>
                                <Button type="submit">Lưu</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Button */}
                        <Button onClick={() => handleDeleteProduct(product.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination controls */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&laquo;</Button>
              {Array.from({ length: Math.ceil(totalProducts / pageSize) }, (_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i * pageSize + 1} - {Math.min((i + 1) * pageSize, totalProducts)}
                </Button>
              ))}
              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalProducts / pageSize), p + 1))} disabled={currentPage === Math.ceil(totalProducts / pageSize)}>&raquo;</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;