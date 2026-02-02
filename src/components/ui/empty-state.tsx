import { FileX, Search, Database, AlertCircle, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  variant?: "no-data" | "no-results" | "error" | "no-documents";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  className?: string;
}

const variants = {
  "no-data": {
    icon: Database,
    defaultTitle: "Belum Ada Data",
    defaultDescription: "Data akan muncul setelah Anda mulai menggunakan fitur ini.",
  },
  "no-results": {
    icon: Search,
    defaultTitle: "Tidak Ditemukan",
    defaultDescription: "Coba ubah kata kunci pencarian atau filter Anda.",
  },
  "error": {
    icon: AlertCircle,
    defaultTitle: "Terjadi Kesalahan",
    defaultDescription: "Tidak dapat memuat data. Silakan coba lagi.",
  },
  "no-documents": {
    icon: FileX,
    defaultTitle: "Belum Ada Dokumen",
    defaultDescription: "Upload dokumen pertama Anda untuk memulai Knowledge Base.",
  },
};

export function EmptyState({ 
  variant = "no-data", 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in",
      className
    )}>
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
        variant === "error" 
          ? "bg-destructive/10 text-destructive" 
          : "bg-secondary/50 text-muted-foreground"
      )}>
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="text-lg font-semibold mb-1">
        {title || config.defaultTitle}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description || config.defaultDescription}
      </p>
      
      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {action.icon ? (
            <action.icon className="w-4 h-4" />
          ) : variant === "error" ? (
            <RefreshCw className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {action.label}
        </Button>
      )}
    </div>
  );
}
