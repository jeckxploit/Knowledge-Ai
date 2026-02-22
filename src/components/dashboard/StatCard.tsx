import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
}

export const StatCard = memo(function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  gradient = "from-primary/20 to-primary/5",
}: StatCardProps) {
  return (
    <div className={cn(
      "stat-card group relative overflow-hidden",
      "hover:shadow-glow transition-all duration-500",
      "border-border/50 hover:border-primary/30"
    )}>
      {/* Animated gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        gradient
      )} />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {value}
            </p>
            {change && (
              <div className="flex items-center gap-1.5">
                {changeType === "positive" && (
                  <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7l-5 5 5 5" clipRule="evenodd" />
                  </svg>
                )}
                {changeType === "negative" && (
                  <svg className="w-3 h-3 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 13l5-5-5-5" clipRule="evenodd" />
                  </svg>
                )}
                <p
                  className={cn(
                    "text-xs sm:text-sm font-medium truncate",
                    changeType === "positive" && "text-success",
                    changeType === "negative" && "text-destructive",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </p>
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0 shadow-lg",
              iconColor,
              gradient
            )}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </div>
        </div>
      </div>
    </div>
  );
});
