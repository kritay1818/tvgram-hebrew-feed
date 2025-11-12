import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getAnonSessionId } from "@/lib/session";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

interface CategoryPollProps {
  categoryId: string;
}

const CategoryPoll = ({ categoryId }: CategoryPollProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const sessionId = getAnonSessionId();

  // Fetch active poll for this category
  const { data: poll } = useQuery({
    queryKey: ["category-poll", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_polls")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      
      // Check if poll has ended
      if (data && data.ends_at && new Date(data.ends_at) < new Date()) {
        return null;
      }
      
      return data;
    },
  });

  // Fetch poll options
  const { data: options } = useQuery({
    queryKey: ["poll-options", poll?.id],
    enabled: !!poll,
    queryFn: async () => {
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

      // Count votes per option
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
        description: "אנא בחר לפחות אפשרות אחת",
        variant: "destructive",
      });
      return;
    }
    voteMutation.mutate(selectedOptions);
  };

  const toggleOption = (optionId: string) => {
    if (poll?.allow_multiple) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  if (!poll || !options) return null;

  const hasVoted = userVote && userVote.length > 0;
  const totalVotes = voteCounts ? Object.values(voteCounts).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">סקר השבוע</h2>
        <h3 className="text-xl font-semibold text-foreground">{poll.title}</h3>
        {poll.description && (
          <p className="mt-2 text-muted-foreground">{poll.description}</p>
        )}
      </div>

      {hasVoted ? (
        // Show results
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            סה"כ הצביעו: {totalVotes}
          </p>
          {options.map((option) => {
            const votes = voteCounts?.[option.id] || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            const isUserChoice = userVote?.some((v) => v.option_id === option.id);

            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{option.option_text}</span>
                    {isUserChoice && (
                      <CheckCircle2 size={16} className="text-primary" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {percentage}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">{votes} קולות</p>
              </div>
            );
          })}
        </div>
      ) : (
        // Show voting interface
        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`w-full rounded-lg border-2 p-4 text-right transition-all ${
                selectedOptions.includes(option.id)
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <span className="text-foreground">{option.option_text}</span>
            </button>
          ))}

          {poll.allow_multiple && (
            <p className="text-sm text-muted-foreground">
              ניתן לבחור יותר מאפשרות אחת
            </p>
          )}

          <Button
            onClick={handleVote}
            disabled={voteMutation.isPending}
            className="w-full"
          >
            {voteMutation.isPending ? "שולח..." : "הצבע"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPoll;
