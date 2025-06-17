
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, MapPin, Phone, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const VendorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const vendors = [
    {
      id: "mamas-kitchen",
      name: "Mama's Kitchen",
      category: "Food",
      rating: 4.8,
      reviewCount: 234,
      phone: "+234 901 234 5678",
      location: "Near Main Gate",
      description: "Delicious home-cooked meals at affordable prices",
      image: "🍽️"
    },
    {
      id: "quick-tailors",
      name: "Quick Tailors", 
      category: "Fashion",
      rating: 4.6,
      reviewCount: 156,
      phone: "+234 902 345 6789",
      location: "Student Village",
      description: "Fast and quality tailoring services",
      image: "✂️"
    },
    {
      id: "campus-cab",
      name: "Campus Cab",
      category: "Transport",
      rating: 4.7,
      reviewCount: 89,
      phone: "+234 903 456 7890",
      location: "Campus Wide",
      description: "Reliable transportation around campus",
      image: "🚗"
    },
    {
      id: "tech-repair-hub",
      name: "Tech Repair Hub",
      category: "Tech Repair",
      rating: 4.5,
      reviewCount: 67,
      phone: "+234 904 567 8901",
      location: "Engineering Building",
      description: "Phone and laptop repair specialists",
      image: "📱"
    },
    {
      id: "fresh-cuts-barber",
      name: "Fresh Cuts Barber",
      category: "Barber",
      rating: 4.9,
      reviewCount: 123,
      phone: "+234 905 678 9012",
      location: "Hostel Area",
      description: "Professional haircuts and grooming",
      image: "💇‍♂️"
    },
    {
      id: "clean-laundry",
      name: "Clean Laundry Service",
      category: "Laundry",
      rating: 4.3,
      reviewCount: 45,
      phone: "+234 906 789 0123",
      location: "Residential Area",
      description: "Quick and clean laundry services",
      image: "👔"
    }
  ];

  const categories = ["all", "Food", "Fashion", "Tech Repair", "Transport", "Barber", "Laundry"];

  const filteredVendors = vendors
    .filter(vendor => 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(vendor => selectedCategory === "all" || vendor.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vendor Directory</h1>
          <p className="text-gray-600">Find and review local vendors on campus</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vendors..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{vendor.image}</div>
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {vendor.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">{vendor.description}</p>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vendor.location}
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="h-4 w-4 mr-1" />
                    {vendor.phone}
                  </div>
                  
                  <div className="pt-3">
                    <Link to={`/vendor/${vendor.id}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDirectory;
