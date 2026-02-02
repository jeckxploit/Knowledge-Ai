import { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, FileQuestion, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FailedQuery {
  question: string;
  count: number;
  lastAsked: string;
  reason?: string;
}

interface UncoveredTopic {
  topic: string;
  queryCount: number;
  examples: string[];
}

interface DocumentRecommendation {
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
  relatedQueries: number;
}

export function FailedQueriesAnalysis() {
  const [failedQueries, setFailedQueries] = useState<FailedQuery[]>([]);
  const [uncoveredTopics, setUncoveredTopics] = useState<UncoveredTopic[]>([]);
  const [recommendations, setRecommendations] = useState<DocumentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch failed/out-of-context queries
      const { data: failedData, error: failedError } = await supabase
        .from("ai_query_logs")
        .select("question, created_at, out_of_context_reason")
        .eq("is_out_of_context", true)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!failedError && failedData) {
        // Group by similar questions
        const grouped = failedData.reduce((acc, item) => {
          const key = item.question.toLowerCase().trim();
          if (!acc[key]) {
            acc[key] = {
              question: item.question,
              count: 0,
              lastAsked: item.created_at,
              reason: item.out_of_context_reason,
            };
          }
          acc[key].count++;
          return acc;
        }, {} as Record<string, FailedQuery>);

        const sorted = Object.values(grouped)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setFailedQueries(sorted);

        // Extract uncovered topics from failed queries
        const topicKeywords = extractTopics(failedData.map((d) => d.question));
        setUncoveredTopics(topicKeywords);

        // Generate recommendations
        const recs = generateRecommendations(sorted, topicKeywords);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Extract topics from failed questions
  const extractTopics = (questions: string[]): UncoveredTopic[] => {
    const topicPatterns = [
      { pattern: /gaji|salary|kompensasi|bonus/i, topic: "Kompensasi & Gaji" },
      { pattern: /cuti|leave|izin|libur/i, topic: "Kebijakan Cuti" },
      { pattern: /training|pelatihan|development/i, topic: "Training & Development" },
      { pattern: /vpn|network|jaringan/i, topic: "Network & VPN" },
      { pattern: /expense|reimbursement|klaim/i, topic: "Expense & Reimbursement" },
      { pattern: /promosi|karir|career/i, topic: "Karir & Promosi" },
      { pattern: /meeting|rapat|zoom/i, topic: "Meeting & Collaboration" },
      { pattern: /password|akun|account/i, topic: "Account Management" },
    ];

    const topicCounts: Record<string, { count: number; examples: string[] }> = {};

    questions.forEach((q) => {
      topicPatterns.forEach(({ pattern, topic }) => {
        if (pattern.test(q)) {
          if (!topicCounts[topic]) {
            topicCounts[topic] = { count: 0, examples: [] };
          }
          topicCounts[topic].count++;
          if (topicCounts[topic].examples.length < 3) {
            topicCounts[topic].examples.push(q);
          }
        }
      });
    });

    return Object.entries(topicCounts)
      .map(([topic, data]) => ({
        topic,
        queryCount: data.count,
        examples: data.examples,
      }))
      .sort((a, b) => b.queryCount - a.queryCount)
      .slice(0, 6);
  };

  // Generate document recommendations
  const generateRecommendations = (
    failed: FailedQuery[],
    topics: UncoveredTopic[]
  ): DocumentRecommendation[] => {
    const recs: DocumentRecommendation[] = [];

    topics.forEach((topic) => {
      recs.push({
        title: `Dokumen ${topic.topic}`,
        reason: `${topic.queryCount} pertanyaan terkait tidak terjawab`,
        priority: topic.queryCount > 5 ? "high" : topic.queryCount > 2 ? "medium" : "low",
        relatedQueries: topic.queryCount,
      });
    });

    // Add specific recommendations from failed queries
    if (failed.length > 0) {
      const mostAsked = failed[0];
      if (mostAsked.count >= 3) {
        recs.unshift({
          title: `FAQ: ${mostAsked.question.substring(0, 50)}...`,
          reason: `Ditanyakan ${mostAsked.count} kali tanpa jawaban`,
          priority: "high",
          relatedQueries: mostAsked.count,
        });
      }
    }

    return recs.slice(0, 5);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-secondary rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Failed Queries */}
      <div className="glass-card rounded-xl">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <h3 className="font-semibold">Pertanyaan Gagal Dijawab</h3>
              <p className="text-sm text-muted-foreground">Pertanyaan di luar cakupan Knowledge Base</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
        <div className="p-4 space-y-3">
          {failedQueries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Belum ada pertanyaan yang gagal dijawab
            </p>
          ) : (
            failedQueries.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-warning">{item.count}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Terakhir ditanyakan: {new Date(item.lastAsked).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Uncovered Topics */}
      <div className="glass-card rounded-xl">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-info" />
            <div>
              <h3 className="font-semibold">Topik Belum Tercakup</h3>
              <p className="text-sm text-muted-foreground">Area yang perlu ditambah dokumentasinya</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          {uncoveredTopics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Semua topik sudah tercakup
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {uncoveredTopics.map((topic, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{topic.topic}</span>
                    <Badge variant="outline" className="text-xs">
                      {topic.queryCount} queries
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {topic.examples.slice(0, 2).map((ex, i) => (
                      <p key={i} className="text-xs text-muted-foreground truncate">
                        • {ex}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Recommendations */}
      <div className="glass-card rounded-xl">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <div>
              <h3 className="font-semibold">Rekomendasi Dokumen</h3>
              <p className="text-sm text-muted-foreground">Dokumen yang perlu ditambahkan</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Tidak ada rekomendasi saat ini
            </p>
          ) : (
            recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
              >
                <Badge
                  variant="outline"
                  className={cn("shrink-0 capitalize", getPriorityBadgeClass(rec.priority))}
                >
                  {rec.priority}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
