import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  RefreshCw,
  ChevronDown,
  User,
  Brain,
  FileText,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryLog {
  id: string;
  query: string;
  user: string;
  department: string;
  timestamp: string;
  confidence: number;
  status: "answered" | "failed" | "partial";
  sourcesCount: number;
  responseTime: string;
  feedback?: "positive" | "negative" | null;
  category: string;
}

const mockQueryLogs: QueryLog[] = [
  {
    id: "1",
    query: "What is the company's remote work policy for international employees?",
    user: "John Doe",
    department: "Engineering",
    timestamp: "2024-01-15 14:32",
    confidence: 94,
    status: "answered",
    sourcesCount: 3,
    responseTime: "1.2s",
    feedback: "positive",
    category: "HR Policies",
  },
  {
    id: "2",
    query: "How do I request access to the data warehouse?",
    user: "Sarah Miller",
    department: "Marketing",
    timestamp: "2024-01-15 14:28",
    confidence: 87,
    status: "answered",
    sourcesCount: 2,
    responseTime: "0.9s",
    feedback: null,
    category: "IT Security",
  },
  {
    id: "3",
    query: "What are the security protocols for handling PII data?",
    user: "Mike Ross",
    department: "Legal",
    timestamp: "2024-01-15 14:15",
    confidence: 72,
    status: "partial",
    sourcesCount: 5,
    responseTime: "2.1s",
    feedback: "negative",
    category: "IT Security",
  },
  {
    id: "4",
    query: "Can you explain the new product roadmap for Q2?",
    user: "Emily Chen",
    department: "Product",
    timestamp: "2024-01-15 13:58",
    confidence: 45,
    status: "failed",
    sourcesCount: 0,
    responseTime: "1.5s",
    feedback: null,
    category: "Product",
  },
  {
    id: "5",
    query: "What is the vacation accrual policy?",
    user: "David Lee",
    department: "HR",
    timestamp: "2024-01-15 13:45",
    confidence: 91,
    status: "answered",
    sourcesCount: 2,
    responseTime: "0.8s",
    feedback: "positive",
    category: "HR Policies",
  },
  {
    id: "6",
    query: "How to configure VPN on Mac?",
    user: "Anna Kim",
    department: "Engineering",
    timestamp: "2024-01-15 13:30",
    confidence: 88,
    status: "answered",
    sourcesCount: 3,
    responseTime: "1.1s",
    feedback: null,
    category: "IT Security",
  },
  {
    id: "7",
    query: "What are the Q4 budget targets?",
    user: "Tom Wilson",
    department: "Finance",
    timestamp: "2024-01-15 13:15",
    confidence: 38,
    status: "failed",
    sourcesCount: 0,
    responseTime: "1.8s",
    feedback: "negative",
    category: "Finance",
  },
  {
    id: "8",
    query: "Employee benefits overview for 2024",
    user: "Lisa Brown",
    department: "HR",
    timestamp: "2024-01-15 12:58",
    confidence: 95,
    status: "answered",
    sourcesCount: 4,
    responseTime: "1.0s",
    feedback: "positive",
    category: "HR Policies",
  },
];

const statusColors = {
  answered: "bg-success/10 text-success border-success/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  partial: "bg-warning/10 text-warning border-warning/20",
};

const confidenceColors = {
  high: "text-success",
  medium: "text-warning",
  low: "text-destructive",
};

