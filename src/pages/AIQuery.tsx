import { useState, useRef, useEffect, memo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Settings2, BookOpen, Trash2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIQuery } from "@/hooks/useAIQuery";
import { AIMessageCard } from "@/components/ai-query/AIMessageCard";
import { AIResponseSkeleton } from "@/components/ui/page-skeleton";

interface AnswerMode {
  id: "concise" | "technical" | "executive";
  label: string;
  shortLabel: string;
  description: string;
}

const answerModes: AnswerMode[] = [
  { id: "concise", label: "Singkat", shortLabel: "Brief", description: "Jawaban ringkas dan padat" },
  { id: "technical", label: "Teknis", shortLabel: "Tech", description: "Penjelasan teknis detail" },
  { id: "executive", label: "Eksekutif", shortLabel: "Exec", description: "Ringkasan tingkat tinggi" },
];

const sampleQuestions = [
  "Apa kebijakan remote work perusahaan?",
  "Bagaimana cara request akses data warehouse?",
  "Apa protokol keamanan untuk data PII?",
  "Jelaskan proses onboarding karyawan baru",
];

// Memoized empty state for better performance
const EmptyState = memo(function EmptyState({ 
  onSelectQuestion 
}: { 
  onSelectQuestion: (q: string) => void;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 sm:mb-6 glow-effect">
        <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
      </div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Tanya apapun tentang Knowledge Base</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6 sm:mb-8">
        Dapatkan jawaban instan dengan sitasi dari dokumen, kebijakan, dan sumber perusahaan.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-2xl">
        {sampleQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="text-left p-3 sm:p-4 glass-button rounded-lg text-xs sm:text-sm hover:border-primary/50 transition-all touch-target"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
});

// Loading indicator component
const LoadingIndicator = memo(function LoadingIndicator() {
  return (
    <div className="flex gap-3 sm:gap-4 animate-fade-in">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground animate-pulse" />
      </div>
      <div className="bg-secondary/50 rounded-2xl p-3 sm:p-4 flex-1 max-w-md">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Mencari di Knowledge Base...</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default function AIQuery() {
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState<"concise" | "technical" | "executive">("concise");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, isOnline, sendQuery, clearMessages } = useAIQuery();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !isOnline) return;
    const question = input;
    setInput("");
    await sendQuery(question, selectedMode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-5rem)] sm:h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              AI Query
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              Tanya apapun tentang Knowledge Base
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Answer Mode Selector - Compact on mobile */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-secondary/50 rounded-lg">
              {answerModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  title={mode.description}
                  className={cn(
                    "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all touch-target min-h-[32px] sm:min-h-0",
                    selectedMode === mode.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="hidden sm:inline">{mode.label}</span>
                  <span className="sm:hidden">{mode.shortLabel}</span>
                </button>
              ))}
            </div>
            
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearMessages} 
                title="Hapus percakapan"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex">
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-card rounded-xl flex flex-col overflow-hidden min-h-0">
          {/* Messages - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide">
            {messages.length === 0 ? (
              <EmptyState onSelectQuestion={setInput} />
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 sm:gap-4",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "assistant" ? (
                    <AIMessageCard
                      content={message.content}
                      summary={message.summary}
                      confidence={message.confidence}
                      sources={message.sources}
                      contextSnippets={message.contextSnippets}
                      isOutOfContext={message.isOutOfContext}
                      outOfContextReason={message.outOfContextReason}
                      processingTimeMs={message.processingTimeMs}
                    />
                  ) : (
                    <>
                      <div className="max-w-[85%] sm:max-w-2xl rounded-2xl p-3 sm:p-4 bg-primary text-primary-foreground">
                        <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-xs sm:text-sm font-medium">U</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="p-2 sm:p-4 border-t border-border/50 bg-card/50">
            {/* Offline Warning */}
            {!isOnline && (
              <div className="mb-2 sm:mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs sm:text-sm">
                <WifiOff className="w-4 h-4 shrink-0" />
                <span>Anda sedang offline. Fitur AI tidak tersedia.</span>
              </div>
            )}
            
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isOnline ? "Tanyakan tentang Knowledge Base..." : "Koneksi internet diperlukan..."}
                  className={cn(
                    "min-h-[44px] sm:min-h-[56px] max-h-24 sm:max-h-32 resize-none pr-2 bg-secondary/50 text-sm",
                    !isOnline && "opacity-50 cursor-not-allowed"
                  )}
                  rows={1}
                  disabled={!isOnline}
                />
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={!input.trim() || isLoading || !isOnline}
                className="h-11 sm:h-14 px-4 sm:px-6 bg-primary hover:bg-primary/90 shrink-0"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
