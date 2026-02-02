import { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function ConnectionStatus() {
  const { isOnline, wasOffline, resetWasOffline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        resetWasOffline();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, resetWasOffline]);

  // Don't show anything when online and not recently reconnected
  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium shadow-lg transition-all duration-300 animate-slide-up",
        isOnline
          ? "bg-success/10 text-success border border-success/20"
          : "bg-warning/10 text-warning border border-warning/20"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Koneksi dipulihkan</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Anda sedang offline</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 p-1 rounded-full hover:bg-warning/20 transition-colors"
            title="Coba sambungkan kembali"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
