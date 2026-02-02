import { useEffect, useState } from "react";
import { Database, FileText, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CoverageStats {
  totalDocuments: number;
  totalQueries: number;
  answeredQueries: number;
  failedQueries: number;
  avgConfidence: number;
  coveragePercentage: number;
  departmentCoverage: { department: string; count: number }[];
}

export function KBCoverageStatus() {
  const [stats, setStats] = useState<CoverageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch document count by department
        const { data: docs, error: docsError } = await supabase
          .from("knowledge_documents")
          .select("department");

        // Fetch query stats
        const { data: queries, error: queriesError } = await supabase
          .from("ai_query_logs")
          .select("status, confidence_score, is_out_of_context");

        if (!docsError && !queriesError && docs && queries) {
          const departmentCounts = docs.reduce((acc, doc) => {
            const dept = doc.department || "Umum";
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const answered = queries.filter((q) => !q.is_out_of_context).length;
          const failed = queries.filter((q) => q.is_out_of_context).length;
          const avgConf =
            queries
              .filter((q) => q.confidence_score)
              .reduce((sum, q) => sum + (q.confidence_score || 0), 0) /
            (queries.filter((q) => q.confidence_score).length || 1);

          setStats({
            totalDocuments: docs.length,
            totalQueries: queries.length,
            answeredQueries: answered,
            failedQueries: failed,
            avgConfidence: Math.round(avgConf),
            coveragePercentage: queries.length > 0 ? Math.round((answered / queries.length) * 100) : 100,
            departmentCoverage: Object.entries(departmentCounts)
              .map(([department, count]) => ({ department, count }))
              .sort((a, b) => b.count - a.count),
          });
        }
      } catch (error) {
        console.error("Error fetching coverage stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-secondary rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-secondary rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 70) return "text-warning";
    return "text-destructive";
  };

  const getCoverageLabel = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 70) return "Good";
    if (percentage >= 50) return "Needs Improvement";
    return "Critical";
  };

  return (
    <div className="glass-card rounded-xl">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">Status Cakupan Knowledge Base</h3>
            <p className="text-sm text-muted-foreground">Ringkasan kesehatan dan cakupan KB</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Coverage Metric */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-3">
            <span className={cn("text-3xl font-bold", getCoverageColor(stats.coveragePercentage))}>
              {stats.coveragePercentage}%
            </span>
          </div>
          <p className="font-medium">Tingkat Cakupan</p>
          <p className={cn("text-sm", getCoverageColor(stats.coveragePercentage))}>
            {getCoverageLabel(stats.coveragePercentage)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary/30 rounded-lg text-center">
            <FileText className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.totalDocuments}</p>
            <p className="text-xs text-muted-foreground">Total Dokumen</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-lg text-center">
            <TrendingUp className="w-5 h-5 text-info mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.avgConfidence}%</p>
            <p className="text-xs text-muted-foreground">Rata-rata Confidence</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-lg text-center">
            <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.answeredQueries}</p>
            <p className="text-xs text-muted-foreground">Terjawab</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-lg text-center">
            <AlertCircle className="w-5 h-5 text-warning mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.failedQueries}</p>
            <p className="text-xs text-muted-foreground">Tidak Terjawab</p>
          </div>
        </div>

        {/* Department Coverage */}
        <div>
          <h4 className="text-sm font-medium mb-3">Dokumen per Departemen</h4>
          <div className="space-y-2">
            {stats.departmentCoverage.slice(0, 5).map((dept) => (
              <div key={dept.department} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-24 truncate">{dept.department}</span>
                <Progress
                  value={(dept.count / stats.totalDocuments) * 100}
                  className="flex-1 h-2"
                />
                <span className="text-sm font-medium w-8 text-right">{dept.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
