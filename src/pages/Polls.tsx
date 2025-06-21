
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  votes: Record<string, number>;
  status: string;
  created_at: string;
  ends_at: string;
}

const Polls = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPolls();
    if (user) {
      fetchUserVotes();
    }
  }, [user]);

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Transform the data to match our Poll interface
        const transformedData = data.map(poll => ({
          ...poll,
          options: Array.isArray(poll.options) ? (poll.options as string[]) : [],
          votes: poll.votes && typeof poll.votes === 'object' ? poll.votes as Record<string, number> : {}
        }));
        setPolls(transformedData);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('poll_votes')
        .select('poll_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setVotedPolls(new Set(data.map(vote => vote.poll_id)));
      }
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on polls.",
        variant: "destructive",
      });
      return;
    }

    if (votedPolls.has(pollId)) {
      toast({
        title: "Already voted",
        description: "You have already voted on this poll.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Record the vote
      const { error: voteError } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user.id,
          option_index: optionIndex
        });

      if (voteError) {
        toast({
          title: "Error voting",
          description: voteError.message,
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setVotedPolls(prev => new Set([...prev, pollId]));
      
      toast({
        title: "Vote recorded",
        description: "Thank you for participating in the poll!",
      });

      // Refresh polls to show updated vote counts
      fetchPolls();
    } catch (error) {
      toast({
        title: "Error voting",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const getTotalVotes = (poll: Poll): number => {
    return Object.values(poll.votes).reduce((sum, count) => sum + count, 0);
  };

  const getVotePercentage = (poll: Poll, optionIndex: number): number => {
    const total = getTotalVotes(poll);
    if (total === 0) return 0;
    return ((poll.votes[optionIndex] || 0) / total) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading polls...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Polls</h1>
          <p className="text-gray-600">Participate in polls and help shape the campus community.</p>
        </div>

        <div className="space-y-6">
          {polls.map((poll) => {
            const hasVoted = votedPolls.has(poll.id);
            const totalVotes = getTotalVotes(poll);
            
            return (
              <Card key={poll.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{poll.title}</CardTitle>
                      {poll.description && (
                        <p className="text-gray-600 mt-2">{poll.description}</p>
                      )}
                    </div>
                    <Badge variant={hasVoted ? "default" : "secondary"}>
                      {hasVoted ? "Voted" : "Active"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Total votes: {totalVotes}</span>
                    <span>Created: {new Date(poll.created_at).toLocaleDateString()}</span>
                    {poll.ends_at && (
                      <span>Ends: {new Date(poll.ends_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {poll.options.map((option, index) => {
                      const voteCount = poll.votes[index] || 0;
                      const percentage = getVotePercentage(poll, index);
                      
                      return (
                        <div key={index} className="space-y-2">
                          {hasVoted ? (
                            <div className="p-3 border rounded-lg bg-gray-50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{option}</span>
                                <span className="text-sm text-gray-600">
                                  {voteCount} votes ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full justify-start p-3 h-auto"
                              onClick={() => handleVote(poll.id, index)}
                            >
                              {option}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {polls.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">No active polls at the moment.</p>
                <p className="text-gray-400 mt-2">Check back later for new community polls!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Polls;
