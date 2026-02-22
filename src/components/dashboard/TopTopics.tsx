import { ArrowRight, TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopicItem {
  topic: string;
  count: number;
  trend: "up" | "down" | "stable";
  percentage: number;
}

const topics: TopicItem[] = [
  { topic: "HR Policies", count: 342, trend: "up", percentage: 24 },
  { topic: "IT Security", count: 287, trend: "up", percentage: 20 },
  { topic: "Product Features", count: 234, trend: "stable", percentage: 16 },
  { topic: "Onboarding", count: 198, trend: "down", percentage: 14 },
  { topic: "Benefits & Perks", count: 156, trend: "up", percentage: 11 },
  { topic: "Technical Docs", count: 132, trend: "stable", percentage: 9 },
];

const topicColors = [
  { bg: "bg-primary/20", border: "border-primary/30", text: "text-primary", bar: "from-primary to-info" },
  { bg: "bg-accent/20", border: "border-accent/30", text: "text-accent", bar: "from-accent to-emerald-400" },
  { bg: "bg-info/20", border: "border-info/30", text: "text-info", bar: "from-info to-blue-400" },
  { bg: "bg-warning/20", border: "border-warning/30", text: "text-warning", bar: "from-warning to-amber-400" },
  { bg: "bg-success/20", border: "border-success/30", text: "text-success", bar: "from-success to-green-400" },
  { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", bar: "from-purple-500 to-pink-400" },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-success" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

export function TopTopics() {
  const maxCount = Math.max(...topics.map((t) => t.count));

  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      {/* Enhanced Header */}
      <div className="relative p-5 border-b border-border/50 bg-gradient-to-r from-accent/5 via-transparent to-primary/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/20 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Top Topics</h3>
              <p className="text-sm text-muted-foreground">Most queried categories this week</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:bg-primary/10">
            Explore <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Topics List */}
      <div className="p-5 space-y-4">
        {topics.map((item, index) => {
          const colors = topicColors[index % topicColors.length];
          return (
            <div key={item.topic} className="group/topic space-y-2">
              {/* Topic Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs transition-all duration-300 group-hover/topic:scale-110",
                    colors.bg, colors.border, colors.text, "border"
                  )}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  
                  {/* Topic Name */}
                  <span className="font-medium text-sm text-foreground/90">{item.topic}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Trend Indicator */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/30">
                    <TrendIcon trend={item.trend} />
                  </div>
                  
                  {/* Count */}
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{item.count}</span>
                    <span className="text-xs text-muted-foreground ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 bg-secondary/50 rounded-full overflow-hidden">
                {/* Animated background shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover/topic:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                
                {/* Fill bar with gradient */}
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
                    colors.bar
                  )}
                  style={{ 
                    width: `${(item.count / maxCount) * 100}%`,
                    boxShadow: `0 0 10px hsl(var(--${colors.text?.replace('text-', '')} / 0.3)`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="px-5 pb-5 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total queries across all topics</span>
          <span className="font-semibold text-primary">1,349</span>
        </div>
      </div>
    </div>
  );
}
