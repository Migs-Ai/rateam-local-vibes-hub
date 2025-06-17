
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Store, MessageSquare, Flag, Search, Trash2, Eye, Ban, CheckCircle, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const AdminPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock admin stats
  const stats = {
    totalUsers: 1247,
    totalVendors: 89,
    totalReviews: 3456,
    flaggedReviews: 12,
    newUsersThisWeek: 156,
    newVendorsThisWeek: 7
  };

  // Mock users data
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@email.com",
      joinDate: "2024-01-15",
      reviewsCount: 23,
      status: "active",
      avatar: "JD"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      joinDate: "2024-01-10",
      reviewsCount: 45,
      status: "active",
      avatar: "SJ"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@email.com",
      joinDate: "2024-01-08",
      reviewsCount: 12,
      status: "suspended",
      avatar: "MC"
    }
  ];

  // Mock vendors data
  const vendors = [
    {
      id: "1",
      businessName: "Mama's Kitchen",
      category: "Food",
      email: "mama@kitchen.com",
      joinDate: "2024-01-01",
      rating: 4.8,
      reviewsCount: 234,
      status: "active"
    },
    {
      id: "2",
      businessName: "Quick Tailors",
      category: "Fashion",
      email: "quick@tailors.com",
      joinDate: "2024-01-05",
      rating: 4.6,
      reviewsCount: 156,
      status: "active"
    },
    {
      id: "3",
      businessName: "Tech Repair Hub",
      category: "Tech Repair",
      email: "tech@repair.com",
      joinDate: "2024-01-12",
      rating: 4.5,
      reviewsCount: 67,
      status: "pending"
    }
  ];

  // Mock flagged reviews
  const flaggedReviews = [
    {
      id: "1",
      reviewer: "Anonymous User",
      vendor: "Mama's Kitchen",
      rating: 1,
      comment: "This is spam content with inappropriate language...",
      flagReason: "Inappropriate content",
      flaggedBy: "User123",
      date: "2024-01-15",
      status: "pending"
    },
    {
      id: "2",
      reviewer: "John Doe",
      vendor: "Quick Tailors",
      rating: 1,
      comment: "Fake review posted by competitor...",
      flagReason: "Fake review",
      flaggedBy: "VendorReport",
      date: "2024-01-14",
      status: "pending"
    }
  ];

  const handleUserAction = (userId: string, action: string) => {
    toast({
      title: `User ${action}`,
      description: `User has been ${action.toLowerCase()} successfully.`,
    });
  };

  const handleVendorAction = (vendorId: string, action: string) => {
    toast({
      title: `Vendor ${action}`,
      description: `Vendor has been ${action.toLowerCase()} successfully.`,
    });
  };

  const handleReviewAction = (reviewId: string, action: string) => {
    toast({
      title: `Review ${action}`,
      description: `Review has been ${action.toLowerCase()} successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-gray-600">Manage users, vendors, and content on RateAm.com</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Vendors</p>
                  <p className="text-xl font-bold">{stats.totalVendors}</p>
                </div>
                <Store className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-xl font-bold">{stats.totalReviews}</p>
                </div>
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flagged Reviews</p>
                  <p className="text-xl font-bold text-red-600">{stats.flaggedReviews}</p>
                </div>
                <Flag className="h-6 w-6 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Users</p>
                  <p className="text-xl font-bold">{stats.newUsersThisWeek}</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
                <BarChart3 className="h-6 w-6 text-indigo-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Vendors</p>
                  <p className="text-xl font-bold">{stats.newVendorsThisWeek}</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
                <BarChart3 className="h-6 w-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="reviews">Flagged Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined: {user.joinDate} • {user.reviewsCount} reviews
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {user.status === "active" ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-orange-600">
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Suspend User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to suspend {user.name}? They will not be able to post reviews while suspended.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleUserAction(user.id, "Suspended")}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    Suspend
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600"
                              onClick={() => handleUserAction(user.id, "Activated")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete {user.name}'s account and all their reviews.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleUserAction(user.id, "Deleted")}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{vendor.businessName}</h4>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                        <p className="text-xs text-gray-500">
                          {vendor.category} • Joined: {vendor.joinDate} • Rating: {vendor.rating} ({vendor.reviewsCount} reviews)
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant={vendor.status === "active" ? "default" : vendor.status === "pending" ? "secondary" : "destructive"}>
                          {vendor.status}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {vendor.status === "pending" && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleVendorAction(vendor.id, "Approved")}
                            >
                              Approve
                            </Button>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {vendor.businessName} and all associated reviews.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleVendorAction(vendor.id, "Deleted")}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flagged Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Reviews</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {flaggedReviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-red-800">{review.reviewer} → {review.vendor}</h4>
                          <p className="text-sm text-red-600">
                            Flagged for: {review.flagReason} • By: {review.flaggedBy} • {review.date}
                          </p>
                        </div>
                        <Badge variant="destructive">Flagged</Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-4 p-3 bg-white rounded border">
                        "{review.comment}"
                      </p>
                      
                      <div className="flex space-x-3">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleReviewAction(review.id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReviewAction(review.id, "Removed")}
                        >
                          Remove
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Reviewer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600">Detailed analytics and reporting features coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
