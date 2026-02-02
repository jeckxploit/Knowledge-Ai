import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedAt = new Date(dismissed);
      const hoursSinceDismissed = (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40 animate-slide-up">
      <div className="glass-card rounded-xl p-4 shadow-lg border border-primary/20">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">Install KB Analyzer</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Akses lebih cepat langsung dari home screen perangkat Anda.
            </p>
            
            <Button size="sm" onClick={handleInstall} className="gap-2 w-full">
              <Download className="w-4 h-4" />
              Install Aplikasi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
