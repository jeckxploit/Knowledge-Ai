import { useState } from "react";
import { Sparkles, FileText, ExternalLink, Copy, ThumbsUp, ThumbsDown, RefreshCw, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { TrustIndicators } from "./TrustIndicators";

interface Source {
  id: string;
  title: string;
  relevance: number;
  department?: string;
  snippet: string;
}

interface AIMessageCardProps {
  content: string;
  summary?: string;
  confidence?: number;
  sources?: Source[];
  contextSnippets?: string[];
  isOutOfContext?: boolean;
  outOfContextReason?: string;
  processingTimeMs?: number;
  completenessLevel?: "full" | "partial" | "minimal";
  onRegenerate?: () => void;
}

function getConfidenceBadgeClass(confidence: number) {
  if (confidence >= 80) return "bg-success/20 text-success border-success/30";
  if (confidence >= 60) return "bg-warning/20 text-warning border-warning/30";
  return "bg-destructive/20 text-destructive border-destructive/30";
}

export function AIMessageCard({
  content,
  summary,
  confidence = 0,
  sources = [],
  contextSnippets = [],
  isOutOfContext,
  outOfContextReason,
  processingTimeMs,
  completenessLevel,
  onRegenerate,
}: AIMessageCardProps) {
  // Determine completeness level based on confidence and sources
  const determineCompleteness = (): "full" | "partial" | "minimal" => {
    if (completenessLevel) return completenessLevel;
    if (isOutOfContext) return "minimal";
    if (confidence >= 70 && sources.length >= 2) return "full";
    if (confidence >= 40 || sources.length >= 1) return "partial";
    return "minimal";
  };
  const [showContext, setShowContext] = useState(false);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Jawaban disalin ke clipboard");
  };

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    toast.success(type === "positive" ? "Terima kasih atas feedback positif!" : "Feedback dicatat untuk perbaikan");
  };

  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="flex-1 max-w-3xl">
        {/* Out of Context Warning */}
        {isOutOfContext && (
          <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Di Luar Cakupan Knowledge Base</p>
              {outOfContextReason && (
                <p className="text-xs text-muted-foreground mt-1">{outOfContextReason}</p>
              )}
            </div>
          </div>
        )}

        {/* Summary Section */}
        {summary && !isOutOfContext && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1 font-medium">📋 Ringkasan</p>
            <p className="text-sm">{summary}</p>
          </div>
        )}

        {/* Main Answer */}
        <div className="bg-secondary/50 rounded-2xl p-4">
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Trust Indicators */}
        {!isOutOfContext && (
          <div className="mt-4">
            <TrustIndicators
              confidence={confidence}
              sourcesCount={sources.length}
              isOutOfContext={isOutOfContext}
              completenessLevel={determineCompleteness()}
            />
          </div>
        )}

        {/* Metadata Bar */}
        {!isOutOfContext && (
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Processing Time */}
            {processingTimeMs && (
              <span className="text-xs text-muted-foreground">
                ⏱ {(processingTimeMs / 1000).toFixed(2)}s
              </span>
            )}
          </div>
        )}

        {/* Sources Section */}
        {sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3 font-medium">📚 Sumber Dokumen</p>
            <div className="space-y-2">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{source.title}</span>
                      <Badge variant="outline" className={cn("text-xs", getConfidenceBadgeClass(source.relevance))}>
                        {source.relevance}% relevan
                      </Badge>
                    </div>
                    {source.department && (
                      <span className="text-xs text-muted-foreground">{source.department}</span>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      "{source.snippet}"
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Snippets (Collapsible) */}
        {contextSnippets.length > 0 && (
          <Collapsible open={showContext} onOpenChange={setShowContext} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
                {showContext ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Lihat Konteks yang Digunakan ({contextSnippets.length})
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {contextSnippets.map((snippet, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border/30">
                  <p className="text-xs text-muted-foreground italic">"{snippet}"</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleCopy}>
            <Copy className="w-3 h-3 mr-1" />
            Salin
          </Button>
          {onRegenerate && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onRegenerate}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Regenerate
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", feedback === "positive" && "text-success")}
            onClick={() => handleFeedback("positive")}
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", feedback === "negative" && "text-destructive")}
            onClick={() => handleFeedback("negative")}
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
