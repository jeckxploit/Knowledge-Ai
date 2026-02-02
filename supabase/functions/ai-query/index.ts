import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Source {
  id: string;
  title: string;
  relevance: number;
  department?: string;
  snippet: string;
}

interface AIResponse {
  summary: string;
  fullAnswer: string;
  sources: Source[];
  contextSnippets: string[];
  confidenceScore: number;
  isOutOfContext: boolean;
  outOfContextReason?: string;
  completenessLevel: "full" | "partial" | "minimal";
}

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  
  userLimit.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - userLimit.count };
}

// Prompt injection detection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above)\s+(instructions?|prompts?)/i,
  /disregard\s+(previous|all|above)/i,
  /forget\s+(everything|all|previous)/i,
  /new\s+instructions?:/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /\{\{.*\}\}/,
  /<\|.*\|>/,
  /jailbreak/i,
  /bypass\s+(safety|filter|restriction)/i,
  /act\s+as\s+(if|though)\s+you\s+(are|were)\s+not/i,
  /pretend\s+(you\s+are|to\s+be)\s+a/i,
  /roleplay\s+as/i,
];

function detectPromptInjection(input: string): { isInjection: boolean; pattern?: string } {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { isInjection: true, pattern: pattern.source };
    }
  }
  return { isInjection: false };
}

// Input validation
function validateInput(question: string): { valid: boolean; error?: string } {
  if (!question || typeof question !== 'string') {
    return { valid: false, error: "Question is required" };
  }
  
  const trimmed = question.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, error: "Pertanyaan terlalu pendek" };
  }
  
  if (trimmed.length > 2000) {
    return { valid: false, error: "Pertanyaan terlalu panjang (maksimal 2000 karakter)" };
  }
  
  // Check for prompt injection
  const injectionCheck = detectPromptInjection(trimmed);
  if (injectionCheck.isInjection) {
    return { valid: false, error: "Input tidak valid" };
  }
  
  return { valid: true };
}

// Simple keyword-based relevance scoring (in production, use embeddings)
function calculateRelevance(query: string, content: string, title: string): number {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  
  let matchScore = 0;
  for (const word of queryWords) {
    if (titleLower.includes(word)) matchScore += 15;
    const contentMatches = (contentLower.match(new RegExp(word, 'gi')) || []).length;
    matchScore += Math.min(contentMatches * 5, 30);
  }
  
  return Math.min(Math.round(matchScore), 100);
}

