import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarIcon, ThumbsUp, Flag, Camera, Send, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppToast } from '@/components/common/Toast';
import { format } from 'date-fns';

interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  turfId: string;
  bookingId: string;
  rating: number;
  comment: string;
  photos: string[];
  helpfulCount: number;
  isVerified: boolean;
  isHelpful: boolean;
  createdAt: Date;
  response?: {
    message: string;
    responderName: string;
    respondedAt: Date;
  };
}

interface ReviewSystemProps {
  turfId: string;
  reviews: Review[];
  canAddReview?: boolean;
  averageRating?: number;
  totalReviews?: number;
  onAddReview?: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'isHelpful'>) => void;
}

const ReviewSystem = ({ 
  turfId, 
  reviews, 
  canAddReview = false, 
  averageRating = 0,
  totalReviews = 0,
  onAddReview 
}: ReviewSystemProps) => {
  const { success, error } = useAppToast();
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    photos: [] as string[],
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const handleRatingSelect = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) {
      error('Please select a rating');
      return;
    }
    if (!newReview.comment.trim()) {
      error('Please write a review comment');
      return;
    }

    try {
      const reviewData = {
        customerId: 'current_user_id',
        customerName: 'John Doe',
        turfId,
        bookingId: 'current_booking_id',
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        photos: newReview.photos,
        isVerified: true,
      };

      onAddReview?.(reviewData);
      success('Review submitted successfully!');
      setShowAddReview(false);
      setNewReview({ rating: 0, comment: '', photos: [] });
    } catch (err) {
      error('Failed to submit review');
    }
  };

  const sortedAndFilteredReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            See what other customers are saying about this turf
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {totalReviews} reviews
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{
                        width: totalReviews > 0 ? `${(distribution[rating as keyof typeof distribution] / totalReviews) * 100}%` : '0%'
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">{distribution[rating as keyof typeof distribution]}</span>
                </div>
              ))}
            </div>
          </div>

          {canAddReview && (
            <div className="mt-6 pt-6 border-t">
              <Button onClick={() => setShowAddReview(true)} className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Review Form */}
      <AnimatePresence>
        {showAddReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Write Your Review</CardTitle>
                <CardDescription>
                  Share your experience to help other customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating *</label>
                  <div className="flex gap-1">
                    {renderStars(newReview.rating, true, handleRatingSelect)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Review *</label>
                  <Textarea
                    placeholder="Tell others about your experience at this turf..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSubmitReview} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddReview(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Sorting */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter & Sort:</span>
          </div>
          <Select value={filterRating.toString()} onValueChange={(value) => setFilterRating(value === 'all' ? 'all' : parseInt(value))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedAndFilteredReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">Be the first to share your experience!</p>
            </CardContent>
          </Card>
        ) : (
          sortedAndFilteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.customerAvatar} />
                      <AvatarFallback>
                        {review.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.customerName}</span>
                            {review.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Booking
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">
                              {format(review.createdAt, 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed">{review.comment}</p>

                      {review.photos.length > 0 && (
                        <div className="flex gap-2">
                          {review.photos.map((photo, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Helpful ({review.helpfulCount})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Flag className="w-4 h-4 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>

                      {review.response && (
                        <>
                          <Separator />
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">Response from {review.response.responderName}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(review.response.respondedAt, 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm">{review.response.message}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;