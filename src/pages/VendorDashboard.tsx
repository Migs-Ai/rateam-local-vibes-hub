
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare, Phone, Mail, AlertTriangle, TrendingUp, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const VendorDashboard = () => {
  const { toast } = useToast();
  const [filterRating, setFilterRating] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Mock vendor data
  const vendor = {
    businessName: "Mama's Kitchen",
    category: "Food",
    rating: 4.8,
    totalReviews: 234,
    thisMonth: 45,
    averageThisMonth: 4.9
  };

  // Mock reviews data
  const reviews = [
    {
      id: "1",
      userName: "John Doe",
      rating: 5,
      comment: "Amazing food! The jollof rice is the best on campus. Quick service and friendly staff.",
      date: "2024-01-15",
      avatar: "JD",
      allowContact: true,
      replied: false
    },
    {
      id: "2",
      userName: "Sarah Johnson",
      rating: 2,
      comment: "Food was cold when delivered. Service was slow and the order was wrong. Very disappointed.",
      date: "2024-01-14",
      avatar: "SJ",
      allowContact: true,
      replied: false,
      contactInfo: {
        whatsapp: "+234 901 234 5678",
        email: "sarah.j@email.com"
      }
    },
    {
      id: "3",
      userName: "Mike Chen",
      rating: 4,
      comment: "Good food overall, reasonable prices. Will order again.",
      date: "2024-01-12",
      avatar: "MC",
      allowContact: false,
      replied: true,
      reply: "Thank you for your feedback! We appreciate your business."
    },
    {
      id: "4",
      userName: "Lisa Brown",
      rating: 1,
      comment: "Terrible experience. Food was spoiled and customer service was rude.",
      date: "2024-01-10",
      avatar: "LB",
      allowContact: true,
      replied: false,
      contactInfo: {
        whatsapp: "+234 902 345 6789",
        phone: "+234 902 345 6789"
      }
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {vendor.businessName}!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                  <p className="text-2xl font-bold">{vendor.rating}</p>
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
                  <p className="text-2xl font-bold">{vendor.totalReviews}</p>
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
                  <p className="text-2xl font-bold">{vendor.thisMonth}</p>
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
                      <AvatarFallback>{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.userName}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                            {review.rating < 3 && (
                              <Badge variant="destructive" className="ml-2">
                                Low Rating
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Contact options for low ratings */}
                        {review.rating < 3 && review.allowContact && review.contactInfo && (
                          <div className="flex space-x-2">
                            {review.contactInfo.whatsapp && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200"
                                onClick={() => handleContactCustomer(review.contactInfo, "WhatsApp")}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                WhatsApp
                              </Button>
                            )}
                            {review.contactInfo.phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContactCustomer(review.contactInfo, "Phone")}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                            )}
                            {review.contactInfo.email && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContactCustomer(review.contactInfo, "Email")}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      {/* Vendor Reply */}
                      {review.replied && review.reply && (
                        <div className="bg-blue-50 p-3 rounded-lg mt-3">
                          <p className="text-sm font-medium text-blue-800 mb-1">Your Reply:</p>
                          <p className="text-blue-700">{review.reply}</p>
                        </div>
                      )}
                      
                      {/* Reply Form */}
                      {!review.replied && (
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
                      )}
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
