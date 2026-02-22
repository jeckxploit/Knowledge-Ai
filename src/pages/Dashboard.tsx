import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { IngestionStatus } from "@/components/dashboard/IngestionStatus";
import { QueryAnalytics } from "@/components/dashboard/QueryAnalytics";
import { RecentQueries } from "@/components/dashboard/RecentQueries";
import { TopTopics } from "@/components/dashboard/TopTopics";
import {
  FileText,
  MessageSquare,
  Brain,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  Activity
} from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Enhanced Page Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20 glow-effect">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Real-time insights into your knowledge base performance and AI-powered analytics
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                <Zap className="w-4 h-4" />
                <span>System Operational</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-info">
                <Activity className="w-4 h-4" />
                <span>Live Updates Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Documents"
            value="2,847"
            change="+124 this week"
            changeType="positive"
            icon={FileText}
            iconColor="text-primary"
            gradient="from-primary/20 to-primary/5"
          />
          <StatCard
            title="Queries Today"
            value="1,284"
            change="+18% from yesterday"
            changeType="positive"
            icon={MessageSquare}
            iconColor="text-info"
            gradient="from-info/20 to-info/5"
          />
          <StatCard
            title="Answer Rate"
            value="94.2%"
            change="+2.1% improvement"
            changeType="positive"
            icon={Brain}
            iconColor="text-accent"
            gradient="from-accent/20 to-accent/5"
          />
          <StatCard
            title="Avg. Confidence"
            value="87.5%"
            change="Stable"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="text-warning"
            gradient="from-warning/20 to-warning/5"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Charts */}
          <div className="xl:col-span-2 space-y-6 sm:space-y-8">
            <QueryAnalytics />
            <RecentQueries />
          </div>

          {/* Right Column - Status & Topics */}
          <div className="space-y-6 sm:space-y-8">
            {/* Enhanced Processing Status */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-success/10 to-info/10 p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Processing Status</h3>
                    <p className="text-xs text-muted-foreground">Real-time pipeline overview</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-success/5 border border-success/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/20">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm font-medium">Indexed Documents</span>
                  </div>
                  <span className="text-lg font-bold text-success">2,734</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-info/5 border border-info/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-info/20">
                      <Clock className="w-4 h-4 text-info animate-pulse" />
                    </div>
                    <span className="text-sm font-medium">Processing</span>
                  </div>
                  <span className="text-lg font-bold text-info">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted/20">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-muted-foreground">89</span>
                </div>
              </div>
            </div>

            <TopTopics />
          </div>
        </div>

        {/* Bottom Section - Ingestion Pipeline */}
        <IngestionStatus />
      </div>
    </AppLayout>
  );
}
