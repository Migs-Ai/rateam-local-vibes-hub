
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Polls = () => {
  const { toast } = useToast();
  const [votedPolls, setVotedPolls] = useState<string[]>([]);

  const polls = [
    {
      id: "1",
      title: "Best Food Vendor of the Month",
      description: "Vote for your favorite food vendor on campus this month!",
      endDate: "2024-01-31",
      totalVotes: 1247,
      status: "active",
      options: [
        { id: "1a", name: "Mama's Kitchen", votes: 456, percentage: 37 },
        { id: "1b", name: "Campus Cafeteria", votes: 312, percentage: 25 },
        { id: "1c", name: "Quick Bites", votes: 289, percentage: 23 },
        { id: "1d", name: "Student Lounge", votes: 190, percentage: 15 }
      ]
    },
    {
      id: "2",
      title: "Most Improved Vendor",
      description: "Which vendor has shown the most improvement in service quality?",
      endDate: "2024-02-15",
      totalVotes: 834,
      status: "active",
      options: [
        { id: "2a", name: "Tech Repair Hub", votes: 298, percentage: 36 },
        { id: "2b", name: "Quick Tailors", votes: 234, percentage: 28 },
        { id: "2c", name: "Campus Cab", votes: 187, percentage: 22 },
        { id: "2d", name: "Fresh Cuts Barber", votes: 115, percentage: 14 }
      ]
    },
    {
      id: "3",
      title: "Best Customer Service",
      description: "Vote for the vendor with the best customer service experience.",
      endDate: "2024-01-25",
      totalVotes: 956,
      status: "active",
      options: [
        { id: "3a", name: "Fresh Cuts Barber", votes: 387, percentage: 40 },
        { id: "3b", name: "Clean Laundry Service", votes: 276, percentage: 29 },
        { id: "3c", name: "Mama's Kitchen", votes: 193, percentage: 20 },
        { id: "3d", name: "Campus Cab", votes: 100, percentage: 11 }
      ]
    },
    {
      id: "4",
      title: "December Winner: Best Overall Vendor",
      description: "Results from last month's poll for the best overall vendor.",
      endDate: "2023-12-31",
      totalVotes: 2143,
      status: "ended",
      winner: "Mama's Kitchen",
      options: [
        { id: "4a", name: "Mama's Kitchen", votes: 856, percentage: 40 },
        { id: "4b", name: "Fresh Cuts Barber", votes: 642, percentage: 30 },
        { id: "4c", name: "Tech Repair Hub", votes: 429, percentage: 20 },
        { id: "4d", name: "Quick Tailors", votes: 216, percentage: 10 }
      ]
    }
  ];

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPolls.includes(pollId)) {
      toast({
        title: "Already voted",
        description: "You've already voted in this poll.",
        variant: "destructive",
      });
      return;
    }

    // Mock vote submission
    setVotedPolls([...votedPolls, pollId]);
    
    toast({
      title: "Vote submitted!",
      description: "Thank you for participating in the poll.",
    });
  };

  const isActive = (endDate: string) => {
    return new Date(endDate) > new Date();
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Polls</h1>
          <p className="text-gray-600">Vote for your favorite vendors and see what the community thinks!</p>
        </div>

        {/* Active Polls */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-green-600" />
            Active Polls
          </h2>
          
          <div className="space-y-6">
            {polls.filter(poll => poll.status === "active").map((poll) => (
              <Card key={poll.id} className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{poll.title}</CardTitle>
                      <p className="text-gray-600 mt-2">{poll.description}</p>
                    </div>
                    <Badge variant={isActive(poll.endDate) ? "default" : "secondary"}>
                      {isActive(poll.endDate) ? "Active" : "Ended"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {poll.totalVotes} votes
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {isActive(poll.endDate) 
                        ? `${getDaysRemaining(poll.endDate)} days left`
                        : "Ended"
                      }
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {poll.options.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.name}</span>
                          <span className="text-sm text-gray-600">
                            {option.votes} votes ({option.percentage}%)
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Progress value={option.percentage} className="flex-1" />
                          {isActive(poll.endDate) && !votedPolls.includes(poll.id) && (
                            <Button
                              size="sm"
                              onClick={() => handleVote(poll.id, option.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Vote
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {votedPolls.includes(poll.id) && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        ✓ You've voted in this poll. Thank you for participating!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Winners */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
            Past Winners
          </h2>
          
          <div className="space-y-6">
            {polls.filter(poll => poll.status === "ended").map((poll) => (
              <Card key={poll.id} className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                        {poll.title}
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{poll.description}</p>
                      {poll.winner && (
                        <div className="mt-3">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            Winner: {poll.winner}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {poll.totalVotes} votes
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Ended {poll.endDate}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {poll.options.map((option, index) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {index === 0 && <Trophy className="h-4 w-4 text-yellow-500 mr-2" />}
                            <span className={`font-medium ${index === 0 ? 'text-yellow-700' : ''}`}>
                              {option.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {option.votes} votes ({option.percentage}%)
                          </span>
                        </div>
                        <Progress value={option.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Polls;
