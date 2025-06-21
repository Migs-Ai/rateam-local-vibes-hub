
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import UserManagement from "@/components/admin/UserManagement";
import VendorManagement from "@/components/admin/VendorManagement";
import ReviewManagement from "@/components/admin/ReviewManagement";
import PollManagement from "@/components/admin/PollManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { Users, Store, MessageSquare, BarChart3, Folder, Activity } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalReviews: number;
  totalPolls: number;
  pendingVendors: number;
  pendingReviews: number;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalReviews: 0,
    totalPolls: 0,
    pendingVendors: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin) {
      fetchDashboardStats();
    }
  }, [user, isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      const [usersResult, vendorsResult, reviewsResult, pollsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('vendors').select('id, status', { count: 'exact' }),
        supabase.from('reviews').select('id, status', { count: 'exact' }),
        supabase.from('polls').select('id', { count: 'exact' })
      ]);

      const pendingVendors = vendorsResult.data?.filter(v => v.status === 'pending').length || 0;
      const pendingReviews = reviewsResult.data?.filter(r => r.status === 'pending').length || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalVendors: vendorsResult.count || 0,
        totalReviews: reviewsResult.count || 0,
        totalPolls: pollsResult.count || 0,
        pendingVendors,
        pendingReviews,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Complete platform management and analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVendors}</div>
              {stats.pendingVendors > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {stats.pendingVendors} pending
                </Badge>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              {stats.pendingReviews > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {stats.pendingReviews} pending
                </Badge>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPolls}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="polls" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Polls
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorManagement onStatsUpdate={fetchDashboardStats} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement onStatsUpdate={fetchDashboardStats} />
          </TabsContent>

          <TabsContent value="polls">
            <PollManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
