import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { FailedQueriesAnalysis } from "@/components/analytics/FailedQueriesAnalysis";
import { KBCoverageStatus } from "@/components/analytics/KBCoverageStatus";
import { OfflineOverlay } from "@/components/pwa/OfflineOverlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Target,
  AlertTriangle,
  Database
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
  Line
} from "recharts";

const queryData = [
  { name: "Mon", queries: 145, answered: 132 },
  { name: "Tue", queries: 203, answered: 189 },
  { name: "Wed", queries: 187, answered: 176 },
  { name: "Thu", queries: 256, answered: 241 },
  { name: "Fri", queries: 289, answered: 268 },
  { name: "Sat", queries: 123, answered: 115 },
  { name: "Sun", queries: 98, answered: 92 },
];

const confidenceData = [
  { name: "Week 1", confidence: 82 },
  { name: "Week 2", confidence: 85 },
  { name: "Week 3", confidence: 84 },
  { name: "Week 4", confidence: 87 },
  { name: "Week 5", confidence: 89 },
  { name: "Week 6", confidence: 88 },
];

const topicDistribution = [
  { name: "HR Policies", value: 24, color: "hsl(217 91% 60%)" },
  { name: "IT Security", value: 20, color: "hsl(160 84% 39%)" },
  { name: "Product", value: 16, color: "hsl(199 89% 48%)" },
  { name: "Onboarding", value: 14, color: "hsl(38 92% 50%)" },
  { name: "Other", value: 26, color: "hsl(217 33% 40%)" },
];

export default function Analytics() {
  const { isOnline } = useOnlineStatus();

  return (
    <AppLayout>
      {!isOnline ? (
        <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
          <OfflineOverlay featureName="Analytics" variant="inline" />
        </div>
      ) : (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Performance metrics, usage insights & Knowledge Base analysis
          </p>
        </div>

        {/* Tabs for different analytics views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="failed-queries" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Failed Queries
            </TabsTrigger>
            <TabsTrigger value="kb-coverage" className="gap-2">
              <Database className="w-4 h-4" />
              KB Coverage
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Queries"
            value="12,847"
            change="+23% this month"
            changeType="positive"
            icon={MessageSquare}
            iconColor="text-primary"
          />
          <StatCard
            title="Answer Rate"
            value="94.2%"
            change="+2.1% improvement"
            changeType="positive"
            icon={Target}
            iconColor="text-success"
          />
          <StatCard
            title="Positive Feedback"
            value="89%"
            change="+5% from last month"
            changeType="positive"
            icon={ThumbsUp}
            iconColor="text-accent"
          />
          <StatCard
            title="Avg Response Time"
            value="1.2s"
            change="-0.3s faster"
            changeType="positive"
            icon={Clock}
            iconColor="text-info"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Queries */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold mb-4">Weekly Query Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
                  <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222 47% 10%)",
                      border: "1px solid hsl(217 33% 17%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="queries" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="answered" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Confidence Trend */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold mb-4">Confidence Score Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
                  <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={12} domain={[75, 95]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222 47% 10%)",
                      border: "1px solid hsl(217 33% 17%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="hsl(160 84% 39%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(160 84% 39%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Distribution */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold mb-4">Query Topic Distribution</h3>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {topicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222 47% 10%)",
                      border: "1px solid hsl(217 33% 17%)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 ml-4">
                {topicDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Summary */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold mb-4">User Feedback Summary</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <ThumbsUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Positive Feedback</p>
                    <p className="text-sm text-muted-foreground">Helpful answers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">11,432</p>
                  <p className="text-sm text-muted-foreground">89%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <ThumbsDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">Negative Feedback</p>
                    <p className="text-sm text-muted-foreground">Needs improvement</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-destructive">1,415</p>
                  <p className="text-sm text-muted-foreground">11%</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-success to-accent rounded-full" style={{ width: "89%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">Overall satisfaction score: 89%</p>
              </div>
            </div>
          </div>
        </div>
          </TabsContent>

          {/* Failed Queries Tab */}
          <TabsContent value="failed-queries">
            <FailedQueriesAnalysis />
          </TabsContent>

          {/* KB Coverage Tab */}
          <TabsContent value="kb-coverage">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KBCoverageStatus />
              <div className="space-y-6">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Tentang Analisis KB</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Tingkat Cakupan</strong> menunjukkan persentase 
                      pertanyaan yang berhasil dijawab berdasarkan Knowledge Base.
                    </p>
                    <p>
                      <strong className="text-foreground">Rata-rata Confidence</strong> mengukur 
                      seberapa yakin sistem terhadap jawaban yang diberikan.
                    </p>
                    <p>
                      <strong className="text-foreground">Dokumen per Departemen</strong> menampilkan 
                      distribusi dokumen yang tersedia dalam sistem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      )}
    </AppLayout>
  );
}
