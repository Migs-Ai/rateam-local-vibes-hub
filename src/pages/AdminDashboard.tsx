
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import UserManagement from "@/components/admin/UserManagement";
import VendorManagement from "@/components/admin/VendorManagement";
import ReviewManagement from "@/components/admin/ReviewManagement";
import PollManagement from "@/components/admin/PollManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import AdminStatsOverview from "@/components/admin/AdminStatsOverview";
import AdminTabsNavigation from "@/components/admin/AdminTabsNavigation";
import { useAdminStats } from "@/hooks/useAdminStats";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading, fetchDashboardStats } = useAdminStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-red-600">Access denied. Admin privileges required.</div>
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

        <AdminStatsOverview stats={stats} />

        <Tabs defaultValue="analytics" className="space-y-4">
          <AdminTabsNavigation />

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
