
import { Star, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {review.comment}
                </p>
                
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Hữu ích ({review.helpful})
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList;
