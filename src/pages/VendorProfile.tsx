
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Phone, Mail, MapPin, MessageSquare, Clock } from "lucide-react";
import Header from "@/components/Header";

const VendorProfile = () => {
  const { vendorId } = useParams();
  
  // Mock data - in a real app, this would come from an API
  const vendor = {
    id: vendorId,
    name: "Mama's Kitchen",
    category: "Food",
    rating: 4.8,
    reviewCount: 234,
    phone: "+234 901 234 5678",
    email: "mamaskit chen@email.com",
    location: "Near Main Gate, Federal University",
    description: "We serve delicious, home-cooked meals at affordable prices. Our specialty includes local dishes, rice meals, and fresh salads. We've been serving the campus community for over 5 years.",
    image: "🍽️",
    hours: "8:00 AM - 8:00 PM",
    whatsapp: "+234 901 234 5678"
  };

  const reviews = [
    {
      id: 1,
      userName: "John Doe",
      rating: 5,
      comment: "Amazing food! The jollof rice is the best on campus. Quick service and friendly staff.",
      date: "2024-01-15",
      avatar: "JD"
    },
    {
      id: 2,
      userName: "Sarah Johnson",
      rating: 4,
      comment: "Good food and reasonable prices. Sometimes takes a bit longer during lunch rush.",
      date: "2024-01-10",
      avatar: "SJ"
    },
    {
      id: 3,
      userName: "Mike Chen",
      rating: 5,
      comment: "Love this place! Fresh ingredients and the portions are generous. Highly recommend!",
      date: "2024-01-08",
      avatar: "MC"
    },
    {
      id: 4,
      userName: "Lisa Brown",
      rating: 3,
      comment: "Food is okay but service could be faster. The place gets really crowded.",
      date: "2024-01-05",
      avatar: "LB"
    }
  ];

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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Vendor Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="text-6xl">{vendor.image}</div>
                <div>
                  <CardTitle className="text-3xl">{vendor.name}</CardTitle>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {vendor.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-lg">{vendor.rating}</span>
                      <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link to={`/review/${vendor.id}`}>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Leave a Review
                </Button>
              </Link>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">About</h3>
                <p className="text-gray-600 mb-4">{vendor.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {vendor.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {vendor.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {vendor.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {vendor.hours}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Contact Options</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Call {vendor.phone}
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-green-50 border-green-200">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp {vendor.whatsapp}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Reviews ({reviews.length})</CardTitle>
              <Link to={`/review/${vendor.id}`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  Write Review
                </Button>
              </Link>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
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
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {reviews.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-4">Be the first to review this vendor!</p>
                <Link to={`/review/${vendor.id}`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Write First Review
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

export default VendorProfile;
