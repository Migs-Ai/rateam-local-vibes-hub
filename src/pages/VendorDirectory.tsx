
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, MapPin, Phone, Filter, Clock, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const VendorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [statusFilter, setStatusFilter] = useState("all");

  const vendors = [
    {
      id: "lions-shawarma",
      name: "Lion's Shawarma",
      category: "Food & Restaurants",
      rating: 4.9,
      reviewCount: 287,
      phone: "+234 901 234 5678",
      location: "Near Main Gate",
      description: "Best shawarma in town with authentic Lebanese taste",
      image: "🌯",
      status: "open",
      priceRange: "₦₦"
    },
    {
      id: "campus-store",
      name: "Campus Store", 
      category: "Groceries & Provisions",
      rating: 4.7,
      reviewCount: 156,
      phone: "+234 902 345 6789",
      location: "Student Village",
      description: "One-stop shop for all your daily essentials",
      image: "🛒",
      status: "open",
      priceRange: "₦"
    },
    {
      id: "quick-tailors",
      name: "Quick Tailors",
      category: "Fashion & Clothing",
      rating: 4.6,
      reviewCount: 134,
      phone: "+234 903 456 7890",
      location: "Hostel Area",
      description: "Fast and quality tailoring services",
      image: "✂️",
      status: "closed",
      priceRange: "₦₦"
    },
    {
      id: "campus-cab",
      name: "Campus Cab",
      category: "Transport & Logistics",
      rating: 4.7,
      reviewCount: 89,
      phone: "+234 904 567 8901",
      location: "Campus Wide",
      description: "Reliable transportation around campus",
      image: "🚗",
      status: "open",
      priceRange: "₦"
    },
    {
      id: "tech-repair-hub",
      name: "Tech Repair Hub",
      category: "Tech & Gadgets",
      rating: 4.5,
      reviewCount: 67,
      phone: "+234 905 678 9012",
      location: "Engineering Building",
      description: "Phone and laptop repair specialists",
      image: "📱",
      status: "open",
      priceRange: "₦₦₦"
    },
    {
      id: "fresh-cuts-barber",
      name: "Fresh Cuts Barber",
      category: "Health & Wellness",
      rating: 4.9,
      reviewCount: 123,
      phone: "+234 906 789 0123",
      location: "Hostel Area",
      description: "Professional haircuts and grooming",
      image: "💇‍♂️",
      status: "open",
      priceRange: "₦₦"
    },
    {
      id: "midnight-munchies",
      name: "Midnight Munchies",
      category: "Food & Restaurants",
      rating: 4.4,
      reviewCount: 98,
      phone: "+234 907 890 1234",
      location: "24/7 Delivery",
      description: "Late night food delivery service",
      image: "🍕",
      status: "open",
      priceRange: "₦₦"
    },
    {
      id: "study-space-cafe",
      name: "Study Space Café",
      category: "Entertainment & Hangouts",
      rating: 4.3,
      reviewCount: 76,
      phone: "+234 908 901 2345",
      location: "Library Complex",
      description: "Quiet café perfect for studying with free WiFi",
      image: "☕",
      status: "open",
      priceRange: "₦₦"
    }
  ];

  const categories = [
    "all",
    "Food & Restaurants",
    "Groceries & Provisions", 
    "Drinks & Beverages",
    "Academic & Stationery",
    "Fashion & Clothing",
    "Tech & Gadgets",
    "Hostel & Accommodation",
    "Health & Wellness",
    "Transport & Logistics",
    "Entertainment & Hangouts",
    "Miscellaneous Services"
  ];

  // Fuzzy search function
  const fuzzySearch = (text: string, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    const target = text.toLowerCase();
    
    // Direct match
    if (target.includes(term)) return true;
    
    // Check if search term characters appear in order
    let searchIndex = 0;
    for (let i = 0; i < target.length && searchIndex < term.length; i++) {
      if (target[i] === term[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === term.length;
  };

  const filteredVendors = vendors
    .filter(vendor => {
      const matchesSearch = fuzzySearch(vendor.name, searchTerm) || 
                           fuzzySearch(vendor.category, searchTerm) ||
                           fuzzySearch(vendor.description, searchTerm);
      const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
      const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
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

        {/* Enhanced Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Fuzzy search (e.g., 'sha' finds 'Shawarma')"
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open Now</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        {vendor.status === "open" ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Closed
                          </Badge>
                        )}
                      </div>
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{vendor.rating}</span>
                      <span className="text-gray-500">({vendor.reviewCount})</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">{vendor.priceRange}</span>
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
                        View Profile & Rate
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
            <p className="text-gray-600">Try adjusting your search criteria or using fuzzy search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDirectory;
