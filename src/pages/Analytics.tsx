import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FailedQueriesAnalysis } from "@/components/analytics/FailedQueriesAnalysis";
import { KBCoverageStatus } from "@/components/analytics/KBCoverageStatus";
import { OfflineOverlay } from "@/components/pwa/OfflineOverlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Target,
  AlertTriangle,
  Database,
  Download,
  Calendar,
  Zap,
  Award,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Sparkles,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";

const queryData = [
  { name: "Mon", queries: 145, answered: 132, failed: 13 },
  { name: "Tue", queries: 203, answered: 189, failed: 14 },
  { name: "Wed", queries: 187, answered: 176, failed: 11 },
  { name: "Thu", queries: 256, answered: 241, failed: 15 },
  { name: "Fri", queries: 289, answered: 268, failed: 21 },
  { name: "Sat", queries: 123, answered: 115, failed: 8 },
  { name: "Sun", queries: 98, answered: 92, failed: 6 },
];

const confidenceData = [
  { name: "Week 1", confidence: 82, queries: 450 },
  { name: "Week 2", confidence: 85, queries: 520 },
  { name: "Week 3", confidence: 84, queries: 480 },
  { name: "Week 4", confidence: 87, queries: 610 },
  { name: "Week 5", confidence: 89, queries: 680 },
  { name: "Week 6", confidence: 88, queries: 590 },
];

const topicDistribution = [
  { name: "HR Policies", value: 24, color: "hsl(217 91% 60%)", queries: 3084 },
  { name: "IT Security", value: 20, color: "hsl(160 60% 35%)", queries: 2569 },
  { name: "Product", value: 16, color: "hsl(199 89% 48%)", queries: 2055 },
  { name: "Onboarding", value: 14, color: "hsl(38 92% 50%)", queries: 1798 },
  { name: "Other", value: 26, color: "hsl(217 33% 40%)", queries: 3341 },
];

const hourlyActivity = [
  { hour: "00:00", queries: 12 },
  { hour: "04:00", queries: 8 },
  { hour: "08:00", queries: 89 },
  { hour: "10:00", queries: 156 },
  { hour: "12:00", queries: 134 },
  { hour: "14:00", queries: 178 },
  { hour: "16:00", queries: 145 },
  { hour: "18:00", queries: 67 },
  { hour: "20:00", queries: 34 },
  { hour: "23:00", queries: 18 },
];

const departmentStats = [
  { name: "Engineering", documents: 1247, queries: 4521, color: "hsl(217 91% 60%)" },
  { name: "HR", documents: 456, queries: 2134, color: "hsl(160 60% 35%)" },
  { name: "IT", documents: 678, queries: 1876, color: "hsl(199 89% 48%)" },
  { name: "Sales", documents: 345, queries: 1543, color: "hsl(38 92% 50%)" },
  { name: "Operations", documents: 521, queries: 1298, color: "hsl(217 33% 40%)" },
];

const recentQueries = [
  { id: 1, query: "What is the remote work policy?", confidence: 94, status: "answered", time: "2 min ago", user: "John D." },
  { id: 2, query: "How to access the VPN?", confidence: 87, status: "answered", time: "5 min ago", user: "Sarah M." },
  { id: 3, query: "Q4 budget allocation details", confidence: 45, status: "failed", time: "8 min ago", user: "Mike R." },
  { id: 4, query: "Employee benefits overview", confidence: 92, status: "answered", time: "12 min ago", user: "Emily K." },
  { id: 5, query: "Project timeline for Phoenix", confidence: 38, status: "failed", time: "15 min ago", user: "David L." },
];

const timeRanges = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y", label: "Last Year" },
];

