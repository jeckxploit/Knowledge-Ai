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
  Clock
} from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your knowledge base and AI performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Documents"
            value="2,847"
            change="+124 this week"
            changeType="positive"
            icon={FileText}
            iconColor="text-primary"
          />
          <StatCard
            title="Queries Today"
            value="1,284"
            change="+18% from yesterday"
            changeType="positive"
            icon={MessageSquare}
            iconColor="text-info"
          />
          <StatCard
            title="Answer Rate"
            value="94.2%"
            change="+2.1% improvement"
            changeType="positive"
            icon={Brain}
            iconColor="text-accent"
          />
          <StatCard
            title="Avg. Confidence"
            value="87.5%"
            change="Stable"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="text-warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <QueryAnalytics />
            <RecentQueries />
          </div>

          {/* Right Column - Status & Topics */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-4">Processing Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Indexed Documents</span>
                  </div>
                  <span className="font-medium">2,734</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-info animate-pulse" />
                    <span className="text-sm">Processing</span>
                  </div>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-medium">89</span>
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
