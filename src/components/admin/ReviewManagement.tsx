
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, CheckCircle, XCircle, Flag, Edit, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  user_id: string;
  vendor_id: string;
  vendor_name: string;
  user_name: string;
}

interface ReviewManagementProps {
  onStatsUpdate: () => void;
}

const ReviewManagement = ({ onStatsUpdate }: ReviewManagementProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          vendors(business_name),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reviewsWithNames = data?.map(review => ({
        ...review,
        vendor_name: review.vendors?.business_name || 'Unknown Vendor',
        user_name: review.profiles?.full_name || 'Anonymous User'
      })) || [];

      setReviews(reviewsWithNames);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Review ${newStatus} successfully`,
      });

      fetchReviews();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive",
      });
    }
  };

  const updateReviewComment = async () => {
    if (!editingReview) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .update({ comment: editComment })
        .eq('id', editingReview.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review comment updated successfully",
      });

      setEditingReview(null);
      setEditComment("");
      fetchReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review comment",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });

      fetchReviews();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'flagged':
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Review Management
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews..."
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
              <TableHead>Vendor</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  {review.vendor_name}
                </TableCell>
                <TableCell>{review.user_name}</TableCell>
                <TableCell>
                  <div className="flex">{renderStars(review.rating)}</div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={review.comment}>
                    {review.comment || 'No comment'}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  {new Date(review.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {review.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateReviewStatus(review.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReviewStatus(review.id, 'flagged')}
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                      </>
                    )}
                    
                    {review.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReviewStatus(review.id, 'flagged')}
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Flag
                      </Button>
                    )}
                    
                    {review.status === 'flagged' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingReview(review);
                            setEditComment(review.comment || '');
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Review Comment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            placeholder="Review comment..."
                            rows={4}
                          />
                          <div className="flex gap-2">
                            <Button onClick={updateReviewComment}>
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setEditingReview(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteReview(review.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredReviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewManagement;
