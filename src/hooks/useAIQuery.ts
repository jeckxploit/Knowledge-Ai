import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOnlineStatus } from "./useOnlineStatus";

interface Source {
  id: string;
  title: string;
  relevance: number;
  department?: string;
  snippet: string;
}

interface AIQueryResponse {
  summary: string;
  fullAnswer: string;
  sources: Source[];
  contextSnippets: string[];
  confidenceScore: number;
  isOutOfContext: boolean;
  outOfContextReason?: string;
  processingTimeMs: number;
  completenessLevel?: "full" | "partial" | "minimal";
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  summary?: string;
  confidence?: number;
  sources?: Source[];
  contextSnippets?: string[];
  isOutOfContext?: boolean;
  outOfContextReason?: string;
  processingTimeMs?: number;
  completenessLevel?: "full" | "partial" | "minimal";
  timestamp: Date;
}

type AnswerMode = "concise" | "technical" | "executive";

export function useAIQuery() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { isOnline } = useOnlineStatus();

  const sendQuery = useCallback(async (question: string, answerMode: AnswerMode) => {
    if (!question.trim() || isLoading) return;

    // Check online status before making request
    if (!isOnline) {
      toast.error("Tidak ada koneksi internet. Fitur AI membutuhkan koneksi aktif.");
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            question,
            answerMode,
            userId: user?.id,
            sessionId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error("Terlalu banyak permintaan. Mohon tunggu sebentar.");
          throw new Error("Rate limited");
        }
        if (response.status === 402) {
          toast.error("Kredit habis. Silakan tambah kredit.");
          throw new Error("Payment required");
        }
        throw new Error(errorData.error || "Request failed");
      }

      const data: AIQueryResponse = await response.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: "assistant",
        content: data.fullAnswer,
        summary: data.summary,
        confidence: data.confidenceScore,
        sources: data.sources,
        contextSnippets: data.contextSnippets,
        isOutOfContext: data.isOutOfContext,
        outOfContextReason: data.outOfContextReason,
        processingTimeMs: data.processingTimeMs,
        completenessLevel: data.completenessLevel,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Query error:", error);
      
      // Check if it's a network error
      const isNetworkError = error instanceof TypeError && error.message === "Failed to fetch";
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: "assistant",
        content: isNetworkError 
          ? "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
          : "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.",
        confidence: 0,
        isOutOfContext: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId, isOnline]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isOnline,
    sendQuery,
    clearMessages,
    sessionId,
  };
}
