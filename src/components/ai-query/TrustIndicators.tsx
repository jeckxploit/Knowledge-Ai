import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, HelpCircle, Shield, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrustIndicatorsProps {
  confidence: number;
  sourcesCount: number;
  isOutOfContext?: boolean;
  completenessLevel?: "full" | "partial" | "minimal";
}

export function TrustIndicators({
  confidence,
  sourcesCount,
  isOutOfContext,
  completenessLevel = "full",
}: TrustIndicatorsProps) {
  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { label: "Tinggi", color: "text-success", bgColor: "bg-success" };
    if (score >= 60) return { label: "Sedang", color: "text-warning", bgColor: "bg-warning" };
    if (score >= 40) return { label: "Rendah", color: "text-orange-500", bgColor: "bg-orange-500" };
    return { label: "Sangat Rendah", color: "text-destructive", bgColor: "bg-destructive" };
  };

  const getCompletenessInfo = (level: string) => {
    switch (level) {
      case "full":
        return {
          label: "Jawaban Lengkap",
          description: "Semua aspek pertanyaan terjawab dengan baik",
          icon: CheckCircle2,
          color: "text-success",
          badgeClass: "bg-success/20 text-success border-success/30",
        };
      case "partial":
        return {
          label: "Jawaban Parsial",
          description: "Beberapa aspek pertanyaan mungkin belum terjawab",
          icon: AlertCircle,
          color: "text-warning",
          badgeClass: "bg-warning/20 text-warning border-warning/30",
        };
      default:
        return {
          label: "Jawaban Minimal",
          description: "Informasi yang tersedia sangat terbatas",
          icon: HelpCircle,
          color: "text-muted-foreground",
          badgeClass: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const getCoverageStatus = () => {
    if (isOutOfContext) {
      return {
        label: "Di Luar Cakupan",
        description: "Tidak ditemukan dokumen relevan di Knowledge Base",
        color: "text-destructive",
        icon: AlertCircle,
      };
    }
    if (sourcesCount >= 3) {
      return {
        label: "Cakupan Baik",
        description: `${sourcesCount} dokumen sumber ditemukan`,
        color: "text-success",
        icon: Shield,
      };
    }
    if (sourcesCount >= 1) {
      return {
        label: "Cakupan Terbatas",
        description: `Hanya ${sourcesCount} dokumen sumber`,
        color: "text-warning",
        icon: AlertCircle,
      };
    }
    return {
      label: "Tidak Ada Sumber",
      description: "Tidak ada dokumen yang cocok",
      color: "text-destructive",
      icon: HelpCircle,
    };
  };

  const confidenceLevel = getConfidenceLevel(confidence);
  const completenessInfo = getCompletenessInfo(completenessLevel);
  const coverageStatus = getCoverageStatus();
  const CompletenessIcon = completenessInfo.icon;
  const CoverageIcon = coverageStatus.icon;

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-secondary/30 rounded-lg">
      {/* Confidence Score Visual */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <Sparkles className={cn("w-4 h-4", confidenceLevel.color)} />
              <div className="flex items-center gap-2">
                <div className="w-20">
                  <Progress 
                    value={confidence} 
                    className="h-2"
                  />
                </div>
                <span className={cn("text-sm font-medium", confidenceLevel.color)}>
                  {confidence}%
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Confidence Score: {confidenceLevel.label}</p>
            <p className="text-xs text-muted-foreground">
              Tingkat kepercayaan jawaban berdasarkan relevansi dokumen
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-px h-4 bg-border" />

      {/* Completeness Label */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={cn("cursor-help gap-1", completenessInfo.badgeClass)}>
              <CompletenessIcon className="w-3 h-3" />
              {completenessInfo.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{completenessInfo.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-px h-4 bg-border" />

      {/* KB Coverage Status */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center gap-1 text-sm cursor-help", coverageStatus.color)}>
              <CoverageIcon className="w-4 h-4" />
              <span>{coverageStatus.label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{coverageStatus.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
