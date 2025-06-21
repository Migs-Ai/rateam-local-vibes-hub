
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield, Ban, Crown } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  whatsapp: string;
  roles: string[];
  review_count: number;
  poll_votes: number;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles with roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at, whatsapp');

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch review counts
      const { data: reviewCounts, error: reviewError } = await supabase
        .from('reviews')
        .select('user_id')
        .eq('status', 'approved');

      if (reviewError) throw reviewError;

      // Fetch poll vote counts
      const { data: pollVotes, error: pollError } = await supabase
        .from('poll_votes')
        .select('user_id');

      if (pollError) throw pollError;

      // Combine data
      const usersWithData = profiles?.map(profile => {
        const userRoles = roles?.filter(r => r.user_id === profile.id).map(r => r.role) || [];
        const reviewCount = reviewCounts?.filter(r => r.user_id === profile.id).length || 0;
        const pollVoteCount = pollVotes?.filter(v => v.user_id === profile.id).length || 0;

        return {
          ...profile,
          roles: userRoles,
          review_count: reviewCount,
          poll_votes: pollVoteCount,
        };
      }) || [];

      setUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User promoted to admin",
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive",
      });
    }
  };

  const removeAdminRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin role removed",
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove admin role",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Management
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Poll Votes</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.full_name || 'N/A'}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.whatsapp || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {user.roles.map(role => (
                      <Badge
                        key={role}
                        variant={role === 'admin' || role === 'super_admin' ? 'default' : 'secondary'}
                      >
                        {role}
                      </Badge>
                    ))}
                    {user.roles.length === 0 && <Badge variant="outline">user</Badge>}
                  </div>
                </TableCell>
                <TableCell>{user.review_count}</TableCell>
                <TableCell>{user.poll_votes}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {!user.roles.includes('admin') && !user.roles.includes('super_admin') ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => promoteToAdmin(user.id)}
                      >
                        <Crown className="h-4 w-4 mr-1" />
                        Make Admin
                      </Button>
                    ) : user.roles.includes('admin') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeAdminRole(user.id)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Remove Admin
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
