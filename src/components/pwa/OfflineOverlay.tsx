import { WifiOff, RefreshCw, Database, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface OfflineOverlayProps {
  /** Feature name that requires internet */
  featureName?: string;
  /** Show as overlay (blocks interaction) or inline message */
  variant?: "overlay" | "inline";
}

export function OfflineOverlay({ 
  featureName = "Fitur ini", 
  variant = "inline" 
}: OfflineOverlayProps) {
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  const features = [
    { icon: Brain, label: "AI Query & Analisis" },
    { icon: FileText, label: "Knowledge Base" },
    { icon: Database, label: "Data & Analytics" },
  ];

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="max-w-md text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-warning" />
          </div>
          
          <h2 className="text-xl font-bold mb-2">Koneksi Internet Diperlukan</h2>
          <p className="text-muted-foreground mb-6">
            {featureName} membutuhkan koneksi internet untuk berfungsi.
          </p>

          <div className="glass-card rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Fitur yang tidak tersedia offline:
            </p>
            <div className="space-y-2">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={() => window.location.reload()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className="rounded-xl border border-warning/20 bg-warning/5 p-6 text-center animate-fade-in">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-warning/10 flex items-center justify-center">
        <WifiOff className="w-6 h-6 text-warning" />
      </div>
      <h3 className="font-semibold mb-1">Tidak Ada Koneksi</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {featureName} membutuhkan koneksi internet.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.reload()}
        className="gap-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Refresh
      </Button>
    </div>
  );
}
