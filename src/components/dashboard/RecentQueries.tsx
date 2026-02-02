import { MessageSquare, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecentQuery {
  id: string;
  question: string;
  confidence: number;
  sourcesCount: number;
  answered: boolean;
  timestamp: string;
  feedback?: "positive" | "negative";
}

const mockQueries: RecentQuery[] = [
  {
    id: "1",
    question: "What is the company's remote work policy for international employees?",
    confidence: 94,
    sourcesCount: 3,
    answered: true,
    timestamp: "3 min ago",
    feedback: "positive",
  },
  {
    id: "2",
    question: "How do I request access to the data warehouse?",
    confidence: 87,
    sourcesCount: 2,
    answered: true,
    timestamp: "12 min ago",
  },
  {
    id: "3",
    question: "What are the security protocols for handling PII data?",
    confidence: 72,
    sourcesCount: 5,
    answered: true,
    timestamp: "25 min ago",
    feedback: "negative",
  },
  {
    id: "4",
    question: "Can you explain the new product roadmap for Q2?",
    confidence: 45,
    sourcesCount: 0,
    answered: false,
    timestamp: "1 hour ago",
  },
];

function getConfidenceColor(confidence: number) {
  if (confidence >= 80) return "text-success";
  if (confidence >= 60) return "text-warning";
  return "text-destructive";
}

export function RecentQueries() {
  return (
    <div className="glass-card rounded-xl">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Recent Queries</h3>
          <p className="text-sm text-muted-foreground">Latest knowledge base queries</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-primary">
          View All <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
      <div className="divide-y divide-border/50">
        {mockQueries.map((query) => (
          <div key={query.id} className="p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-relaxed line-clamp-2">{query.question}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={query.answered ? "default" : "secondary"} className="text-xs">
                    {query.answered ? "Answered" : "No Answer"}
                  </Badge>
                  <span className={cn("text-xs font-medium", getConfidenceColor(query.confidence))}>
                    {query.confidence}% confidence
                  </span>
                  {query.sourcesCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {query.sourcesCount} sources
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {query.feedback && (
                  query.feedback === "positive" ? (
                    <ThumbsUp className="w-4 h-4 text-success" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-destructive" />
                  )
                )}
                <span className="text-xs text-muted-foreground">{query.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
