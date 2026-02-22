import { useState, useEffect } from "react";
import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IngestionItem {
  id: string;
  name: string;
  type: "pdf" | "docx" | "txt" | "url";
  status: "completed" | "processing" | "pending" | "failed";
  progress?: number;
  timestamp: string;
}

const initialMockItems: IngestionItem[] = [
  { id: "1", name: "Q4 Financial Report.pdf", type: "pdf", status: "completed", progress: 100, timestamp: "2 min ago" },
  { id: "2", name: "Employee Handbook v3.docx", type: "docx", status: "processing", progress: 67, timestamp: "5 min ago" },
  { id: "3", name: "Technical Architecture.pdf", type: "pdf", status: "pending", timestamp: "10 min ago" },
  { id: "4", name: "API Documentation.md", type: "txt", status: "completed", progress: 100, timestamp: "15 min ago" },
  { id: "5", name: "https://docs.company.com", type: "url", status: "failed", timestamp: "20 min ago" },
];

const statusConfig = {
  completed: { 
    icon: CheckCircle, 
    className: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    label: "Completed"
  },
  processing: { 
    icon: Loader2, 
    className: "text-info animate-spin",
    bg: "bg-info/10",
    border: "border-info/20",
    label: "Processing"
  },
  pending: { 
    icon: Clock, 
    className: "text-muted-foreground",
    bg: "bg-muted/20",
    border: "border-border/50",
    label: "Pending"
  },
  failed: {
    icon: AlertCircle,
    className: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    label: "Failed"
  },
};

const typeConfig = {
  pdf: { icon: "PDF", color: "bg-red-500/15 text-red-400 border-red-500/20" },
  docx: { icon: "DOC", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  txt: { icon: "TXT", color: "bg-green-500/15 text-green-400 border-green-500/20" },
  url: { icon: "URL", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
};

export function IngestionStatus() {
  const [items, setItems] = useState<IngestionItem[]>(initialMockItems);

  // Simulate processing completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(prev => prev.map(item => {
        if (item.id === "2" && item.status === "processing") {
          // Complete Employee Handbook processing
          toast.success("Document processed successfully", {
            description: "Employee Handbook v3.docx has been indexed",
          });
          return { ...item, status: "completed", progress: 100, timestamp: "Just now" };
        }
        // Move pending to processing
        if (item.id === "3" && item.status === "pending") {
          return { ...item, status: "processing", progress: 15 };
        }
        return item;
      }));
    }, 3000); // Complete after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      {/* Enhanced Header */}
      <div className="relative p-5 border-b border-border/50 bg-gradient-to-r from-warning/5 via-transparent to-info/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warning/20 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ingestion Pipeline</h3>
              <p className="text-sm text-muted-foreground">Real-time document processing status</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:bg-primary/10">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pipeline Items */}
      <div className="divide-y divide-border/50">
        {items.map((item) => {
          const StatusIcon = statusConfig[item.status].icon;
          const typeStyle = typeConfig[item.type];
          const isProcessing = item.status === "processing";
          
          return (
            <div 
              key={item.id} 
              className={cn(
                "p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer",
                isProcessing ? "bg-info/5" : "hover:bg-secondary/30"
              )}
            >
              {/* Type Badge */}
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl border font-bold text-xs shrink-0 transition-transform group-hover/item:scale-105",
                typeStyle.color
              )}>
                {typeStyle.icon}
              </div>
              
              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate text-foreground/90">{item.name}</p>
                  {isProcessing && (
                    <span className="flex items-center gap-1 text-xs text-info">
                      <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                      <span className="whitespace-nowrap">Processing...</span>
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-xs uppercase font-semibold px-2 py-0.5 rounded-md border",
                    typeStyle.color
                  )}>
                    {item.type}
                  </span>
                  
                  {/* Progress Bar for processing items */}
                  {item.progress !== undefined && (
                    <div className="flex-1 max-w-32 h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500 relative overflow-hidden",
                          isProcessing ? "bg-gradient-to-r from-info to-accent" : "bg-secondary"
                        )}
                        style={{ width: `${item.progress}%` }}
                      >
                        {/* Animated shimmer on progress bar */}
                        {isProcessing && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1s_infinite]" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status & Timestamp */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    statusConfig[item.status].className
                  )}>
                    {statusConfig[item.status].label}
                  </p>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
                
                {/* Status Icon */}
                <div className={cn(
                  "p-2.5 rounded-xl border transition-all duration-300",
                  statusConfig[item.status].bg,
                  statusConfig[item.status].border
                )}>
                  <StatusIcon className={cn("w-5 h-5", statusConfig[item.status].className)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Summary Footer */}
      <div className="px-5 py-4 border-t border-border/50 bg-gradient-to-r from-success/5 via-transparent to-info/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-success">{items.filter(i => i.status === "completed").length}</span> completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-info animate-pulse" />
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-info">{items.filter(i => i.status === "processing").length}</span> processing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-muted" />
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-muted-foreground">{items.filter(i => i.status === "pending").length}</span> pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-destructive">{items.filter(i => i.status === "failed").length}</span> failed
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/10">
            Manage Pipeline
          </Button>
        </div>
      </div>
    </div>
  );
}
