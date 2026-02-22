import { MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, Sparkles } from "lucide-react";
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

function getConfidenceBg(confidence: number) {
  if (confidence >= 80) return "bg-success/10 border-success/20 text-success";
  if (confidence >= 60) return "bg-warning/10 border-warning/20 text-warning";
  return "bg-destructive/10 border-destructive/20 text-destructive";
}

export function RecentQueries() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      {/* Enhanced Header */}
      <div className="relative p-5 border-b border-border/50 bg-gradient-to-r from-info/5 via-transparent to-primary/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-info/20 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-5 h-5 text-info" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Recent Queries</h3>
              <p className="text-sm text-muted-foreground">Latest knowledge base interactions</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:bg-primary/10">
            View All <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Query List */}
      <div className="divide-y divide-border/50">
        {mockQueries.map((query, index) => (
          <div 
            key={query.id} 
            className="group/item p-5 hover:bg-secondary/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Query Number Badge */}
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                {index + 1}
              </div>
              
              {/* Query Icon */}
              <div className={cn(
                "p-2.5 rounded-xl shrink-0 transition-all duration-300 group-hover/item:scale-110",
                query.answered ? "bg-primary/10" : "bg-muted/20"
              )}>
                <MessageSquare className={cn(
                  "w-5 h-5",
                  query.answered ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              
              {/* Query Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <p className="font-medium text-sm leading-relaxed line-clamp-2 text-foreground/90">
                  {query.question}
                </p>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Answer Status Badge */}
                  <Badge 
                    variant={query.answered ? "default" : "secondary"} 
                    className={cn(
                      "text-xs font-medium px-2.5 py-0.5 rounded-full",
                      query.answered 
                        ? "bg-success/10 text-success border border-success/20" 
                        : "bg-muted/20 text-muted-foreground border border-border/50"
                    )}
                  >
                    {query.answered ? (
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Answered
                      </span>
                    ) : (
                      "No Answer"
                    )}
                  </Badge>
                  
                  {/* Confidence Badge */}
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    getConfidenceBg(query.confidence)
                  )}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                    </svg>
                    {query.confidence}%
                  </div>
                  
                  {/* Sources */}
                  {query.sourcesCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {query.sourcesCount} sources
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Side Actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-muted-foreground font-medium">{query.timestamp}</span>
                
                {query.feedback && (
                  <div className="flex items-center gap-1">
                    {query.feedback === "positive" ? (
                      <div className="p-1.5 rounded-lg bg-success/10">
                        <ThumbsUp className="w-4 h-4 text-success" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-destructive/10">
                        <ThumbsDown className="w-4 h-4 text-destructive" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
