import { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, Star, Search } from 'lucide-react';
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: number;
  userName: string;
  userAvatar: string;
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [openView, setOpenView] = useState(false);
  const [viewReview, setViewReview] = useState<Review | null>(null);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/reviews/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        setReviews(data.results || []);
      } catch (error) {
        console.error('Lỗi khi tải đánh giá:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        console.error('Xóa thất bại:', res.status);
      }
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || r.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý đánh giá</h1>
        <span className="text-muted-foreground">Tổng: {reviews.length}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Eye className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm">Đang hiển thị</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <EyeOff className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-sm">Đã ẩn</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Star className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm">Đánh giá TB</p>
                <p className="text-2xl font-bold">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo người dùng hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Tất cả sao</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} sao</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>Danh sách đánh giá ({filteredReviews.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Bình luận</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img src={r.userAvatar} alt={r.userName} className="w-8 h-8 rounded-full object-cover border" />
                      <span>{r.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderStars(r.rating)}</TableCell>
                  <TableCell className="max-w-xs truncate">{r.comment}</TableCell>
                  <TableCell>{formatDate(r.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {/* View Detail */}
                      <Dialog open={openView && viewReview?.id === r.id} onOpenChange={(v) => { setOpenView(v); if (!v) setViewReview(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => { setViewReview(r); setOpenView(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Chi tiết đánh giá</DialogTitle></DialogHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <img src={r.userAvatar} alt={r.userName} className="w-10 h-10 rounded-full object-cover border" />
                            <span><strong>{r.userName}</strong></span>
                          </div>
                          <p><strong>Rating:</strong> {r.rating} sao</p>
                          <p><strong>Bình luận:</strong> {r.comment}</p>
                          <p><strong>Thời gian:</strong> {formatDate(r.created_at)}</p>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Đóng</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteReview(r.id)}
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

export default AdminReviews;
