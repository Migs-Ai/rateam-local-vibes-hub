
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const QuickReviewForm = () => {
  const [vendorName, setVendorName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, try to find the vendor by business name
      const { data: vendors, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .ilike('business_name', `%${vendorName}%`)
        .limit(1);

      if (vendorError) {
        throw vendorError;
      }

      if (!vendors || vendors.length === 0) {
        toast({
          title: "Vendor not found",
          description: "We couldn't find a vendor with that name. Please check the spelling or contact us to add them.",
          variant: "destructive",
        });
        return;
      }

      const vendorId = vendors[0].id;

      // Check if user already reviewed this vendor
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('vendor_id', vendorId)
        .single();

      if (existingReview) {
        toast({
          title: "Review already exists",
          description: "You have already reviewed this vendor. You can only review each vendor once.",
          variant: "destructive",
        });
        return;
      }

      // Submit the review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          vendor_id: vendorId,
          rating,
          comment: comment.trim() || null,
          status: 'approved'
        });

      if (reviewError) {
        throw reviewError;
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback. Your review has been published.",
      });

      // Reset form
      setVendorName("");
      setRating(0);
      setComment("");

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Quick Review</CardTitle>
        <CardDescription>
          Share your experience with a local vendor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vendorName">Vendor/Business Name</Label>
            <Input
              id="vendorName"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g., Mama's Kitchen"
              required
            />
          </div>
          
          <div>
            <Label>Rating</Label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
        
        {!user && (
          <p className="text-sm text-gray-500 text-center mt-4">
            <Link to="/auth" className="text-green-600 hover:underline">
              Sign in
            </Link> to leave a review
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickReviewForm;
