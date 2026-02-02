import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const data = [
  { name: "Mon", queries: 145, answered: 132 },
  { name: "Tue", queries: 203, answered: 189 },
  { name: "Wed", queries: 187, answered: 176 },
  { name: "Thu", queries: 256, answered: 241 },
  { name: "Fri", queries: 289, answered: 268 },
  { name: "Sat", queries: 123, answered: 115 },
  { name: "Sun", queries: 98, answered: 92 },
];

export function QueryAnalytics() {
  return (
    <div className="glass-card rounded-xl">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Query Analytics</h3>
          <p className="text-sm text-muted-foreground">Weekly query volume</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">+12.5%</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-primary">
            Details <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="queryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="answeredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 10%)",
                border: "1px solid hsl(217 33% 17%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(210 40% 98%)" }}
            />
            <Area
              type="monotone"
              dataKey="queries"
              stroke="hsl(217 91% 60%)"
              strokeWidth={2}
              fill="url(#queryGradient)"
            />
            <Area
              type="monotone"
              dataKey="answered"
              stroke="hsl(160 84% 39%)"
              strokeWidth={2}
              fill="url(#answeredGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="px-4 pb-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Total Queries</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Answered</span>
        </div>
      </div>
    </div>
  );
}
