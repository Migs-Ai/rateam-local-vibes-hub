import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

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
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Transform the data to match our Poll interface
        const transformedData = data.map(poll => ({
          ...poll,
          options: Array.isArray(poll.options) ? poll.options : [],
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
        .select('poll_id, option_index')
        .eq('user_id', user.id);

      if (!error && data) {
        const votesMap: Record<string, number> = {};
        data.forEach(vote => {
          votesMap[vote.poll_id] = vote.option_index;
        });
        setUserVotes(votesMap);
      }
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to vote.",
        variant: "destructive",
      });
      return;
    }

    if (userVotes[pollId] !== undefined) {
      toast({
        title: "Already voted",
        description: "You've already voted in this poll.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert vote
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

      // Update poll votes count
      const poll = polls.find(p => p.id === pollId);
      if (poll) {
        const updatedVotes = { ...poll.votes };
        updatedVotes[optionIndex.toString()] = (updatedVotes[optionIndex.toString()] || 0) + 1;

        const { error: updateError } = await supabase
          .from('polls')
          .update({ votes: updatedVotes })
          .eq('id', pollId);

        if (!updateError) {
          setUserVotes({ ...userVotes, [pollId]: optionIndex });
          fetchPolls(); // Refresh polls data
          
          toast({
            title: "Vote submitted!",
            description: "Thank you for participating in the poll.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error voting",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const isActive = (poll: Poll) => {
    if (poll.status !== 'active') return false;
    if (!poll.ends_at) return true;
    return new Date(poll.ends_at) > new Date();
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalVotes = (votes: Record<string, number>) => {
    return Object.values(votes).reduce((sum, count) => sum + count, 0);
  };

  const getOptionPercentage = (optionIndex: number, votes: Record<string, number>) => {
    const totalVotes = getTotalVotes(votes);
    if (totalVotes === 0) return 0;
    return Math.round(((votes[optionIndex.toString()] || 0) / totalVotes) * 100);
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

  const activePolls = polls.filter(poll => isActive(poll));
  const endedPolls = polls.filter(poll => !isActive(poll));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Polls</h1>
          <p className="text-gray-600">Vote for your favorite vendors and see what the community thinks!</p>
        </div>

        {/* Active Polls */}
        {activePolls.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-green-600" />
              Active Polls
            </h2>
            
            <div className="space-y-6">
              {activePolls.map((poll) => {
                const totalVotes = getTotalVotes(poll.votes || {});
                const hasVoted = userVotes[poll.id] !== undefined;
                
                return (
                  <Card key={poll.id} className="shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{poll.title}</CardTitle>
                          {poll.description && (
                            <p className="text-gray-600 mt-2">{poll.description}</p>
                          )}
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {totalVotes} votes
                        </div>
                        {poll.ends_at && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {getDaysRemaining(poll.ends_at)} days left
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {poll.options.map((option, index) => {
                          const voteCount = poll.votes?.[index.toString()] || 0;
                          const percentage = getOptionPercentage(index, poll.votes || {});
                          const isUserChoice = userVotes[poll.id] === index;
                          
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`font-medium ${isUserChoice ? 'text-green-600' : ''}`}>
                                  {option} {isUserChoice && '✓'}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {voteCount} votes ({percentage}%)
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Progress value={percentage} className="flex-1" />
                                {!hasVoted && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleVote(poll.id, index)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Vote
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {hasVoted && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">
                            ✓ You've voted in this poll. Thank you for participating!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Winners */}
        {endedPolls.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
              Past Results
            </h2>
            
            <div className="space-y-6">
              {endedPolls.map((poll) => {
                const totalVotes = getTotalVotes(poll.votes || {});
                let winnerIndex = 0;
                let maxVotes = 0;
                
                // Find the winning option
                Object.entries(poll.votes || {}).forEach(([index, votes]) => {
                  if (votes > maxVotes) {
                    maxVotes = votes;
                    winnerIndex = parseInt(index);
                  }
                });
                
                return (
                  <Card key={poll.id} className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                            {poll.title}
                          </CardTitle>
                          {poll.description && (
                            <p className="text-gray-600 mt-2">{poll.description}</p>
                          )}
                          <div className="mt-3">
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              Winner: {poll.options[winnerIndex]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {totalVotes} votes
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Ended {poll.ends_at ? new Date(poll.ends_at).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {poll.options.map((option, index) => {
                          const voteCount = poll.votes?.[index.toString()] || 0;
                          const percentage = getOptionPercentage(index, poll.votes || {});
                          const isWinner = index === winnerIndex;
                          
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {isWinner && <Trophy className="h-4 w-4 text-yellow-500 mr-2" />}
                                  <span className={`font-medium ${isWinner ? 'text-yellow-700' : ''}`}>
                                    {option}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                  {voteCount} votes ({percentage}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {polls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No polls available</h3>
            <p className="text-gray-600">Check back later for community polls!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Polls;
