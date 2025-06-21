
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  Store, 
  MessageSquare, 
  BarChart3, 
  Star,
  Calendar,
  Award
} from "lucide-react";

interface Analytics {
  totalUsers: number;
  totalVendors: number;
  totalReviews: number;
  totalPolls: number;
  averageRating: number;
  topVendors: Array<{
    id: string;
    business_name: string;
    rating: number;
    review_count: number;
    category: string;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    date: string;
  }>;
  categoryStats: Array<{
    category: string;
    vendor_count: number;
    avg_rating: number;
  }>;
}

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalVendors: 0,
    totalReviews: 0,
    totalPolls: 0,
    averageRating: 0,
    topVendors: [],
    recentActivity: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch basic counts
      const [usersResult, vendorsResult, reviewsResult, pollsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('vendors').select('id, business_name, rating, review_count, category').eq('status', 'approved'),
        supabase.from('reviews').select('id, rating').eq('status', 'approved'),
        supabase.from('polls').select('id', { count: 'exact' })
      ]);

      // Calculate average rating
      const ratings = reviewsResult.data?.map(r => r.rating) || [];
      const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

      // Get top vendors (highest rated with most reviews)
      const topVendors = (vendorsResult.data || [])
        .filter(v => v.rating && v.review_count)
        .sort((a, b) => {
          // Sort by rating first, then by review count
          if (b.rating !== a.rating) return b.rating - a.rating;
          return (b.review_count || 0) - (a.review_count || 0);
        })
        .slice(0, 5);

      // Get category statistics
      const categoryStats: { [key: string]: { count: number; totalRating: number; totalReviews: number } } = {};
      
      (vendorsResult.data || []).forEach(vendor => {
        if (!categoryStats[vendor.category]) {
          categoryStats[vendor.category] = { count: 0, totalRating: 0, totalReviews: 0 };
        }
        categoryStats[vendor.category].count++;
        if (vendor.rating && vendor.review_count) {
          categoryStats[vendor.category].totalRating += vendor.rating * vendor.review_count;
          categoryStats[vendor.category].totalReviews += vendor.review_count;
        }
      });

      const categoryStatsArray = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        vendor_count: stats.count,
        avg_rating: stats.totalReviews > 0 ? stats.totalRating / stats.totalReviews : 0
      }));

      // Mock recent activity (in a real app, you'd fetch this from an activity log)
      const recentActivity = [
        { type: "review", description: "New review posted for Mama's Kitchen", date: new Date().toISOString() },
        { type: "vendor", description: "TechFix Solutions approved", date: new Date(Date.now() - 86400000).toISOString() },
        { type: "poll", description: "Best Coffee Shop poll created", date: new Date(Date.now() - 172800000).toISOString() },
        { type: "user", description: "5 new users registered", date: new Date(Date.now() - 259200000).toISOString() },
      ];

      setAnalytics({
        totalUsers: usersResult.count || 0,
        totalVendors: vendorsResult.data?.length || 0,
        totalReviews: reviewsResult.count || 0,
        totalPolls: pollsResult.count || 0,
        averageRating,
        topVendors: topVendors || [],
        recentActivity,
        categoryStats: categoryStatsArray
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered platform users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              Approved vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Published reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Platform average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Rated Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topVendors.map((vendor, index) => (
                <div key={vendor.id} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{vendor.business_name}</span>
                    </div>
                    <div className="text-sm text-gray-500">{vendor.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{vendor.rating?.toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {vendor.review_count} reviews
                    </div>
                  </div>
                </div>
              ))}
              {analytics.topVendors.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No vendors with ratings yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryStats.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{category.category}</div>
                    <div className="text-sm text-gray-500">
                      {category.vendor_count} vendors
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">
                        {category.avg_rating > 0 ? category.avg_rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {analytics.categoryStats.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No category data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'review' ? 'bg-blue-500' :
                    activity.type === 'vendor' ? 'bg-green-500' :
                    activity.type === 'poll' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <span>{activity.description}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
