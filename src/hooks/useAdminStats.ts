
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalReviews: number;
  totalPolls: number;
  pendingVendors: number;
  pendingReviews: number;
}

export const useAdminStats = () => {
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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return { stats, loading, fetchDashboardStats };
};