export default function QueryLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterConfidence, setFilterConfidence] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<QueryLog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleRefresh = () => {
    toast.loading("Refreshing logs...", { id: "refresh" });
    setTimeout(() => {
      toast.success("Logs updated", { id: "refresh" });
    }, 1000);
  };

  const handleExport = () => {
    toast.loading("Exporting logs...", { id: "export" });
    setTimeout(() => {
      toast.success("Query logs exported", { id: "export" });
    }, 1500);
  };

  const handleViewLog = (log: QueryLog) => {
    setSelectedLog(log);
    setIsViewDialogOpen(true);
  };

  const getConfidenceLevel = (confidence: number): "high" | "medium" | "low" => {
    if (confidence >= 80) return "high";
    if (confidence >= 60) return "medium";
    return "low";
  };

  const filteredLogs = mockQueryLogs.filter((log) => {
    const matchesSearch = log.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesConfidence = filterConfidence === "all" || getConfidenceLevel(log.confidence) === filterConfidence;
    const matchesDepartment = filterDepartment === "all" || log.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesConfidence && matchesDepartment;
  });

  const stats = {
    total: filteredLogs.length,
    answered: filteredLogs.filter(l => l.status === "answered").length,
    failed: filteredLogs.filter(l => l.status === "failed").length,
    avgConfidence: Math.round(filteredLogs.reduce((acc, l) => acc + l.confidence, 0) / filteredLogs.length) || 0,
  };

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
                <div className="relative p-2 sm:p-3 rounded-xl bg-primary/20">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                Query Logs
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track and analyze all knowledge base queries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Queries</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>
              <p className="text-2xl font-bold text-success">{stats.answered}</p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
              </div>
              <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-info/10">
                  <Brain className="w-5 h-5 text-info" />
                </div>
              </div>
              <p className="text-2xl font-bold text-info">{stats.avgConfidence}%</p>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search queries or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn("gap-2", (filterStatus !== "all" || filterConfidence !== "all" || filterDepartment !== "all") && "border-primary bg-primary/5")}
              >
                <Filter className={cn("w-4 h-4", (filterStatus !== "all" || filterConfidence !== "all" || filterDepartment !== "all") && "text-primary")} />
                Filters
                {(filterStatus !== "all" || filterConfidence !== "all" || filterDepartment !== "all") && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
            </div>

            {isFiltersOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="answered">Answered</option>
                    <option value="failed">Failed</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Confidence</label>
                  <select
                    value={filterConfidence}
                    onChange={(e) => setFilterConfidence(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="high">High (80%+)</option>
                    <option value="medium">Medium (60-79%)</option>
                    <option value="low">Low (&lt;60%)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-sm"
                  >
                    <option value="all">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Legal">Legal</option>
                    <option value="Product">Product</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Query Logs Table */}
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No query logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/20">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Query</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">User</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Confidence</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Sources</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Response Time</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium truncate max-w-[200px]">{log.query}</p>
                          <p className="text-xs text-muted-foreground">{log.category}</p>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                              {log.user.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{log.user}</p>
                              <p className="text-xs text-muted-foreground">{log.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={cn("text-xs capitalize", statusColors[log.status])}>
                            {log.status === "answered" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {log.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                            {log.status === "partial" && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {log.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-bold",
                              confidenceColors[getConfidenceLevel(log.confidence)]
                            )}>
                              {log.confidence}%
                            </span>
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  log.confidence >= 80 ? "bg-success" : 
                                  log.confidence >= 60 ? "bg-warning" : "bg-destructive"
                                )}
                                style={{ width: `${log.confidence}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">{log.sourcesCount} sources</span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">{log.responseTime}</span>
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewLog(log)} className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="w-4 h-4 mr-2" />
                                View Response
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                Export Log
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Query Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this query
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              {/* Query */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm font-semibold mb-2">Query</p>
                <p className="text-base">{selectedLog.query}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> User
                  </label>
                  <p className="font-medium">{selectedLog.user}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Department
                  </label>
                  <p className="font-medium">{selectedLog.department}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Timestamp
                  </label>
                  <p className="font-medium">{selectedLog.timestamp}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Response Time
                  </label>
                  <p className="font-medium">{selectedLog.responseTime}</p>
                </div>
              </div>

              {/* Status & Confidence */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Status</p>
                  <Badge variant="outline" className={cn("capitalize", statusColors[selectedLog.status])}>
                    {selectedLog.status === "answered" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {selectedLog.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                    {selectedLog.status === "partial" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {selectedLog.status}
                  </Badge>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Confidence</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xl font-bold",
                      confidenceColors[getConfidenceLevel(selectedLog.confidence)]
                    )}>
                      {selectedLog.confidence}%
                    </span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          selectedLog.confidence >= 80 ? "bg-success" : 
                          selectedLog.confidence >= 60 ? "bg-warning" : "bg-destructive"
                        )}
                        style={{ width: `${selectedLog.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Sources Used</p>
                <p className="font-semibold">{selectedLog.sourcesCount} documents</p>
              </div>

              {/* Feedback */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3">User Feedback</p>
                {selectedLog.feedback ? (
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg",
                      selectedLog.feedback === "positive" 
                        ? "bg-success/10 text-success" 
                        : "bg-destructive/10 text-destructive"
                    )}>
                      {selectedLog.feedback === "positive" ? (
                        <><ThumbsUp className="w-4 h-4" /> Positive</>
                      ) : (
                        <><ThumbsDown className="w-4 h-4" /> Negative</>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No feedback provided</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