// Extract relevant snippets from content
function extractSnippet(query: string, content: string): string {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Score each sentence
  const scoredSentences = sentences.map(sentence => {
    const sentenceLower = sentence.toLowerCase();
    let score = 0;
    for (const word of queryWords) {
      if (sentenceLower.includes(word)) score++;
    }
    return { sentence: sentence.trim(), score };
  });
  
  // Return top matching sentence
  scoredSentences.sort((a, b) => b.score - a.score);
  return scoredSentences[0]?.sentence || content.substring(0, 200);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { question, answerMode = "concise", userId, sessionId } = await req.json();
    
    // Input validation
    const validation = validateInput(question);
    if (!validation.valid) {
      // Log suspicious activity
      if (userId) {
        await supabase.from("ai_query_logs").insert({
          user_id: userId,
          question: question?.substring(0, 500) || "INVALID_INPUT",
          status: "blocked",
          is_out_of_context: true,
          out_of_context_reason: `Validation failed: ${validation.error}`,
          processing_time_ms: Date.now() - startTime,
          session_id: sessionId
        });
      }
      console.warn("Input validation failed:", validation.error, "User:", userId);
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting (only for authenticated users)
    if (userId) {
      const rateCheck = checkRateLimit(userId);
      if (!rateCheck.allowed) {
        console.warn("Rate limit exceeded for user:", userId);
        await supabase.from("ai_query_logs").insert({
          user_id: userId,
          question: question.substring(0, 500),
          status: "rate_limited",
          is_out_of_context: true,
          out_of_context_reason: "Rate limit exceeded",
          processing_time_ms: Date.now() - startTime,
          session_id: sessionId
        });
        return new Response(JSON.stringify({ 
          error: "Terlalu banyak permintaan. Tunggu 1 menit.",
          retryAfter: 60 
        }), {
          status: 429,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": "60"
          },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Retrieve relevant documents from knowledge base
    const { data: documents, error: docsError } = await supabase
      .from("knowledge_documents")
      .select("id, title, content, department, sensitivity_level, tags")
      .eq("status", "published");

    if (docsError) {
      console.error("Error fetching documents:", docsError);
      throw new Error("Failed to fetch knowledge base");
    }

    // Score and rank documents by relevance
    const scoredDocs = (documents || []).map(doc => ({
      ...doc,
      relevance: calculateRelevance(question, doc.content, doc.title),
      snippet: extractSnippet(question, doc.content)
    })).filter(doc => doc.relevance > 10)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);

    // Check if question is out of context
    const isOutOfContext = scoredDocs.length === 0 || scoredDocs[0].relevance < 20;
    
    let aiResponse: AIResponse;

    if (isOutOfContext) {
      // No relevant documents found - politely decline
      aiResponse = {
        summary: "Maaf, saya tidak dapat menemukan informasi yang relevan dalam Knowledge Base.",
        fullAnswer: `Mohon maaf, pertanyaan Anda mengenai "${question}" berada di luar cakupan Knowledge Base kami saat ini.\n\n**Saran:**\n1. Coba formulasikan pertanyaan dengan kata kunci yang berbeda\n2. Pastikan topik yang ditanyakan sudah terdokumentasi dalam sistem\n3. Hubungi administrator untuk menambahkan dokumen terkait\n\n_Sistem ini hanya dapat menjawab berdasarkan dokumen yang telah diindeks._`,
        sources: [],
        contextSnippets: [],
        confidenceScore: 0,
        isOutOfContext: true,
        outOfContextReason: "Tidak ditemukan dokumen yang relevan dengan pertanyaan",
        completenessLevel: "minimal"
      };
    } else {
      // Build context from relevant documents
      const context = scoredDocs.map(doc => 
        `[Dokumen: ${doc.title}]\n${doc.content}`
      ).join("\n\n---\n\n");

      const sources: Source[] = scoredDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        relevance: doc.relevance,
        department: doc.department,
        snippet: doc.snippet
      }));

      const contextSnippets = scoredDocs.map(doc => doc.snippet);

      // Define answer mode instructions
      const modeInstructions: Record<string, string> = {
        concise: "Berikan jawaban singkat dan padat, maksimal 2-3 paragraf.",
        technical: "Berikan penjelasan teknis yang detail dengan langkah-langkah spesifik.",
        executive: "Berikan ringkasan eksekutif tingkat tinggi, fokus pada poin-poin kunci."
      };

      const systemPrompt = `Kamu adalah asisten AI untuk Knowledge Base perusahaan. Kamu WAJIB:
1. Hanya menjawab berdasarkan konteks dokumen yang diberikan
2. Selalu menyertakan referensi ke dokumen sumber
3. Jika informasi tidak ada dalam konteks, katakan dengan jelas
4. ${modeInstructions[answerMode] || modeInstructions.concise}

Format jawaban:
- Mulai dengan ringkasan singkat (1-2 kalimat)
- Berikan penjelasan detail
- Akhiri dengan catatan sumber dokumen

Konteks Dokumen:
${context}`;

      // Call Lovable AI Gateway
      const aiApiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question }
          ],
          temperature: 0.3,
          max_tokens: 1500
        }),
      });

      if (!aiApiResponse.ok) {
        if (aiApiResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiApiResponse.status === 402) {
          return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errorText = await aiApiResponse.text();
        console.error("AI API error:", aiApiResponse.status, errorText);
        throw new Error("AI service unavailable");
      }

      const aiData = await aiApiResponse.json();
      const fullAnswer = aiData.choices?.[0]?.message?.content || "Tidak ada respons dari AI";
      
      // Extract summary (first sentence or paragraph)
      const summaryMatch = fullAnswer.match(/^(.+?[.!?])\s/);
      const summary = summaryMatch ? summaryMatch[1] : fullAnswer.substring(0, 150) + "...";

      // Calculate confidence based on document relevance
      const avgRelevance = scoredDocs.reduce((sum, d) => sum + d.relevance, 0) / scoredDocs.length;
      const confidenceScore = Math.round(Math.min(avgRelevance + 10, 100));

      // Determine completeness level
      const completenessLevel: "full" | "partial" | "minimal" = 
        confidenceScore >= 70 && sources.length >= 2 ? "full" :
        confidenceScore >= 40 || sources.length >= 1 ? "partial" : "minimal";

      aiResponse = {
        summary,
        fullAnswer,
        sources,
        contextSnippets,
        confidenceScore,
        isOutOfContext: false,
        completenessLevel
      };
    }

    const processingTime = Date.now() - startTime;

    // Log to audit table
    if (userId) {
      const { error: logError } = await supabase.from("ai_query_logs").insert({
        user_id: userId,
        question,
        answer: aiResponse.fullAnswer,
        status: aiResponse.isOutOfContext ? "out_of_context" : "answered",
        confidence_score: aiResponse.confidenceScore,
        answer_mode: answerMode,
        sources: aiResponse.sources,
        context_snippets: aiResponse.contextSnippets,
        is_out_of_context: aiResponse.isOutOfContext,
        out_of_context_reason: aiResponse.outOfContextReason,
        processing_time_ms: processingTime,
        model_used: "google/gemini-3-flash-preview",
        session_id: sessionId
      });

      if (logError) {
        console.error("Error logging query:", logError);
      }
    }

    return new Response(JSON.stringify({
      ...aiResponse,
      processingTimeMs: processingTime
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Query error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
