
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, CheckCircle, XCircle, Pause, Play, Star } from "lucide-react";

interface Vendor {
  id: string;
  business_name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  rating: number;
  review_count: number;
  created_at: string;
}

interface VendorManagementProps {
  onStatsUpdate: () => void;
}

const VendorManagement = ({ onStatsUpdate }: VendorManagementProps) => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVendorStatus = async (vendorId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status: newStatus })
        .eq('id', vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Vendor ${newStatus} successfully`,
      });

      fetchVendors();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vendor status",
        variant: "destructive",
      });
    }
  };

  const deleteVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });

      fetchVendors();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vendors...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Vendor Management
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">
                  {vendor.business_name}
                </TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{vendor.email}</div>
                    <div className="text-gray-500">{vendor.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{vendor.location}</TableCell>
                <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {vendor.rating?.toFixed(1) || '0.0'}
                  </div>
                </TableCell>
                <TableCell>{vendor.review_count || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {vendor.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateVendorStatus(vendor.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateVendorStatus(vendor.id, 'suspended')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {vendor.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateVendorStatus(vendor.id, 'suspended')}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                    
                    {vendor.status === 'suspended' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateVendorStatus(vendor.id, 'approved')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Reactivate
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVendor(vendor.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredVendors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No vendors found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorManagement;
