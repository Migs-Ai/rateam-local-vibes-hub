import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare, Phone, Mail, AlertTriangle, TrendingUp, Users, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

const VendorDashboard = () => {
  const { toast } = useToast();
  const { user, vendorProfile, isVendor } = useAuth();
  const navigate = useNavigate();
  const [filterRating, setFilterRating] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isVendor || !vendorProfile) {
      navigate('/');
      return;
    }
    fetchReviews();
  }, [isVendor, vendorProfile, navigate]);

  const fetchReviews = async () => {
    if (!vendorProfile?.id) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filterRating === "all") return true;
    if (filterRating === "low") return review.rating <= 2;
    if (filterRating === "high") return review.rating >= 4;
    return review.rating.toString() === filterRating;
  });

  const lowRatedReviews = reviews.filter(review => review.rating < 3);

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    // Mock reply submission
    toast({
      title: "Reply posted successfully!",
      description: "Your response has been published.",
    });

    setReplyText("");
    setReplyingTo(null);
  };

  const handleContactCustomer = (contactInfo: any, method: string) => {
    toast({
      title: `Opening ${method}...`,
      description: `Contacting customer via ${method}`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading vendor dashboard...</div>
        </div>
      </div>
    );
  }

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Profile Not Found</h2>
            <p className="text-gray-600 mb-6">
              Your vendor profile is still being set up or approved. Please contact support if this issue persists.
            </p>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {vendorProfile.business_name}!</p>
          <Badge 
            variant={vendorProfile.status === 'approved' ? 'default' : 'secondary'}
            className="mt-2"
          >
            Status: {vendorProfile.status}
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                  <p className="text-2xl font-bold">{averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold">{reviews.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">{reviews.filter(r => {
                    const reviewDate = new Date(r.created_at);
                    const now = new Date();
                    return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear();
                  }).length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Ratings</p>
                  <p className="text-2xl font-bold text-red-600">{lowRatedReviews.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low-rated Reviews Alert */}
        {lowRatedReviews.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Action Needed: {lowRatedReviews.length} Low-Rated Review{lowRatedReviews.length > 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                You have reviews with 2 stars or below that need your attention. Consider reaching out to these customers to resolve their concerns.
              </p>
              <Button 
                onClick={() => setFilterRating("low")}
                className="bg-red-600 hover:bg-red-700"
              >
                View Low-Rated Reviews
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-2xl mb-4 sm:mb-0">Customer Reviews</CardTitle>
              <div className="flex items-center space-x-4">
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviews</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="low">Low Rated (≤2)</SelectItem>
                    <SelectItem value="high">High Rated (≥4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {review.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                            {review.rating < 3 && (
                              <Badge variant="destructive" className="ml-2">
                                Low Rating
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      )}
                      
                      {/* Reply Form */}
                      <div className="mt-3">
                        {replyingTo === review.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your response to this review..."
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleReply(review.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Post Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReplyingTo(review.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredReviews.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600">
                  {filterRating === "all" 
                    ? "No reviews yet. Encourage customers to leave feedback!"
                    : "No reviews match your current filter."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;