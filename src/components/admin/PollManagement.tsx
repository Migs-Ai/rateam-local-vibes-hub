
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, BarChart3, Clock, Users } from "lucide-react";

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  votes: Record<string, number>;
  status: string;
  created_at: string;
  ends_at: string;
  created_by: string;
}

const PollManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: "",
    description: "",
    options: ["", ""],
    duration: "7", // days
    featured: false
  });

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(poll => ({
        ...poll,
        options: Array.isArray(poll.options) ? (poll.options as string[]) : [],
        votes: poll.votes && typeof poll.votes === 'object' ? poll.votes as Record<string, number> : {}
      })) || [];

      setPolls(transformedData);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: "Error",
        description: "Failed to load polls",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPoll = async () => {
    if (!newPoll.title || newPoll.options.filter(opt => opt.trim()).length < 2) {
      toast({
        title: "Invalid poll",
        description: "Please provide a title and at least 2 options.",
        variant: "destructive",
      });
      return;
    }

    try {
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + parseInt(newPoll.duration));

      const { error } = await supabase
        .from('polls')
        .insert({
          title: newPoll.title,
          description: newPoll.description,
          options: newPoll.options.filter(opt => opt.trim()),
          ends_at: endsAt.toISOString(),
          created_by: user?.id,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Poll created successfully",
      });

      setNewPoll({
        title: "",
        description: "",
        options: ["", ""],
        duration: "7",
        featured: false
      });
      setCreateDialogOpen(false);
      fetchPolls();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create poll",
        variant: "destructive",
      });
    }
  };

  const closePoll = async (pollId: string) => {
    try {
      const { error } = await supabase
        .from('polls')
        .update({ status: 'closed' })
        .eq('id', pollId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Poll closed successfully",
      });

      fetchPolls();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close poll",
        variant: "destructive",
      });
    }
  };

  const deletePoll = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete poll votes first
      await supabase.from('poll_votes').delete().eq('poll_id', pollId);
      
      // Then delete the poll
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Poll deleted successfully",
      });

      fetchPolls();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete poll",
        variant: "destructive",
      });
    }
  };

  const addOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, ""]
    });
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({
      ...newPoll,
      options: updatedOptions
    });
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      const updatedOptions = newPoll.options.filter((_, i) => i !== index);
      setNewPoll({
        ...newPoll,
        options: updatedOptions
      });
    }
  };

  const getTotalVotes = (poll: Poll): number => {
    return Object.values(poll.votes).reduce((sum, count) => sum + count, 0);
  };

  const getStatusBadge = (status: string, endsAt: string) => {
    const now = new Date();
    const endDate = new Date(endsAt);
    
    if (status === 'closed' || (endsAt && now > endDate)) {
      return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
    }
    
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading polls...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Poll Management
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Poll</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Poll Title</Label>
                    <Input
                      id="title"
                      value={newPoll.title}
                      onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                      placeholder="Best Coffee Shop in FUNAAB"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newPoll.description}
                      onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                      placeholder="Vote for your favorite coffee spot on campus!"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Poll Options</Label>
                    <div className="space-y-3 mt-2">
                      {newPoll.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                          />
                          {newPoll.options.length > 2 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="mt-3"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="duration">Poll Duration</Label>
                    <Select value={newPoll.duration} onValueChange={(value) => setNewPoll({ ...newPoll, duration: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="14">2 Weeks</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={createPoll} className="bg-green-600 hover:bg-green-700">
                      Create Poll
                    </Button>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Votes</TableHead>
                <TableHead>Ends</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {polls.map((poll) => (
                <TableRow key={poll.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{poll.title}</div>
                      {poll.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {poll.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {poll.options.map((option, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{option}</span>
                          <span className="text-gray-500 ml-2">
                            ({poll.votes[index] || 0})
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(poll.status, poll.ends_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {getTotalVotes(poll)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {poll.ends_at ? new Date(poll.ends_at).toLocaleDateString() : 'No end date'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(poll.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {poll.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => closePoll(poll.id)}
                        >
                          Close Poll
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePoll(poll.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {polls.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No polls created yet. Create your first poll to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PollManagement;
