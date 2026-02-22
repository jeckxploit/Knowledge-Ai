import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Shield,
  FileCheck,
  History,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Eye,
  Download,
  RefreshCw,
  Search,
  Filter,
  X,
  Lock,
  Key,
  Activity,
  TrendingUp,
  Calendar,
  ChevronDown,
  Settings,
  FileWarning,
  UserCheck,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  user: string;
  userAvatar?: string;
  resource: string;
  resourceType: "document" | "query" | "user" | "system";
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
  details?: string;
  ipAddress?: string;
}

interface PendingApproval {
  id: string;
  document: string;
  submittedBy: string;
  submittedByAvatar?: string;
  submittedAt: string;
  sensitivity: "public" | "internal" | "confidential";
  department: string;
  fileSize: string;
  description: string;
  priority: "low" | "medium" | "high";
}

interface ComplianceMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: any;
  color: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: "1", action: "Document uploaded", user: "John Anderson", userAvatar: "", resource: "Q4_Report.pdf", resourceType: "document", timestamp: "2024-01-15 14:32", status: "success", details: "File size: 2.4 MB", ipAddress: "192.168.1.100" },
  { id: "2", action: "Query executed", user: "Sarah Mitchell", userAvatar: "", resource: "AI Query", resourceType: "query", timestamp: "2024-01-15 14:28", status: "info", details: "Confidence: 94%", ipAddress: "192.168.1.101" },
  { id: "3", action: "Access denied", user: "Unknown User", userAvatar: "", resource: "Confidential_Doc.pdf", resourceType: "document", timestamp: "2024-01-15 14:15", status: "error", details: "Insufficient permissions", ipAddress: "192.168.1.105" },
  { id: "4", action: "Role changed", user: "Admin", userAvatar: "", resource: "Mike Chen", resourceType: "user", timestamp: "2024-01-15 13:58", status: "warning", details: "Viewer → Editor", ipAddress: "192.168.1.1" },
  { id: "5", action: "Document indexed", user: "System", userAvatar: "", resource: "API_Docs.md", resourceType: "system", timestamp: "2024-01-15 13:45", status: "success", details: "234 chunks created", ipAddress: "localhost" },
  { id: "6", action: "Failed login attempt", user: "Emily Davis", userAvatar: "", resource: "Authentication", resourceType: "system", timestamp: "2024-01-15 13:30", status: "error", details: "Invalid password (3 attempts)", ipAddress: "192.168.1.110" },
  { id: "7", action: "Settings updated", user: "Admin", userAvatar: "", resource: "Security Config", resourceType: "system", timestamp: "2024-01-15 13:15", status: "warning", details: "2FA enabled", ipAddress: "192.168.1.1" },
  { id: "8", action: "Document downloaded", user: "Lisa Brown", userAvatar: "", resource: "Employee_Handbook.pdf", resourceType: "document", timestamp: "2024-01-15 12:58", status: "success", details: "Version: 3.2", ipAddress: "192.168.1.115" },
];

const mockApprovals: PendingApproval[] = [
  { id: "1", document: "Financial_Report_Q4.pdf", submittedBy: "Sarah Mitchell", submittedByAvatar: "", submittedAt: "2024-01-15 13:32", sensitivity: "confidential", department: "Finance", fileSize: "3.2 MB", description: "Quarterly financial report with revenue and expense breakdown", priority: "high" },
  { id: "2", document: "New_Policy_Draft.docx", submittedBy: "Mike Chen", submittedByAvatar: "", submittedAt: "2024-01-15 11:15", sensitivity: "internal", department: "HR", fileSize: "890 KB", description: "Updated remote work policy for 2024", priority: "medium" },
  { id: "3", document: "Public_FAQ.md", submittedBy: "Emily Davis", submittedByAvatar: "", submittedAt: "2024-01-14 16:45", sensitivity: "public", department: "Marketing", fileSize: "156 KB", description: "Frequently asked questions for public website", priority: "low" },
  { id: "4", document: "Security_Protocol_v2.pdf", submittedBy: "John Anderson", submittedByAvatar: "", submittedAt: "2024-01-14 14:20", sensitivity: "confidential", department: "IT", fileSize: "1.8 MB", description: "Updated security protocols and best practices", priority: "high" },
  { id: "5", document: "Training_Manual.pdf", submittedBy: "Anna Kim", submittedByAvatar: "", submittedAt: "2024-01-14 10:00", sensitivity: "internal", department: "Operations", fileSize: "5.4 MB", description: "Employee training manual for new hires", priority: "medium" },
];

