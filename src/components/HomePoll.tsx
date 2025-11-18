import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getAnonSessionId } from "@/lib/session";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface HomePollProps {
  poll: any;
}

const HomePoll = ({ poll }: HomePollProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const sessionId = getAnonSessionId();

  // Fetch poll options
  const { data: options } = useQuery({
    queryKey: ["poll-options", poll?.id],
    enabled: !!poll,
    queryFn: async () => {
      // Use the pre-fetched options if available
      if (poll?.category_poll_options) {
        return poll.category_poll_options;
      }
      
      const { data, error } = await supabase
        .from("category_poll_options")
        .select("*")
        .eq("poll_id", poll!.id)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Check if user has already voted
  const { data: userVote } = useQuery({
    queryKey: ["poll-user-vote", poll?.id, sessionId],
    enabled: !!poll,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_poll_votes")
        .select("option_id")
        .eq("poll_id", poll!.id)
        .eq("session_id", sessionId);

      if (error) throw error;
      return data;
    },
  });

  // Fetch vote counts for results
  const { data: voteCounts } = useQuery({
    queryKey: ["poll-vote-counts", poll?.id],
    enabled: !!poll && (userVote && userVote.length > 0),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_poll_votes")
        .select("option_id")
        .eq("poll_id", poll!.id);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((vote) => {
        counts[vote.option_id] = (counts[vote.option_id] || 0) + 1;
      });

      return counts;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (optionIds: string[]) => {
      const votes = optionIds.map((optionId) => ({
        poll_id: poll!.id,
        option_id: optionId,
        session_id: sessionId,
      }));

      const { error } = await supabase
        .from("category_poll_votes")
        .insert(votes);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poll-user-vote", poll?.id, sessionId] });
      queryClient.invalidateQueries({ queryKey: ["poll-vote-counts", poll?.id] });
      toast({
        title: "הקול נקלט בהצלחה",
        description: "תודה שהשתתפת בסקר",
      });
    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "כבר הצבעת בסקר זה",
        variant: "destructive",
      });
    },
  });

  const handleVote = () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "בחר אפשרות",
        description: "עליך לבחור אפשרות אחת לפחות",
        variant: "destructive",
      });
      return;
    }

    if (!poll?.allow_multiple && selectedOptions.length > 1) {
      toast({
        title: "בחירה בודדת בלבד",
        description: "ניתן לבחור אפשרות אחת בלבד",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate(selectedOptions);
  };

  const toggleOption = (optionId: string) => {
    if (!poll?.allow_multiple) {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const hasVoted = userVote && userVote.length > 0;
  const totalVotes = voteCounts
    ? Object.values(voteCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  if (!poll || !options || options.length === 0) {
    return null;
  }

  return (
    <div className="my-6 bg-card border border-border rounded-lg p-4">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground">{poll.title}</h3>
        {poll.description && (
          <p className="text-sm text-muted-foreground mt-1">{poll.description}</p>
        )}
      </div>

      {!hasVoted ? (
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`w-full text-right p-3 rounded-md border transition-colors ${
                selectedOptions.includes(option.id)
                  ? "bg-primary/10 border-primary"
                  : "bg-background border-border hover:border-primary/50"
              }`}
            >
              <span className="text-sm font-medium">{option.option_text}</span>
            </button>
          ))}
          <Button
            onClick={handleVote}
            disabled={voteMutation.isPending}
            className="w-full mt-3"
          >
            {voteMutation.isPending ? "שולח..." : "הצבע"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option) => {
            const votes = voteCounts?.[option.id] || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{option.option_text}</span>
                  <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePoll;
