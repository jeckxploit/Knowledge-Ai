import { TrendingUp, ArrowRight, Activity, Zap, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { name: "Mon", queries: 145, answered: 132, confidence: 89 },
  { name: "Tue", queries: 203, answered: 189, confidence: 92 },
  { name: "Wed", queries: 187, answered: 176, confidence: 88 },
  { name: "Thu", queries: 256, answered: 241, confidence: 94 },
  { name: "Fri", queries: 289, answered: 268, confidence: 91 },
  { name: "Sat", queries: 123, answered: 115, confidence: 87 },
  { name: "Sun", queries: 98, answered: 92, confidence: 90 },
];

const stats = [
  {
    label: "Peak Hour",
    value: "2:00 PM",
    change: "+15%",
    icon: Zap,
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
  },
  {
    label: "Avg Response",
    value: "1.2s",
    change: "-0.3s",
    icon: Target,
    color: "text-info",
    bg: "bg-info/10 border-info/20",
  },
  {
    label: "Best Day",
    value: "Friday",
    change: "289 queries",
    icon: Award,
    color: "text-success",
    bg: "bg-success/10 border-success/20",
  },
];

export function QueryAnalytics() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      {/* Enhanced Header with Animated Background */}
      <div className="relative p-5 sm:p-6 border-b border-border/50">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-info/5 opacity-50" />
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-accent/5 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500" />
                <div className="relative p-2.5 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Query Analytics</h3>
                <p className="text-sm text-muted-foreground">Weekly query volume & performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Performance Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <div className="relative flex items-center justify-center w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </div>
                <span className="text-sm font-semibold text-success">+12.5%</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-primary hover:bg-primary/10 hover:text-primary transition-all"
              >
                Details 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-5 border-b border-border/30 bg-secondary/20">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-background/50 hover:bg-secondary/30 transition-all duration-300 group/stat"
          >
            <div className={cn(
              "p-2 rounded-lg mb-2 border group-hover/stat:scale-110 transition-transform duration-300",
              stat.bg
            )}>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</span>
            <span className={cn(
              "text-[10px] font-medium mt-0.5",
              stat.change.startsWith("+") || stat.change.includes("queries") ? "text-success" : "text-info"
            )}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="p-4 sm:p-6 h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="queryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="answeredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160 60% 35%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(160 60% 35%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(217 33% 17%)"
              vertical={false}
              className="opacity-50"
            />

            <XAxis
              dataKey="name"
              stroke="hsl(215 20% 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: 'hsl(215 20% 55%)' }}
            />

            <YAxis
              stroke="hsl(215 20% 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={10}
              tick={{ fill: 'hsl(215 20% 55%)' }}
              tickFormatter={(value) => `${value}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 8% / 0.98)",
                backdropFilter: "blur(16px)",
                border: "1px solid hsl(217 33% 17%)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(59, 130, 246, 0.1)",
                padding: "14px 16px",
              }}
              labelStyle={{ 
                color: "hsl(210 40% 98%)", 
                fontWeight: 600, 
                marginBottom: 10,
                fontSize: 14,
              }}
              cursor={{ stroke: "hsl(217 91% 60% / 0.5)", strokeWidth: 2, strokeDasharray: "4 4" }}
              formatter={(value: number, name: string) => {
                const colors: Record<string, string> = {
                  queries: "hsl(217 91% 60%)",
                  answered: "hsl(160 60% 35%)",
                  confidence: "hsl(199 89% 48%)",
                };
                return [
                  <span style={{ color: colors[name] || "hsl(210 40% 98%)", fontWeight: 600 }}>
                    {value}{name === "confidence" ? "%" : ""}
                  </span>,
                  <span style={{ color: "hsl(215 20% 65%)", marginLeft: 8 }}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </span>
                ];
              }}
            />

            <ReferenceLine
              y={200}
              stroke="hsl(217 91% 60% / 0.3)"
              strokeDasharray="4 4"
              label={{ 
                value: "Target", 
                fill: "hsl(217 91% 60%)", 
                fontSize: 11,
                position: "insideTopRight"
              }}
            />

            {/* Queries Area */}
            <Area
              type="monotone"
              dataKey="queries"
              stroke="hsl(217 91% 60%)"
              strokeWidth={3}
              fill="url(#queryGradient)"
              animationDuration={2000}
              dot={{
                fill: "hsl(222 47% 8%)",
                stroke: "hsl(217 91% 60%)",
                strokeWidth: 3,
                r: 5,
              }}
              activeDot={{
                r: 7,
                strokeWidth: 3,
                fill: "hsl(217 91% 60%)",
              }}
            />

            {/* Answered Area */}
            <Area
              type="monotone"
              dataKey="answered"
              stroke="hsl(160 60% 35%)"
              strokeWidth={3}
              fill="url(#answeredGradient)"
              animationDuration={2000}
              dot={{
                fill: "hsl(222 47% 8%)",
                stroke: "hsl(160 60% 35%)",
                strokeWidth: 3,
                r: 5,
              }}
              activeDot={{
                r: 7,
                strokeWidth: 3,
                fill: "hsl(160 60% 35%)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Legend with Metrics */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all cursor-default">
            <div className="w-3 h-3 rounded-full bg-primary shadow-glow" />
            <span className="text-sm font-medium text-primary">Total Queries</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/15 transition-all cursor-default">
            <div className="w-3 h-3 rounded-full bg-accent shadow-glow" />
            <span className="text-sm font-medium text-accent">Answered</span>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground">Avg. response rate:</span>
            <span className="text-sm font-bold text-success">93.2%</span>
            <TrendingUp className="w-3.5 h-3.5 text-success" />
          </div>
        </div>
      </div>
    </div>
  );
}
