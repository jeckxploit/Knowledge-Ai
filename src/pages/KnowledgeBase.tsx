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
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  FileText, 
  Link2, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  FolderOpen,
  Grid3X3,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  type: "pdf" | "docx" | "txt" | "url" | "md";
  category: string;
  sensitivity: "public" | "internal" | "confidential";
  author: string;
  department: string;
  version: string;
  indexed: boolean;
  chunksCount: number;
  lastUpdated: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Employee Handbook 2024",
    type: "pdf",
    category: "HR Policies",
    sensitivity: "internal",
    author: "HR Team",
    department: "Human Resources",
    version: "3.2",
    indexed: true,
    chunksCount: 156,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    title: "Security Best Practices",
    type: "docx",
    category: "IT Security",
    sensitivity: "confidential",
    author: "Security Team",
    department: "IT",
    version: "2.1",
    indexed: true,
    chunksCount: 89,
    lastUpdated: "2024-01-12",
  },
  {
    id: "3",
    title: "API Documentation",
    type: "md",
    category: "Technical Docs",
    sensitivity: "internal",
    author: "Engineering",
    department: "Engineering",
    version: "5.0",
    indexed: true,
    chunksCount: 234,
    lastUpdated: "2024-01-10",
  },
  {
    id: "4",
    title: "Company Wiki",
    type: "url",
    category: "General",
    sensitivity: "public",
    author: "Admin",
    department: "Operations",
    version: "1.0",
    indexed: false,
    chunksCount: 0,
    lastUpdated: "2024-01-08",
  },
  {
    id: "5",
    title: "Onboarding Guide",
    type: "pdf",
    category: "HR Policies",
    sensitivity: "internal",
    author: "HR Team",
    department: "Human Resources",
    version: "1.5",
    indexed: true,
    chunksCount: 67,
    lastUpdated: "2024-01-05",
  },
];

const typeIcons = {
  pdf: "📄",
  docx: "📝",
  txt: "📃",
  url: "🔗",
  md: "📋",
};

const sensitivityColors = {
  public: "badge-success",
  internal: "badge-info",
  confidential: "badge-destructive",
};

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-primary" />
              Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage your indexed documents
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Document
          </Button>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-semibold">2,847 documents</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Indexed:</span>
              <span className="font-semibold text-success">2,734</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Pending:</span>
              <span className="font-semibold text-warning">113</span>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[400px]">Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sensitivity</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Chunks</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDocuments.map((doc) => (
                <TableRow key={doc.id} className="border-border/50 hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeIcons[doc.type]}</span>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.author}</p>
                      </div>
                      {doc.indexed && (
                        <Badge variant="outline" className="text-xs badge-success">
                          Indexed
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{doc.category}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs capitalize", sensitivityColors[doc.sensitivity])}>
                      {doc.sensitivity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{doc.department}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">v{doc.version}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{doc.chunksCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{doc.lastUpdated}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Metadata
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
