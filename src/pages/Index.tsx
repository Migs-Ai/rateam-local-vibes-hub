import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, MessageCircle, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  votes: Record<string, number>;
  status: string;
  ends_at: string;
}

const Index = () => {
  const [livePolls, setLivePolls] = useState<Poll[]>([]);

  useEffect(() => {
    fetchLivePolls();
  }, []);

  const fetchLivePolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        // Transform the data to match our Poll interface
        const transformedData = data.map(poll => ({
          ...poll,
          options: Array.isArray(poll.options) ? (poll.options as string[]) : [],
          votes: poll.votes && typeof poll.votes === 'object' ? poll.votes as Record<string, number> : {}
        }));
        setLivePolls(transformedData);
      }
    } catch (error) {
      console.error('Error fetching live polls:', error);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    // For now, just show a message - full voting implementation would require auth
    console.log(`Voting for poll ${pollId}, option ${optionIndex}`);
  };

  const featuredVendors = [
    {
      id: "1",
      name: "Mama's Kitchen",
      category: "Food & Restaurants",
      rating: 4.8,
      reviewCount: 124,
      location: "Near Main Gate",
      phone: "+234 800 123 4567",
      whatsapp: "+234 800 123 4567",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop"
    },
    {
      id: "2", 
      name: "TechFix Solutions",
      category: "Tech & Gadgets",
      rating: 4.6,
      reviewCount: 89,
      location: "Student Village",
      phone: "+234 800 234 5678",
      whatsapp: "+234 800 234 5678",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=200&fit=crop"
    },
    {
      id: "3",
      name: "Campus Fashion Hub", 
      category: "Fashion & Clothing",
      rating: 4.7,
      reviewCount: 156,
      location: "Faculty Road",
      phone: "+234 800 345 6789",
      whatsapp: "+234 800 345 6789", 
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Rate Your Campus Vendors
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Help fellow students discover the best services around campus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vendors">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                Browse Vendors
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Start Rating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Polls Section */}
      {livePolls.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Polls</h2>
              <p className="text-xl text-gray-600">Vote on current community polls</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {livePolls.map((poll) => (
                <Card key={poll.id} className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{poll.title}</CardTitle>
                    {poll.description && (
                      <CardDescription>{poll.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {poll.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleVote(poll.id, index)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    {poll.ends_at && (
                      <p className="text-sm text-gray-500 mt-4">
                        Ends: {new Date(poll.ends_at).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/polls">
                <Button variant="outline">View All Polls</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">150+</h3>
              <p className="text-gray-600">Registered Vendors</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">2,500+</h3>
              <p className="text-gray-600">Reviews Posted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Vendors</h2>
            <p className="text-xl text-gray-600">Top-rated vendors this month</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVendors.map((vendor) => (
              <Card key={vendor.id} className="bg-gray-50 border-gray-200 hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={vendor.image} 
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {vendor.category}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({vendor.reviewCount})</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {vendor.location}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {vendor.phone}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp: {vendor.whatsapp}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/vendor/${vendor.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Link to={`/review/${vendor.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        Write Review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/vendors">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View All Vendors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RateAm.com</h3>
              <p className="text-gray-400">
                Connecting students with the best campus vendors through honest reviews.
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/vendors" className="hover:text-white">Browse Vendors</Link></li>
                <li><Link to="/auth" className="hover:text-white">Write Reviews</Link></li>
                <li><Link to="/polls" className="hover:text-white">Participate in Polls</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/vendor-signup" className="hover:text-white">Register Business</Link></li>
                <li><Link to="/vendor-login" className="hover:text-white">Vendor Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center text-gray-400">
            <p>&copy; 2024 RateAm.com. All rights reserved.</p>
            <Link 
              to="/admin-login" 
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
