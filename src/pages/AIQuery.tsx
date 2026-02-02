import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Settings2, Mic, BookOpen, Trash2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIQuery } from "@/hooks/useAIQuery";
import { AIMessageCard } from "@/components/ai-query/AIMessageCard";
import { OfflineOverlay } from "@/components/pwa/OfflineOverlay";

interface AnswerMode {
  id: "concise" | "technical" | "executive";
  label: string;
  description: string;
}

const answerModes: AnswerMode[] = [
  { id: "concise", label: "Singkat", description: "Jawaban ringkas dan padat" },
  { id: "technical", label: "Teknis", description: "Penjelasan teknis detail" },
  { id: "executive", label: "Eksekutif", description: "Ringkasan tingkat tinggi" },
];

const sampleQuestions = [
  "Apa kebijakan remote work perusahaan?",
  "Bagaimana cara request akses data warehouse?",
  "Apa protokol keamanan untuk data PII?",
  "Jelaskan proses onboarding karyawan baru",
];

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
      <div className="h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              AI Query
            </h1>
            <p className="text-muted-foreground mt-1">
              Tanya apapun tentang Knowledge Base
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Answer Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
              {answerModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  title={mode.description}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    selectedMode === mode.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="icon" onClick={clearMessages} title="Hapus percakapan">
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Settings2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-card rounded-xl flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow-effect">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Tanya apapun tentang Knowledge Base</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  Dapatkan jawaban instan dengan sitasi dari dokumen, kebijakan, dan sumber perusahaan.
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-2xl">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left p-4 glass-button rounded-lg text-sm hover:border-primary/50 transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4",
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
                      <div className="max-w-2xl rounded-2xl p-4 bg-primary text-primary-foreground">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium">U</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
                </div>
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mencari di Knowledge Base...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50">
            {/* Offline Warning */}
            {!isOnline && (
              <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">
                <WifiOff className="w-4 h-4 shrink-0" />
                <span>Anda sedang offline. Fitur AI tidak tersedia.</span>
              </div>
            )}
            
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isOnline ? "Tanyakan tentang Knowledge Base..." : "Koneksi internet diperlukan..."}
                  className={cn(
                    "min-h-[56px] max-h-32 resize-none pr-12 bg-secondary/50",
                    !isOnline && "opacity-50 cursor-not-allowed"
                  )}
                  rows={1}
                  disabled={!isOnline}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={!isOnline}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={!input.trim() || isLoading || !isOnline}
                className="h-14 px-6 bg-primary hover:bg-primary/90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
