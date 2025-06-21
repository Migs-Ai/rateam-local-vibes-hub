import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Plus, Trash2 } from "lucide-react";

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  status: string;
  created_at: string;
  ends_at: string;
}

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPoll, setNewPoll] = useState({
    title: "",
    description: "",
    options: ["", ""],
    endsAt: ""
  });

  useEffect(() => {
    if (user && isAdmin) {
      fetchPolls();
    }
  }, [user, isAdmin]);

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching polls:', error);
      } else {
        setPolls(data || []);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPoll.title || newPoll.options.filter(opt => opt.trim()).length < 2) {
      toast({
        title: "Invalid poll",
        description: "Please provide a title and at least 2 options.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('polls')
        .insert({
          title: newPoll.title,
          description: newPoll.description,
          options: newPoll.options.filter(opt => opt.trim()),
          ends_at: newPoll.endsAt || null,
          created_by: user?.id,
          status: 'active'
        });

      if (error) {
        toast({
          title: "Error creating poll",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Poll created",
          description: "New poll has been created successfully.",
        });
        setNewPoll({
          title: "",
          description: "",
          options: ["", ""],
          endsAt: ""
        });
        fetchPolls();
      }
    } catch (error) {
      toast({
        title: "Error creating poll",
        description: "An unexpected error occurred.",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-gray-600">Manage polls and platform content.</p>
        </div>

        {/* Create New Poll */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Poll</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePoll} className="space-y-6">
              <div>
                <Label htmlFor="title">Poll Title</Label>
                <Input
                  id="title"
                  value={newPoll.title}
                  onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                  placeholder="Best Vendor of the Month"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newPoll.description}
                  onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                  placeholder="Vote for your favorite vendor this month!"
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
                        required
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
                <Label htmlFor="endsAt">End Date (Optional)</Label>
                <Input
                  id="endsAt"
                  type="datetime-local"
                  value={newPoll.endsAt}
                  onChange={(e) => setNewPoll({ ...newPoll, endsAt: e.target.value })}
                />
              </div>

              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Create Poll
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Polls */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Polls ({polls.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {polls.map((poll) => (
                <div key={poll.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{poll.title}</h3>
                      {poll.description && (
                        <p className="text-gray-600 mt-1">{poll.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Status: {poll.status}</span>
                        <span>Created: {new Date(poll.created_at).toLocaleDateString()}</span>
                        {poll.ends_at && (
                          <span>Ends: {new Date(poll.ends_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-sm">Options:</h4>
                    <ul className="mt-1 text-sm text-gray-600">
                      {poll.options.map((option, index) => (
                        <li key={index}>• {option}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              {polls.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No polls created yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
