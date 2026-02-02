import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Settings2,
  Mic,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  confidence?: number;
  sources?: { title: string; relevance: number }[];
  timestamp: Date;
}

interface AnswerMode {
  id: string;
  label: string;
  description: string;
}

const answerModes: AnswerMode[] = [
  { id: "concise", label: "Concise", description: "Brief, to-the-point answers" },
  { id: "technical", label: "Technical", description: "Detailed technical explanations" },
  { id: "executive", label: "Executive", description: "High-level summaries" },
];

const sampleQuestions = [
  "What is our company's data retention policy?",
  "How do I request access to production systems?",
  "What are the security requirements for handling customer data?",
  "Explain the onboarding process for new engineers",
];

export default function AIQuery() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("concise");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Based on the knowledge base, here's what I found regarding your question:\n\n**Summary:**\nThe company's policy on this matter is clearly documented in the Employee Handbook (Section 4.2) and the IT Security Guidelines.\n\n**Key Points:**\n1. All requests must go through the official ticketing system\n2. Approval is required from your direct manager\n3. Processing time is typically 2-3 business days\n\n**Additional Context:**\nFor sensitive operations, additional security clearance may be required. Please consult with the IT Security team if you have specific concerns.`,
        confidence: 92,
        sources: [
          { title: "Employee Handbook v3.2", relevance: 95 },
          { title: "IT Security Guidelines 2024", relevance: 87 },
          { title: "Access Control Policy", relevance: 72 },
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
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
              Ask questions about your knowledge base
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Answer Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
              {answerModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
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
                <h2 className="text-xl font-semibold mb-2">Ask anything about your knowledge base</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  Get instant answers with citations from your company's documents, policies, and resources.
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
                  {message.type === "assistant" && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-2xl rounded-2xl p-4",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50"
                    )}
                  >
                    <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
                      {message.content}
                    </div>

                    {message.type === "assistant" && (
                      <>
                        {/* Confidence */}
                        {message.confidence && (
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">Confidence:</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                message.confidence >= 80 && "badge-success",
                                message.confidence >= 60 && message.confidence < 80 && "badge-warning",
                                message.confidence < 60 && "badge-destructive"
                              )}
                            >
                              {message.confidence}%
                            </Badge>
                          </div>
                        )}

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.sources.map((source, index) => (
                                <button
                                  key={index}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary/50 rounded-lg text-xs hover:bg-secondary transition-colors"
                                >
                                  <FileText className="w-3 h-3" />
                                  {source.title}
                                  <span className="text-muted-foreground">({source.relevance}%)</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4">
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Regenerate
                          </Button>
                          <div className="flex-1" />
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  {message.type === "user" && (
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">AD</span>
                    </div>
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
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your knowledge base..."
                  className="min-h-[56px] max-h-32 resize-none pr-12 bg-secondary/50"
                  rows={1}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={!input.trim() || isLoading}
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
