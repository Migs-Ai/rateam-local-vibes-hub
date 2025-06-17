
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Search, MapPin, Users, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { name: "Food", icon: "🍕", count: 45 },
    { name: "Fashion", icon: "👕", count: 23 },
    { name: "Tech Repair", icon: "📱", count: 12 },
    { name: "Transport", icon: "🚗", count: 18 },
    { name: "Laundry", icon: "👔", count: 8 },
    { name: "Barber", icon: "✂️", count: 15 }
  ];

  const topVendors = [
    { name: "Mama's Kitchen", category: "Food", rating: 4.8, reviews: 234, image: "🍽️" },
    { name: "Quick Tailors", category: "Fashion", rating: 4.6, reviews: 156, image: "✂️" },
    { name: "Campus Cab", category: "Transport", rating: 4.7, reviews: 89, image: "🚗" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">RateAm</h1>
              <span className="ml-1 text-sm text-gray-500">.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Rate vendors. Share your experience.
            <span className="text-green-600"> Find trusted services.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            RateAm.com helps you rate and find trusted vendors near you. Join our community and discover the best local services.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for vendors..."
              className="pl-10 py-3 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/vendors">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                <Star className="mr-2 h-5 w-5" />
                Rate a Vendor
              </Button>
            </Link>
            <Link to="/vendor-signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-green-600 text-green-600 hover:bg-green-50">
                <Users className="mr-2 h-5 w-5" />
                Claim Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={`/vendors?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">{category.count} vendors</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Vendors */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <TrendingUp className="mr-3 h-6 w-6 text-green-600" />
            <h3 className="text-3xl font-bold">Top Rated Vendors</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topVendors.map((vendor) => (
              <Link key={vendor.name} to={`/vendor/${vendor.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4">{vendor.image}</div>
                    <CardTitle className="text-xl">{vendor.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="secondary">{vendor.category}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{vendor.rating}</span>
                      <span className="ml-2 text-gray-500">({vendor.reviews} reviews)</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">RateAm.com</h4>
              <p className="text-gray-400">Connecting customers with trusted local vendors through honest reviews.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Users</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/vendors" className="hover:text-white">Browse Vendors</Link></li>
                <li><Link to="/polls" className="hover:text-white">Vote in Polls</Link></li>
                <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Vendors</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/vendor-signup" className="hover:text-white">Register Business</Link></li>
                <li><Link to="/vendor-login" className="hover:text-white">Vendor Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RateAm.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
