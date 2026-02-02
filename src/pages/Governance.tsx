import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  user: string;
  resource: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

interface PendingApproval {
  id: string;
  document: string;
  submittedBy: string;
  submittedAt: string;
  sensitivity: "public" | "internal" | "confidential";
}

const mockAuditLogs: AuditLog[] = [
  { id: "1", action: "Document uploaded", user: "John A.", resource: "Q4_Report.pdf", timestamp: "2 min ago", status: "success" },
  { id: "2", action: "Query executed", user: "Sarah M.", resource: "AI Query", timestamp: "5 min ago", status: "success" },
  { id: "3", action: "Access denied", user: "Unknown", resource: "Confidential Doc", timestamp: "12 min ago", status: "error" },
  { id: "4", action: "Role changed", user: "Admin", resource: "Mike C.", timestamp: "1 hour ago", status: "warning" },
  { id: "5", action: "Document indexed", user: "System", resource: "API_Docs.md", timestamp: "2 hours ago", status: "success" },
];

const mockApprovals: PendingApproval[] = [
  { id: "1", document: "Financial_Report_Q4.pdf", submittedBy: "Sarah Mitchell", submittedAt: "1 hour ago", sensitivity: "confidential" },
  { id: "2", document: "New_Policy_Draft.docx", submittedBy: "Mike Chen", submittedAt: "3 hours ago", sensitivity: "internal" },
  { id: "3", document: "Public_FAQ.md", submittedBy: "Emily Davis", submittedAt: "1 day ago", sensitivity: "public" },
];

const sensitivityConfig = {
  public: { label: "Public", className: "badge-success" },
  internal: { label: "Internal", className: "badge-info" },
  confidential: { label: "Confidential", className: "badge-destructive" },
};

export default function Governance() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Knowledge Governance
          </h1>
          <p className="text-muted-foreground mt-1">
            Audit logs, approvals, and compliance management
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Pending Approvals", value: "12", icon: Clock, color: "text-warning" },
            { label: "Documents Approved", value: "2,456", icon: CheckCircle, color: "text-success" },
            { label: "Security Alerts", value: "3", icon: AlertTriangle, color: "text-destructive" },
            { label: "Audit Events (24h)", value: "1,284", icon: History, color: "text-info" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className={cn("p-2 rounded-lg bg-secondary/50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="approvals" className="gap-2">
              <FileCheck className="w-4 h-4" />
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <History className="w-4 h-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals */}
          <TabsContent value="approvals">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold">Documents Awaiting Approval</h3>
              </div>
              <div className="divide-y divide-border/50">
                {mockApprovals.map((item) => (
                  <div key={item.id} className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.document}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.submittedBy}</span>
                        <span className="text-xs text-muted-foreground">• {item.submittedAt}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("capitalize", sensitivityConfig[item.sensitivity].className)}>
                      {sensitivityConfig[item.sensitivity].label}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Audit Log */}
          <TabsContent value="audit">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-semibold">Recent Activity</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLogs.map((log) => (
                    <TableRow key={log.id} className="border-border/50 hover:bg-secondary/30">
                      <TableCell>
                        {log.status === "success" && <CheckCircle className="w-4 h-4 text-success" />}
                        {log.status === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
                        {log.status === "error" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.user}</TableCell>
                      <TableCell className="text-muted-foreground">{log.resource}</TableCell>
                      <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
