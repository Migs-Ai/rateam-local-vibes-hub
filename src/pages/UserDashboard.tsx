
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, MessageSquare, Edit, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface UserProfile {
  full_name: string;
  email: string;
  whatsapp?: string;
  avatar_url?: string;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  vendor: {
    id: string;
    business_name: string;
    category: string;
  };
}

const UserDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('UserDashboard - Auth state:', { user: !!user, isAdmin, authLoading });

  useEffect(() => {
    // Only redirect admins if we're sure about the auth state
    if (!authLoading && user && isAdmin) {
      console.log('Redirecting admin to admin dashboard');
      navigate('/admin-dashboard', { replace: true });
      return;
    }

    // If not loading and no user, we should have been redirected by ProtectedRoute
    // but if we're here, let's handle it gracefully
    if (!authLoading && !user) {
      console.log('No user found, should redirect to auth');
      setLoading(false);
      return;
    }

    // If we have a user and they're not an admin, fetch their data
    if (!authLoading && user && !isAdmin) {
      console.log('Fetching user data for:', user.id);
      fetchUserData();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Starting to fetch user data...');

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setError('Failed to load profile data');
      } else {
        console.log('Profile data fetched:', profileData);
        setProfile(profileData);
      }

      // Fetch user reviews with vendor information
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          vendors (
            id,
            business_name,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        // Don't set error for reviews, just log it
      } else {
        console.log('Reviews data fetched:', reviewsData);
        // Transform the data to match our Review interface
        const transformedReviews = (reviewsData || []).map(review => ({
          ...review,
          vendor: review.vendors
        }));
        setReviews(transformedReviews);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string, vendorName: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        toast({
          title: "Error deleting review",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Review deleted",
          description: `Your review for ${vendorName} has been deleted.`,
        });
        fetchUserData(); // Refresh the data
      }
    } catch (error) {
      toast({
        title: "Error deleting review",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
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

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to access your dashboard.</p>
            <Link to="/auth">
              <Button className="bg-green-600 hover:bg-green-700">Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-xl">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.full_name || 'User'}
                  </h1>
                  <p className="text-gray-600">{profile?.email || user.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(profile?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link to="/user-profile">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getRatingColor(parseFloat(averageRating))}`}>
                  {averageRating}
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
              <CardTitle>My Reviews ({reviews.length})</CardTitle>
              <Link to="/vendors">
                <Button className="bg-green-600 hover:bg-green-700">
                  Write Review
                </Button>
              </Link>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Link 
                          to={`/vendor/${review.vendor.id}`}
                          className="text-lg font-semibold text-green-600 hover:text-green-700"
                        >
                          {review.vendor.business_name}
                        </Link>
                        <Badge variant="secondary">{review.vendor.category}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="font-semibold">{review.rating}.0</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to={`/vendor/${review.vendor.id}`}>
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
                        onClick={() => handleDeleteReview(review.id, review.vendor.business_name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
            
            {reviews.length === 0 && (
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
