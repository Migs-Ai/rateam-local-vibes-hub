
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Edit2, Trash2, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user: authUser, isAdmin, loading } = useAuth();

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin', { replace: true });
      return;
    }
  }, [isAdmin, loading, navigate]);

  // Mock user reviews
  const userReviews = [
    {
      id: "1",
      vendorName: "Lion's Shawarma",
      rating: 5,
      comment: "Amazing food and quick service!",
      date: "2024-01-15",
      category: "Food & Restaurants"
    },
    {
      id: "2",
      vendorName: "Campus Store",
      rating: 4,
      comment: "Good prices but sometimes out of stock.",
      date: "2024-01-10",
      category: "Groceries & Provisions"
    },
    {
      id: "3",
      vendorName: "Quick Tailors",
      rating: 3,
      comment: "Decent work but took longer than expected.",
      date: "2024-01-08",
      category: "Fashion & Clothing"
    }
  ];

  useEffect(() => {
    if (!authUser && !loading) {
      navigate('/auth');
      return;
    }
    
    if (authUser) {
      setUser(authUser);
      setName(authUser.user_metadata?.full_name || "");
      setEmail(authUser.email || "");
      setWhatsapp(authUser.user_metadata?.whatsapp || "");
    }
  }, [authUser, loading, navigate]);

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name,
      email,
      whatsapp
    };
    
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved.",
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    toast({
      title: "Review deleted",
      description: "Your review has been removed.",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and review history</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews ({userReviews.length})</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                {isEditing && (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userReviews.length}</p>
                  <p className="text-sm text-gray-600">Reviews Written</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.2</p>
                  <p className="text-sm text-gray-600">Average Rating Given</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">Gold</p>
                  <p className="text-sm text-gray-600">Reviewer Status</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Reviews</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{review.vendorName}</h4>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="secondary">{review.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
