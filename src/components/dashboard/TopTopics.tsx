import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function TopTopics() {
  const maxCount = Math.max(...topics.map((t) => t.count));

  return (
    <div className="glass-card rounded-xl">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Top Topics</h3>
          <p className="text-sm text-muted-foreground">Most queried categories</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-primary">
          Explore <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        {topics.map((item, index) => (
          <div key={item.topic} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium text-sm">{item.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.count}</span>
                <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
              </div>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
