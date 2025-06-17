import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  product: Product;
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({ product, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, accessToken } = useStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để đánh giá sản phẩm",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn số sao đánh giá",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Lỗi",
        description: "Nhận xét phải có ít nhất 10 ký tự",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:8000/api/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          product_id: product.id,
          rating,
          comment: comment.trim()
        })
      });

      if (!res.ok) {
        let errorMsg = 'Gửi đánh giá thất bại';
        try {
          const data = await res.json();
          errorMsg = data.detail || JSON.stringify(data);
          // Log chi tiết lỗi để debug dễ hơn
          console.error('Review API error:', data);
        } catch (err) {
          // Nếu không parse được JSON
          errorMsg = 'Gửi đánh giá thất bại (không đọc được lỗi chi tiết)';
        }
        throw new Error(errorMsg);
      }

      toast({
        title: "Thành công",
        description: "Đánh giá của bạn đã được gửi!"
      });

      setRating(0);
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted();

    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Gửi đánh giá thất bại",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập để đánh giá sản phẩm</p>
          <Button asChild>
            <a href="/login">Đăng nhập</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viết đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-2 block">Đánh giá của bạn</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating}/5 sao`}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="comment" className="text-base font-medium">
              Nhận xét
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="mt-2 min-h-[120px]"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Tối thiểu 10 ký tự ({comment.length}/10)
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="w-full"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