const complianceMetrics: ComplianceMetric[] = [
  { label: "Compliance Score", value: "98.5%", change: "+2.3%", trend: "up", icon: Activity, color: "text-success" },
  { label: "Policy Adherence", value: "96.2%", change: "+1.1%", trend: "up", icon: CheckCircle, color: "text-info" },
  { label: "Audit Coverage", value: "100%", change: "0%", trend: "stable", icon: Shield, color: "text-primary" },
  { label: "Risk Level", value: "Low", change: "-15%", trend: "down", icon: AlertTriangle, color: "text-warning" },
];

const sensitivityConfig = {
  public: { label: "Public", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  internal: { label: "Internal", className: "bg-info/10 text-info border-info/20", icon: Lock },
  confidential: { label: "Confidential", className: "bg-destructive/10 text-destructive border-destructive/20", icon: Key },
};

const priorityConfig = {
  low: { label: "Low", className: "bg-muted/20 text-muted-foreground border-border/50" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const resourceTypeIcons = {
  document: FileText,
  query: Activity,
  user: User,
  system: Settings,
};

export default function Governance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isAuditDetailOpen, setIsAuditDetailOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);

  const handleRefresh = () => {
    toast.loading("Refreshing governance data...", { id: "refresh" });
    setTimeout(() => {
      toast.success("Governance data updated", { id: "refresh" });
    }, 1000);
  };

  const handleExport = () => {
    toast.loading("Generating report...", { id: "export" });
    setTimeout(() => {
      toast.success("Audit report exported", { id: "export" });
    }, 1500);
  };

  const handleApprove = (id: string) => {
    toast.success("Document approved successfully");
  };

  const handleReject = (id: string) => {
    setIsReviewDialogOpen(false);
    toast.info("Document rejected");
  };

  const handleViewAudit = (log: AuditLog) => {
    setSelectedAudit(log);
    setIsAuditDetailOpen(true);
  };

  const filteredAuditLogs = mockAuditLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesType = filterType === "all" || log.resourceType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

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
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                  Knowledge Governance
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Audit logs, approvals, and compliance management
              </p>
            </div>
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

        {/* Compliance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {complianceMetrics.map((metric) => (
            <Card key={metric.label} className="glass-card group hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                    <metric.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", metric.color)} />
                  </div>
                  <div className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-1 rounded-full",
                    metric.trend === "up" ? "bg-success/10 text-success" :
                    metric.trend === "down" ? "bg-warning/10 text-warning" : "bg-muted/20 text-muted-foreground"
                  )}>
                    {metric.trend === "up" && <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {metric.trend === "down" && <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-180" />}
                    <span className="hidden xs:inline">{metric.change}</span>
                    <span className="xs:hidden">{metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}</span>
                  </div>
                </div>
                <p className={cn("text-lg sm:text-2xl font-bold", metric.color)}>{metric.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-0">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="approvals" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-secondary/50 w-full sm:w-auto grid grid-cols-2">
            <TabsTrigger value="approvals" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <FileCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Pending Approvals</span>
              <span className="sm:hidden">Approvals</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Audit Log</span>
              <span className="sm:hidden">Audit</span>
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="approvals" className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                <h3 className="font-semibold text-sm sm:text-base">{mockApprovals.length} Documents Awaiting Approval</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {mockApprovals.map((item) => {
                const SensitivityIcon = sensitivityConfig[item.sensitivity].icon;
                return (
                  <Card key={item.id} className="glass-card group hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 shrink-0">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base truncate">{item.document}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                                  {item.submittedBy.charAt(0)}
                                </div>
                                <span className="text-xs text-muted-foreground truncate">{item.submittedBy}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">• {item.submittedAt}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] sm:text-xs capitalize shrink-0", sensitivityConfig[item.sensitivity].className)}>
                          <SensitivityIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                          <span className="hidden sm:inline">{sensitivityConfig[item.sensitivity].label}</span>
                          <span className="sm:hidden">{sensitivityConfig[item.sensitivity].label.charAt(0)}</span>
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.description}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-2 sm:pt-3 border-t border-border/50">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs">
                          <span className="text-muted-foreground">{item.department}</span>
                          <span className="text-muted-foreground">{item.fileSize}</span>
                          <Badge variant="outline" className={cn("text-[10px] capitalize", priorityConfig[item.priority].className)}>
                            {priorityConfig[item.priority].label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelectedApproval(item); setIsReviewDialogOpen(true); }}
                            className="h-8 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Review</span>
                          </Button>
                          <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground h-8 text-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(item.id)}
                            className="h-8 text-xs"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reject</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-3 sm:space-y-4">
            {/* Search and Filters */}
            <Card className="glass-card">
              <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search audit logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary/50 h-9 sm:h-10 text-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={cn("gap-2 h-9 sm:h-10", (filterStatus !== "all" || filterType !== "all") && "border-primary bg-primary/5")}
                  >
                    <Filter className={cn("w-4 h-4", (filterStatus !== "all" || filterType !== "all") && "text-primary")} />
                    <span className="hidden sm:inline">Filters</span>
                    {(filterStatus !== "all" || filterType !== "all") && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </div>

                {isFiltersOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/50">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-sm h-9"
                      >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                        <option value="info">Info</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Resource Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-sm h-9"
                      >
                        <option value="all">All Types</option>
                        <option value="document">Document</option>
                        <option value="query">Query</option>
                        <option value="user">User</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit Logs - Mobile Card View */}
            <div className="space-y-2 sm:hidden">
              {filteredAuditLogs.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="p-12 text-center">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No audit logs found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAuditLogs.map((log) => {
                  const ResourceIcon = resourceTypeIcons[log.resourceType];
                  return (
                    <Card key={log.id} className="glass-card" onClick={() => handleViewAudit(log)}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <div className={cn(
                              "p-1.5 rounded-md w-fit shrink-0",
                              log.status === "success" && "bg-success/10",
                              log.status === "warning" && "bg-warning/10",
                              log.status === "error" && "bg-destructive/10",
                              log.status === "info" && "bg-info/10"
                            )}>
                              {log.status === "success" && <CheckCircle className="w-4 h-4 text-success" />}
                              {log.status === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
                              {log.status === "error" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                              {log.status === "info" && <Activity className="w-4 h-4 text-info" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{log.action}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                                  {log.user.charAt(0)}
                                </div>
                                <span className="text-xs text-muted-foreground truncate">{log.user}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <ResourceIcon className="w-3 h-3" />
                                <span className="truncate">{log.resource}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{log.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Audit Logs Table - Desktop View */}
            <Card className="glass-card overflow-hidden hidden sm:block">
              <CardContent className="p-0">
                {filteredAuditLogs.length === 0 ? (
                  <div className="p-12 text-center">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No audit logs found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 bg-secondary/20">
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Resource</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAuditLogs.map((log) => {
                          const ResourceIcon = resourceTypeIcons[log.resourceType];
                          return (
                            <TableRow
                              key={log.id}
                              className="border-border/50 hover:bg-secondary/20 transition-colors cursor-pointer"
                              onClick={() => handleViewAudit(log)}
                            >
                              <TableCell>
                                <div className={cn(
                                  "p-1.5 rounded-md w-fit",
                                  log.status === "success" && "bg-success/10",
                                  log.status === "warning" && "bg-warning/10",
                                  log.status === "error" && "bg-destructive/10",
                                  log.status === "info" && "bg-info/10"
                                )}>
                                  {log.status === "success" && <CheckCircle className="w-4 h-4 text-success" />}
                                  {log.status === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
                                  {log.status === "error" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                                  {log.status === "info" && <Activity className="w-4 h-4 text-info" />}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                    {log.user.charAt(0)}
                                  </div>
                                  <span className="text-sm">{log.user}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <ResourceIcon className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{log.resource}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span className="text-sm">{log.timestamp}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Document Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileCheck className="w-5 h-5 text-primary" />
              Review Document
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Review and approve or reject this document
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4 sm:space-y-6">
              {/* Document Info */}
              <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-primary/20 shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{selectedApproval.document}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{selectedApproval.description}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> Submitted By
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                      {selectedApproval.submittedBy.charAt(0)}
                    </div>
                    <span className="font-medium text-sm truncate">{selectedApproval.submittedBy}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Submitted At
                  </label>
                  <p className="font-medium text-sm">{selectedApproval.submittedAt}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Department
                  </label>
                  <p className="font-medium text-sm">{selectedApproval.department}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Activity className="w-3 h-3" /> File Size
                  </label>
                  <p className="font-medium text-sm">{selectedApproval.fileSize}</p>
                </div>
              </div>

              {/* Sensitivity & Priority */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <label className="text-xs text-muted-foreground mb-2 block">Sensitivity Level</label>
                  <Badge variant="outline" className={cn("text-[10px] sm:text-xs capitalize", sensitivityConfig[selectedApproval.sensitivity].className)}>
                    {sensitivityConfig[selectedApproval.sensitivity].label}
                  </Badge>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <label className="text-xs text-muted-foreground mb-2 block">Priority</label>
                  <Badge variant="outline" className={cn("text-[10px] sm:text-xs capitalize", priorityConfig[selectedApproval.priority].className)}>
                    {priorityConfig[selectedApproval.priority].label}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 sm:p-4 rounded-xl bg-warning/5 border border-warning/20">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base text-warning mb-1">Review Required</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Please review this document carefully before approving. This action will be logged in the audit trail.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleReject(selectedApproval?.id || "")} className="w-full sm:w-auto">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => handleApprove(selectedApproval?.id || "")} className="w-full sm:w-auto">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Detail Dialog */}
      <Dialog open={isAuditDetailOpen} onOpenChange={setIsAuditDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <History className="w-5 h-5 text-primary" />
              Audit Log Details
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Detailed information about this audit event
            </DialogDescription>
          </DialogHeader>
          {selectedAudit && (
            <div className="space-y-3 sm:space-y-4">
              {/* Status Badge */}
              <div className={cn(
                "p-3 sm:p-4 rounded-xl flex items-center gap-3",
                selectedAudit.status === "success" && "bg-success/5 border border-success/20",
                selectedAudit.status === "warning" && "bg-warning/5 border border-warning/20",
                selectedAudit.status === "error" && "bg-destructive/5 border border-destructive/20",
                selectedAudit.status === "info" && "bg-info/5 border border-info/20"
              )}>
                {selectedAudit.status === "success" && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success shrink-0" />}
                {selectedAudit.status === "warning" && <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-warning shrink-0" />}
                {selectedAudit.status === "error" && <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive shrink-0" />}
                {selectedAudit.status === "info" && <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-info shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">{selectedAudit.action}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground capitalize">{selectedAudit.status}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-xs sm:text-sm text-muted-foreground">User</span>
                  <span className="font-medium text-sm truncate ml-2">{selectedAudit.user}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-xs sm:text-sm text-muted-foreground">Resource</span>
                  <span className="font-medium text-sm truncate ml-2">{selectedAudit.resource}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-xs sm:text-sm text-muted-foreground">Resource Type</span>
                  <Badge variant="outline" className="text-[10px] sm:text-xs capitalize">{selectedAudit.resourceType}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-xs sm:text-sm text-muted-foreground">Timestamp</span>
                  <span className="font-medium text-sm">{selectedAudit.timestamp}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-xs sm:text-sm text-muted-foreground">Details</span>
                  <span className="font-medium text-sm">{selectedAudit.details}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">IP Address</span>
                  <span className="font-medium font-mono text-[10px] sm:text-xs">{selectedAudit.ipAddress}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAuditDetailOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
