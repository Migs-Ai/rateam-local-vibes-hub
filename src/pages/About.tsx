
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, MessageSquare, TrendingUp, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const About = () => {
  const features = [
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Rate & Review",
      description: "Share your honest experiences with local vendors and help others make informed decisions."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Community Driven",
      description: "Built by students, for students. Connect with your campus community through shared experiences."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      title: "Vendor Engagement",
      description: "Vendors can respond to feedback and improve their services based on community input."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: "Community Polls",
      description: "Vote for the best vendors in different categories and see what the community thinks."
    }
  ];

  const stats = [
    { number: "1,200+", label: "Active Users" },
    { number: "89", label: "Registered Vendors" },
    { number: "3,400+", label: "Reviews Posted" },
    { number: "15", label: "Categories" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About RateAm.com
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            RateAm.com is a community-driven platform that connects students and local residents 
            with trusted vendors on university campuses. We believe in the power of honest feedback 
            to improve local services and build stronger communities.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              To create a transparent, trustworthy ecosystem where students can easily find reliable 
              vendors for their daily needs, while empowering local businesses to improve their 
              services through constructive feedback. We're building bridges between customers and 
              vendors, one review at a time.
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Makes RateAm Special
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="mb-16 bg-green-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-800">Our Growing Community</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-green-700 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">How RateAm Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Find Vendors</h3>
                <p className="text-gray-600">
                  Browse our directory of local vendors by category, location, or search for specific services.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Share Experience</h3>
                <p className="text-gray-600">
                  Rate vendors and write detailed reviews about your experience to help others.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Build Community</h3>
                <p className="text-gray-600">
                  Help improve local services and make informed decisions based on community feedback.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-3 h-6 w-6 text-blue-500" />
                For Students & Residents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li>• Find trusted vendors for food, fashion, tech repair, transport, and more</li>
                <li>• Read honest reviews from fellow community members</li>
                <li>• Share your experiences to help others</li>
                <li>• Participate in community polls and voting</li>
                <li>• Discover new services and hidden gems on campus</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-3 h-6 w-6 text-green-500" />
                For Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li>• Showcase your business to the campus community</li>
                <li>• Receive valuable feedback to improve your services</li>
                <li>• Respond to reviews and engage with customers</li>
                <li>• Get notified about negative feedback to address issues quickly</li>
                <li>• Build trust and reputation through transparent ratings</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="text-center bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're looking to find great vendors or showcase your business, 
              RateAm.com is here to connect our campus community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Join as User
                </Button>
              </Link>
              <Link to="/vendor-signup">
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Register Your Business
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
