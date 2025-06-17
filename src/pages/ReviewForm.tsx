
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const ReviewForm = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [allowContact, setAllowContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock vendor data
  const vendor = {
    name: "Mama's Kitchen",
    category: "Food"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must select a star rating before submitting.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Mock review submission
    setTimeout(() => {
      const review = {
        id: Date.now().toString(),
        vendorId,
        rating,
        reviewText,
        allowContact,
        date: new Date().toISOString(),
        userName: "Current User" // In real app, get from auth
      };

      // Save review to localStorage (in real app, send to API)
      const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      existingReviews.push(review);
      localStorage.setItem('reviews', JSON.stringify(existingReviews));

      toast({
        title: "Review submitted successfully!",
        description: "Thank you for sharing your experience.",
      });

      // If rating is low (< 3), notify vendor
      if (rating < 3) {
        toast({
          title: "Vendor notified",
          description: "The vendor has been notified about your feedback.",
        });
      }

      navigate(`/vendor/${vendorId}`);
      setIsLoading(false);
    }, 1000);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              starValue <= (hoveredRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Leave a Review</CardTitle>
            <CardDescription>
              Share your experience with {vendor.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vendor Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
                <p className="text-gray-600">{vendor.category}</p>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate your experience? *
                </label>
                <div className="flex space-x-1">
                  {renderStars()}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 1 && "Poor - Very disappointed"}
                    {rating === 2 && "Fair - Below expectations"}
                    {rating === 3 && "Good - Met expectations"}
                    {rating === 4 && "Very Good - Exceeded expectations"}
                    {rating === 5 && "Excellent - Outstanding experience"}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-3">
                  Tell others about your experience (Optional)
                </label>
                <Textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about the service, quality, speed, customer service, etc..."
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Contact Permission */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allowContact"
                  checked={allowContact}
                  onCheckedChange={(checked) => setAllowContact(checked as boolean)}
                />
                <div>
                  <label htmlFor="allowContact" className="text-sm font-medium text-gray-700">
                    Allow vendor to contact me
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    If you had a negative experience (3 stars or below), this allows the vendor to reach out to resolve any issues via WhatsApp, SMS, or email.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Review"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewForm;