export default function Analytics() {
  const { isOnline } = useOnlineStatus();
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.loading("Refreshing analytics...", { id: "refresh" });
    setTimeout(() => {
      toast.success("Analytics updated", { id: "refresh" });
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExport = () => {
    toast.loading("Generating report...", { id: "export" });
    setTimeout(() => {
      toast.success(`Report exported (${timeRange})`, { id: "export" });
    }, 2000);
  };

  if (!isOnline) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <OfflineOverlay featureName="Analytics" variant="inline" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
                  <div className="relative p-2 sm:p-3 rounded-xl bg-primary/20">
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                  Analytics
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Performance metrics, usage insights & Knowledge Base analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-secondary/50 w-full sm:w-auto grid grid-cols-3">
            <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="failed-queries" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Failed</span>
              <span className="sm:hidden">Failed</span>
            </TabsTrigger>
            <TabsTrigger value="kb-coverage" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Database className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">KB Coverage</span>
              <span className="sm:hidden">Coverage</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Queries */}
              <Card className="glass-card group hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +23%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Queries</p>
                    <p className="text-2xl sm:text-3xl font-bold">12,847</p>
                    <p className="text-xs text-muted-foreground mt-1">This month</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Monthly goal</span>
                      <span className="text-primary font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>

              {/* Answer Rate */}
              <Card className="glass-card group hover:border-success/30 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-success/10 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2.1%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Answer Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-success">94.2%</p>
                    <p className="text-xs text-muted-foreground mt-1">Industry avg: 87%</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">Above target</span>
                  </div>
                </CardContent>
              </Card>

              {/* Positive Feedback */}
              <Card className="glass-card group hover:border-accent/30 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-accent/10 group-hover:scale-110 transition-transform duration-300">
                      <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +5%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Positive Feedback</p>
                    <p className="text-2xl sm:text-3xl font-bold text-accent">89%</p>
                    <p className="text-xs text-muted-foreground mt-1">11,432 reviews</p>
                  </div>
                  <div className="mt-4">
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-success rounded-full" style={{ width: "89%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="glass-card group hover:border-info/30 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-info/10 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -0.3s
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
                    <p className="text-2xl sm:text-3xl font-bold text-info">1.2s</p>
                    <p className="text-xs text-muted-foreground mt-1">Lightning fast ⚡</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    <Award className="w-3 h-3 text-info" />
                    <span className="text-xs text-info">Top 10% performance</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Weekly Query Volume - Enhanced */}
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">Weekly Query Volume</h3>
                        <p className="text-xs text-muted-foreground">Queries vs Answered</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      18.5% increase
                    </Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={queryData}>
                        <defs>
                          <linearGradient id="queriesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                          </linearGradient>
                          <linearGradient id="answeredGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(160 60% 35%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(160 60% 35%)" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(215 20% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222 47% 8% / 0.98)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid hsl(217 33% 17%)",
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                          }}
                          cursor={{ fill: "hsl(217 91% 60% / 0.1)" }}
                        />
                        <Bar dataKey="queries" fill="url(#queriesGradient)" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="answered" fill="url(#answeredGradient)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Confidence Trend - Enhanced */}
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <TrendingUp className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">Confidence Score Trend</h3>
                        <p className="text-xs text-muted-foreground">AI accuracy over time</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">88%</p>
                      <p className="text-xs text-muted-foreground">Avg confidence</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={confidenceData}>
                        <defs>
                          <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(160 60% 35%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(160 60% 35%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(215 20% 55%)" fontSize={12} tickLine={false} axisLine={false} domain={[75, 95]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222 47% 8% / 0.98)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid hsl(217 33% 17%)",
                            borderRadius: "12px",
                          }}
                          cursor={{ stroke: "hsl(160 60% 35% / 0.3)", strokeWidth: 2 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="confidence"
                          stroke="hsl(160 60% 35%)"
                          strokeWidth={3}
                          fill="url(#confidenceGradient)"
                          dot={{ fill: "hsl(222 47% 8%)", stroke: "hsl(160 60% 35%)", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Topic Distribution - Enhanced */}
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-info/10">
                        <Database className="w-5 h-5 text-info" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">Query Topics</h3>
                        <p className="text-xs text-muted-foreground">Distribution by category</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-48 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={topicDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="hsl(222 47% 8%)"
                            strokeWidth={2}
                          >
                            {topicDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(222 47% 8% / 0.98)",
                              backdropFilter: "blur(16px)",
                              border: "1px solid hsl(217 33% 17%)",
                              borderRadius: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      {topicDistribution.map((item) => (
                        <div key={item.name} className="flex items-center justify-between gap-2 group">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-xs sm:text-sm text-muted-foreground truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs sm:text-sm font-medium">{item.value}%</span>
                            <span className="text-[10px] text-muted-foreground hidden sm:inline">({item.queries.toLocaleString()})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Activity - NEW */}
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-warning/10">
                        <Clock className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">Hourly Activity</h3>
                        <p className="text-xs text-muted-foreground">Peak usage hours</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      Peak: 2:00 PM
                    </Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyActivity}>
                        <defs>
                          <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" vertical={false} />
                        <XAxis dataKey="hour" stroke="hsl(215 20% 55%)" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(215 20% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222 47% 8% / 0.98)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid hsl(217 33% 17%)",
                            borderRadius: "12px",
                          }}
                        />
                        <Bar dataKey="queries" fill="url(#hourlyGradient)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Feedback Summary - Enhanced */}
              <Card className="glass-card lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <ThumbsUp className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">User Feedback</h3>
                        <p className="text-xs text-muted-foreground">Satisfaction metrics</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-success/5 border border-success/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-success/20">
                          <ThumbsUp className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Positive</p>
                          <p className="text-xs text-muted-foreground">Helpful answers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-success">11,432</p>
                        <p className="text-xs text-success">89%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-destructive/20">
                          <ThumbsDown className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Negative</p>
                          <p className="text-xs text-muted-foreground">Needs improvement</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-destructive">1,415</p>
                        <p className="text-xs text-destructive">11%</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Satisfaction Score</span>
                        <span className="text-sm font-bold text-accent">89%</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent via-success to-info rounded-full" style={{ width: "89%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department Stats - NEW */}
              <Card className="glass-card lg:col-span-2">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">Department Analytics</h3>
                        <p className="text-xs text-muted-foreground">Documents & queries by dept</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {departmentStats.map((dept) => (
                      <div key={dept.name} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                            <span className="font-medium text-sm">{dept.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <span className="text-muted-foreground">
                              <span className="font-medium text-foreground">{dept.documents.toLocaleString()}</span> docs
                            </span>
                            <span className="text-muted-foreground">
                              <span className="font-medium text-foreground">{dept.queries.toLocaleString()}</span> queries
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(dept.documents / 1247) * 100}%`,
                                backgroundColor: dept.color 
                              }} 
                            />
                          </div>
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500 opacity-70"
                              style={{ 
                                width: `${(dept.queries / 4521) * 100}%`,
                                backgroundColor: dept.color 
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-primary/50" />
                      <span className="text-muted-foreground">Documents</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-primary/30" />
                      <span className="text-muted-foreground">Queries</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Queries Table - Enhanced */}
            <Card className="glass-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">Recent Queries</h3>
                      <p className="text-xs text-muted-foreground">Latest activity</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Query</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">User</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Confidence</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentQueries.map((query) => (
                        <tr key={query.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium truncate max-w-[150px] sm:max-w-xs">{query.query}</p>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                {query.user.charAt(0)}
                              </div>
                              <span className="text-sm text-muted-foreground">{query.user}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`text-sm font-bold ${
                                query.confidence >= 80 ? 'text-success' : 
                                query.confidence >= 60 ? 'text-warning' : 'text-destructive'
                              }`}>
                                {query.confidence}%
                              </div>
                              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
                                <div 
                                  className={`h-full rounded-full ${
                                    query.confidence >= 80 ? 'bg-success' : 
                                    query.confidence >= 60 ? 'bg-warning' : 'bg-destructive'
                                  }`}
                                  style={{ width: `${query.confidence}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                query.status === "answered" 
                                  ? "bg-success/10 text-success border-success/20" 
                                  : "bg-destructive/10 text-destructive border-destructive/20"
                              )}
                            >
                              {query.status === "answered" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {query.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <span className="text-xs text-muted-foreground">{query.time}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Failed Queries Tab */}
          <TabsContent value="failed-queries">
            <FailedQueriesAnalysis />
          </TabsContent>

          {/* KB Coverage Tab */}
          <TabsContent value="kb-coverage">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <KBCoverageStatus />
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    About KB Coverage Analysis
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-success mb-1">Coverage Rate</p>
                          <p className="text-muted-foreground">Shows the percentage of questions successfully answered from the Knowledge Base.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-info shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-info mb-1">Avg Confidence</p>
                          <p className="text-muted-foreground">Measures how confident the system is about the answers provided.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <Database className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-primary mb-1">Docs per Department</p>
                          <p className="text-muted-foreground">Distribution of documents available in the system by department.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
