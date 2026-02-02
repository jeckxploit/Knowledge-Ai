import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IngestionItem {
  id: string;
  name: string;
  type: "pdf" | "docx" | "txt" | "url";
  status: "completed" | "processing" | "pending" | "failed";
  progress?: number;
  timestamp: string;
}

const mockItems: IngestionItem[] = [
  { id: "1", name: "Q4 Financial Report.pdf", type: "pdf", status: "completed", timestamp: "2 min ago" },
  { id: "2", name: "Employee Handbook v3.docx", type: "docx", status: "processing", progress: 67, timestamp: "5 min ago" },
  { id: "3", name: "Technical Architecture.pdf", type: "pdf", status: "pending", timestamp: "10 min ago" },
  { id: "4", name: "API Documentation.md", type: "txt", status: "completed", timestamp: "15 min ago" },
  { id: "5", name: "https://docs.company.com", type: "url", status: "failed", timestamp: "20 min ago" },
];

const statusConfig = {
  completed: { icon: CheckCircle, className: "text-success" },
  processing: { icon: Clock, className: "text-info animate-pulse" },
  pending: { icon: Clock, className: "text-muted-foreground" },
  failed: { icon: AlertCircle, className: "text-destructive" },
};

const typeColors = {
  pdf: "bg-red-500/10 text-red-400",
  docx: "bg-blue-500/10 text-blue-400",
  txt: "bg-green-500/10 text-green-400",
  url: "bg-purple-500/10 text-purple-400",
};

export function IngestionStatus() {
  return (
    <div className="glass-card rounded-xl">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Ingestion Pipeline</h3>
          <p className="text-sm text-muted-foreground">Recent document processing</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-primary">
          View All <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="divide-y divide-border/50">
        {mockItems.map((item) => {
          const StatusIcon = statusConfig[item.status].icon;
          return (
            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
              <div className={cn("p-2 rounded-lg", typeColors[item.type])}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs uppercase font-medium text-muted-foreground">
                    {item.type}
                  </span>
                  {item.progress !== undefined && (
                    <div className="flex-1 max-w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-info rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                <StatusIcon className={cn("w-5 h-5", statusConfig[item.status].className)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
