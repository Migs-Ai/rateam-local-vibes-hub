
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Calendar, MessageSquare, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const UserDashboard = () => {
  const { toast } = useToast();
  
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@email.com",
    joinDate: "2024-01-15",
    totalReviews: 23,
    averageRating: 3.8
  };

  // Mock user reviews
  const userReviews = [
    {
      id: "1",
      vendorName: "Mama's Kitchen",
      vendorId: "mamas-kitchen",
      category: "Food",
      rating: 5,
      comment: "Amazing food! The jollof rice is the best on campus. Quick service and friendly staff.",
      date: "2024-01-15",
      edited: false
    },
    {
      id: "2",
      vendorName: "Quick Tailors",
      vendorId: "quick-tailors",
      category: "Fashion",
      rating: 4,
      comment: "Good tailoring service, reasonable prices. Delivered on time.",
      date: "2024-01-12",
      edited: true
    },
    {
      id: "3",
      vendorName: "Campus Cab",
      vendorId: "campus-cab",
      category: "Transport",
      rating: 2,
      comment: "Driver was late and the car wasn't very clean. Service could be better.",
      date: "2024-01-10",
      edited: false
    },
    {
      id: "4",
      vendorName: "Tech Repair Hub",
      vendorId: "tech-repair-hub",
      category: "Tech Repair",
      rating: 5,
      comment: "Excellent repair service! Fixed my phone quickly and at a fair price.",
      date: "2024-01-08",
      edited: false
    }
  ];

  const handleDeleteReview = (reviewId: string, vendorName: string) => {
    // Mock delete review
    toast({
      title: "Review deleted",
      description: `Your review for ${vendorName} has been deleted.`,
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

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button className="bg-green-600 hover:bg-green-700">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user.totalReviews}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getRatingColor(user.averageRating)}`}>
                  {user.averageRating}
                </div>
                <div className="text-sm text-gray-600">Average Rating Given</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Active</div>
                <div className="text-sm text-gray-600">Account Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/vendors">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Write New Review
                </Button>
              </Link>
              <Link to="/vendors">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Browse Vendors
                </Button>
              </Link>
              <Link to="/polls">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Vote in Polls
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* User Reviews */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Reviews ({userReviews.length})</CardTitle>
              <Link to="/vendors">
                <Button className="bg-green-600 hover:bg-green-700">
                  Write Review
                </Button>
              </Link>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {userReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Link 
                          to={`/vendor/${review.vendorId}`}
                          className="text-lg font-semibold text-green-600 hover:text-green-700"
                        >
                          {review.vendorName}
                        </Link>
                        <Badge variant="secondary">{review.category}</Badge>
                        {review.edited && (
                          <Badge variant="outline" className="text-xs">Edited</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="font-semibold">{review.rating}.0</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to={`/vendor/${review.vendorId}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="text-blue-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600"
                        onClick={() => handleDeleteReview(review.id, review.vendorName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
            
            {userReviews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">Start sharing your experiences with local vendors!</p>
                <Link to="/vendors">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Write Your First Review
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
