import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Upload,
  Link2,
  FileText,
  Plus,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings2,
  RefreshCw,
  Trash2,
  Play,
  Pause,
  MoreVertical,
  Eye,
  Download,
  Zap,
  FolderOpen,
  Globe,
  List,
  Grid3X3,
  Search,
  Filter,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  chunksCount?: number;
  uploadedAt: string;
}

interface CrawlJob {
  id: string;
  url: string;
  status: "active" | "paused" | "completed" | "failed";
  pagesFound: number;
  pagesProcessed: number;
  lastRun: string;
  depth: number;
  domain: string;
}

const initialUploads: UploadedFile[] = [
  { id: "1", name: "Q4_Report.pdf", size: "2.4 MB", type: "pdf", status: "completed", chunksCount: 156, uploadedAt: "2024-01-15" },
  { id: "2", name: "Security_Policy.docx", size: "890 KB", type: "docx", status: "processing", progress: 67, uploadedAt: "2024-01-14" },
  { id: "3", name: "API_Docs.md", size: "156 KB", type: "md", status: "pending", uploadedAt: "2024-01-13" },
  { id: "4", name: "Employee_Handbook.pdf", size: "3.2 MB", type: "pdf", status: "completed", chunksCount: 234, uploadedAt: "2024-01-12" },
  { id: "5", name: "Meeting_Notes.txt", size: "45 KB", type: "txt", status: "failed", uploadedAt: "2024-01-11" },
];

const initialCrawlJobs: CrawlJob[] = [
  { id: "1", url: "https://docs.company.com", status: "active", pagesFound: 234, pagesProcessed: 189, lastRun: "5 min ago", depth: 3, domain: "docs.company.com" },
  { id: "2", url: "https://wiki.company.com", status: "completed", pagesFound: 156, pagesProcessed: 156, lastRun: "2 hours ago", depth: 2, domain: "wiki.company.com" },
  { id: "3", url: "https://blog.company.com", status: "paused", pagesFound: 89, pagesProcessed: 45, lastRun: "1 day ago", depth: 2, domain: "blog.company.com" },
];

const typeIcons: Record<string, string> = {
  pdf: "📄",
  docx: "📝",
  txt: "📃",
  md: "📋",
};

export default function Ingestion() {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploads, setUploads] = useState<UploadedFile[]>(initialUploads);
  const [crawlJobs, setCrawlJobs] = useState<CrawlJob[]>(initialCrawlJobs);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Dialogs
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [selectedJob, setSelectedJob] = useState<CrawlJob | null>(null);
  
  // Crawler options
  const [crawlOptions, setCrawlOptions] = useState({
    maxDepth: 3,
    maxPages: 500,
    followRedirects: true,
    ignoreRobotsTxt: false,
    includeImages: false,
    rateLimit: 1000,
  });

  const handleRefresh = () => {
    toast.loading("Refreshing data...", { id: "refresh" });
    setTimeout(() => {
      toast.success("Data refreshed successfully", { id: "refresh" });
    }, 1000);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newUploads: UploadedFile[] = files.map((file, index) => ({
      id: String(Date.now() + index),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.name.split(".").pop() || "unknown",
      status: "pending" as const,
      uploadedAt: new Date().toISOString().split("T")[0],
    }));
    
    setUploads([...newUploads, ...uploads]);
    toast.success(`${files.length} file(s) added to queue`);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleProcessFile = (fileId: string) => {
    setUploads(uploads.map(f => {
      if (f.id === fileId) {
        return { ...f, status: "processing" as const, progress: 0 };
      }
      return f;
    }));
    
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        clearInterval(interval);
        setUploads(prev => prev.map(f => {
          if (f.id === fileId) {
            return { 
              ...f, 
              status: "completed" as const, 
              progress: 100,
              chunksCount: Math.floor(Math.random() * 200) + 50
            };
          }
          return f;
        }));
        toast.success("File processed successfully");
      } else {
        setUploads(prev => prev.map(f => {
          if (f.id === fileId) {
            return { ...f, progress };
          }
          return f;
        }));
      }
    }, 500);
  };

  const handleProcessAll = () => {
    const pendingFiles = uploads.filter(f => f.status === "pending");
    pendingFiles.forEach((file, index) => {
      setTimeout(() => handleProcessFile(file.id), index * 300);
    });
    toast.info(`Processing ${pendingFiles.length} file(s)`);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploads(uploads.filter(f => f.id !== fileId));
    toast.success("File removed from queue");
  };

  const handleStartCrawl = () => {
    if (!urlInput) {
      toast.error("Please enter a URL");
      return;
    }
    
    const newJob: CrawlJob = {
      id: String(Date.now()),
      url: urlInput,
      status: "active",
      pagesFound: 0,
      pagesProcessed: 0,
      lastRun: "Just now",
      depth: crawlOptions.maxDepth,
      domain: new URL(urlInput).hostname,
    };
    
    setCrawlJobs([newJob, ...crawlJobs]);
    setUrlInput("");
    setIsOptionsDialogOpen(false);
    toast.success("Crawl job started");
    
    // Simulate crawling
    let pagesFound = 0;
    let pagesProcessed = 0;
    const interval = setInterval(() => {
      pagesFound += Math.floor(Math.random() * 10);
      pagesProcessed += Math.floor(Math.random() * 8);
      if (pagesFound >= 100) {
        clearInterval(interval);
        setCrawlJobs(prev => prev.map(j => {
          if (j.id === newJob.id) {
            return { ...j, pagesFound: 100, pagesProcessed: 100, status: "completed" as const };
          }
          return j;
        }));
        toast.success("Crawl completed successfully");
      } else {
        setCrawlJobs(prev => prev.map(j => {
          if (j.id === newJob.id) {
            return { ...j, pagesFound, pagesProcessed };
          }
          return j;
        }));
      }
    }, 1000);
  };

  const handleToggleJob = (jobId: string) => {
    setCrawlJobs(crawlJobs.map(j => {
      if (j.id === jobId) {
        return { 
          ...j, 
          status: j.status === "active" ? "paused" as const : "active" as const 
        };
      }
      return j;
    }));
  };

  const handleDeleteJob = (jobId: string) => {
    setCrawlJobs(crawlJobs.filter(j => j.id !== jobId));
    toast.success("Crawl job deleted");
  };

  const handleRetryJob = (jobId: string) => {
    setCrawlJobs(crawlJobs.map(j => {
      if (j.id === jobId) {
        return { ...j, status: "active" as const, pagesProcessed: 0, lastRun: "Just now" };
      }
      return j;
    }));
    toast.info("Retrying crawl job");
  };

  const filteredUploads = uploads.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || file.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              Ingestion Pipeline
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Upload documents and configure web crawlers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Upload</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-secondary/50 w-full sm:w-auto grid grid-cols-3">
            <TabsTrigger value="upload" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Upload</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="crawler" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Crawler</span>
              <span className="sm:hidden">URL</span>
            </TabsTrigger>
            <TabsTrigger value="queue" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Queue</span>
              <span className="sm:hidden">Queue</span>
            </TabsTrigger>
          </TabsList>

          {/* Document Upload Tab */}
          <TabsContent value="upload" className="space-y-4 sm:space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "glass-card rounded-xl border-2 border-dashed p-6 sm:p-8 md:p-12 text-center transition-all cursor-pointer",
                isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
              )}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input
                id="fileInput"
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Drop files here or click to upload</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Supports PDF, DOCX, TXT, MD files up to 50MB
                </p>
                <Button className="gap-2 text-sm sm:text-base">
                  <Plus className="w-4 h-4" />
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                        All Files
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("processing")}>
                        Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("failed")}>
                        Failed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              </div>
            </div>

            {/* Upload Queue */}
            <div className="glass-card rounded-xl">
              <div className="p-3 sm:p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-semibold text-sm sm:text-base">Upload Queue ({filteredUploads.length})</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleProcessAll}
                  disabled={!filteredUploads.some(f => f.status === "pending")}
                  className="gap-2 text-primary w-full sm:w-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Process All
                </Button>
              </div>
              
              {filteredUploads.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No files in queue</p>
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y divide-border/50">
                  {filteredUploads.map((file) => (
                    <div key={file.id} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className="text-2xl sm:text-3xl shrink-0">{typeIcons[file.type] || "📄"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">{file.size}</span>
                          {file.progress !== undefined && file.status === "processing" && (
                            <div className="flex-1 max-w-24 sm:max-w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-info rounded-full transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                          {file.status === "completed" && file.chunksCount && (
                            <span className="text-xs text-success">{file.chunksCount} chunks</span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize shrink-0",
                          file.status === "completed" && "bg-success/10 text-success border-success/20",
                          file.status === "processing" && "bg-info/10 text-info border-info/20",
                          file.status === "pending" && "text-muted-foreground",
                          file.status === "failed" && "bg-destructive/10 text-destructive border-destructive/20"
                        )}
                      >
                        {file.status === "processing" && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                        {file.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedFile(file); setIsViewDialogOpen(true); }} className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(file)} className="cursor-pointer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          {file.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleProcessFile(file.id)} className="cursor-pointer">
                              <Play className="w-4 h-4 mr-2" />
                              Process
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredUploads.map((file) => (
                    <Card key={file.id} className="glass-card group hover:border-primary/30 transition-all">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{typeIcons[file.type] || "📄"}</span>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.size}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedFile(file); setIsViewDialogOpen(true); }} className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(file)} className="cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteFile(file.id)} className="text-destructive cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs capitalize",
                              file.status === "completed" && "bg-success/10 text-success border-success/20",
                              file.status === "processing" && "bg-info/10 text-info border-info/20",
                              file.status === "pending" && "text-muted-foreground",
                              file.status === "failed" && "bg-destructive/10 text-destructive border-destructive/20"
                            )}
                          >
                            {file.status}
                          </Badge>
                          {file.chunksCount && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                              <CheckCircle className="w-2.5 h-2.5 mr-1" />
                              {file.chunksCount} chunks
                            </Badge>
                          )}
                        </div>
                        
                        {file.progress !== undefined && file.status === "processing" && (
                          <Progress value={file.progress} className="h-2" />
                        )}
                        
                        <div className="text-xs text-muted-foreground">{file.uploadedAt}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* URL Crawler Tab */}
          <TabsContent value="crawler" className="space-y-4 sm:space-y-6">
            {/* Add URL */}
            <div className="glass-card rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold mb-4 text-sm sm:text-base">Add New Crawl Job</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://docs.yourcompany.com"
                    className="pl-10 bg-secondary/50"
                  />
                </div>
                <Button variant="outline" onClick={() => setIsOptionsDialogOpen(true)} className="gap-2 shrink-0">
                  <Settings2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Options</span>
                </Button>
                <Button onClick={handleStartCrawl} className="gap-2 shrink-0">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Start Crawl</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </div>
            </div>

            {/* Active Crawl Jobs */}
            <div className="glass-card rounded-xl">
              <div className="p-3 sm:p-4 border-b border-border/50">
                <h3 className="font-semibold text-sm sm:text-base">Crawl Jobs ({crawlJobs.length})</h3>
              </div>
              <div className="divide-y divide-border/50">
                {crawlJobs.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center">
                    <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No crawl jobs</p>
                  </div>
                ) : (
                  crawlJobs.map((job) => (
                    <div key={job.id} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        job.status === "active" && "bg-success/10",
                        job.status === "paused" && "bg-warning/10",
                        job.status === "completed" && "bg-info/10",
                        job.status === "failed" && "bg-destructive/10"
                      )}>
                        <Link2 className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5",
                          job.status === "active" && "text-success",
                          job.status === "paused" && "text-warning",
                          job.status === "completed" && "text-info",
                          job.status === "failed" && "text-destructive"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{job.url}</p>
                        <div className="flex items-center gap-2 sm:gap-4 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            {job.pagesProcessed} / {job.pagesFound} pages
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Depth: {job.depth}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            Last run: {job.lastRun}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Progress 
                            value={job.pagesFound > 0 ? (job.pagesProcessed / job.pagesFound) * 100 : 0} 
                            className="h-1.5"
                          />
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize shrink-0",
                          job.status === "active" && "bg-success/10 text-success border-success/20",
                          job.status === "paused" && "bg-warning/10 text-warning border-warning/20",
                          job.status === "completed" && "bg-info/10 text-info border-info/20",
                          job.status === "failed" && "bg-destructive/10 text-destructive border-destructive/20"
                        )}
                      >
                        {job.status}
                      </Badge>
                      <div className="flex items-center gap-1 shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedJob(job); setIsViewDialogOpen(true); }} className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleJob(job.id)} className="cursor-pointer">
                              {job.status === "active" ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Resume
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRetryJob(job.id)} className="cursor-pointer">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Retry
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Processing Queue Tab */}
          <TabsContent value="queue" className="space-y-4 sm:space-y-6">
            <div className="glass-card rounded-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-info" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">Processing Queue</h3>
                    <p className="text-sm text-muted-foreground">Real-time processing status</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2 shrink-0" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-success/5 border border-success/20 text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-success">2,734</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="p-4 rounded-xl bg-info/5 border border-info/20 text-center">
                  <Clock className="w-8 h-8 text-info mx-auto mb-2 animate-pulse" />
                  <p className="text-2xl sm:text-3xl font-bold text-info">12</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Processing</p>
                </div>
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
                  <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-destructive">3</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h4 className="font-semibold mb-3 text-sm sm:text-base">Recent Activity</h4>
                <div className="space-y-3">
                  {[
                    { action: "Document processed", file: "Q4_Report.pdf", time: "2 min ago", status: "success" },
                    { action: "Crawl completed", file: "https://docs.company.com", time: "5 min ago", status: "success" },
                    { action: "Processing failed", file: "Corrupted_File.pdf", time: "10 min ago", status: "error" },
                    { action: "Document uploaded", file: "Meeting_Notes.txt", time: "15 min ago", status: "info" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {item.status === "success" && <CheckCircle className="w-4 h-4 text-success" />}
                        {item.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
                        {item.status === "info" && <Clock className="w-4 h-4 text-info" />}
                        <span className="text-muted-foreground">{item.action}:</span>
                        <span className="font-medium truncate max-w-[150px] sm:max-w-xs">{item.file}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Crawler Options Dialog */}
      <Dialog open={isOptionsDialogOpen} onOpenChange={setIsOptionsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Crawler Options
            </DialogTitle>
            <DialogDescription>
              Configure web crawler settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Max Depth: {crawlOptions.maxDepth}</Label>
              <Slider
                value={[crawlOptions.maxDepth]}
                onValueChange={([v]) => setCrawlOptions({ ...crawlOptions, maxDepth: v })}
                min={1}
                max={5}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Pages: {crawlOptions.maxPages}</Label>
              <Slider
                value={[crawlOptions.maxPages]}
                onValueChange={([v]) => setCrawlOptions({ ...crawlOptions, maxPages: v })}
                min={100}
                max={1000}
                step={100}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Follow Redirects</Label>
                <p className="text-xs text-muted-foreground">Follow 301/302 redirects</p>
              </div>
              <Switch
                checked={crawlOptions.followRedirects}
                onCheckedChange={(v) => setCrawlOptions({ ...crawlOptions, followRedirects: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ignore robots.txt</Label>
                <p className="text-xs text-muted-foreground">Crawl disallowed pages</p>
              </div>
              <Switch
                checked={crawlOptions.ignoreRobotsTxt}
                onCheckedChange={(v) => setCrawlOptions({ ...crawlOptions, ignoreRobotsTxt: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Images</Label>
                <p className="text-xs text-muted-foreground">Index image files</p>
              </div>
              <Switch
                checked={crawlOptions.includeImages}
                onCheckedChange={(v) => setCrawlOptions({ ...crawlOptions, includeImages: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOptionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOptionsDialogOpen(false)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              {selectedFile ? "File Details" : "Crawl Job Details"}
            </DialogTitle>
            <DialogDescription>
              View detailed information
            </DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{typeIcons[selectedFile.type] || "📄"}</span>
                <div>
                  <h3 className="font-semibold">{selectedFile.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedFile.size}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p className="font-medium uppercase">{selectedFile.type}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant="outline" className={cn(
                    selectedFile.status === "completed" && "bg-success/10 text-success",
                    selectedFile.status === "processing" && "bg-info/10 text-info",
                    selectedFile.status === "pending" && "text-muted-foreground",
                    selectedFile.status === "failed" && "bg-destructive/10 text-destructive"
                  )}>
                    {selectedFile.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Uploaded</Label>
                  <p className="font-medium">{selectedFile.uploadedAt}</p>
                </div>
                {selectedFile.chunksCount && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Chunks</Label>
                    <p className="font-medium">{selectedFile.chunksCount}</p>
                  </div>
                )}
              </div>
              {selectedFile.progress !== undefined && (
                <div>
                  <Label className="text-xs text-muted-foreground">Progress</Label>
                  <Progress value={selectedFile.progress} className="mt-1" />
                </div>
              )}
            </div>
          )}
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  selectedJob.status === "active" && "bg-success/10",
                  selectedJob.status === "paused" && "bg-warning/10",
                  selectedJob.status === "completed" && "bg-info/10",
                  selectedJob.status === "failed" && "bg-destructive/10"
                )}>
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedJob.url}</h3>
                  <p className="text-sm text-muted-foreground">{selectedJob.domain}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant="outline" className={cn(
                    selectedJob.status === "active" && "bg-success/10 text-success",
                    selectedJob.status === "paused" && "bg-warning/10 text-warning",
                    selectedJob.status === "completed" && "bg-info/10 text-info",
                    selectedJob.status === "failed" && "bg-destructive/10 text-destructive"
                  )}>
                    {selectedJob.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Depth</Label>
                  <p className="font-medium">{selectedJob.depth} levels</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Pages Found</Label>
                  <p className="font-medium">{selectedJob.pagesFound}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Pages Processed</Label>
                  <p className="font-medium">{selectedJob.pagesProcessed}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Progress</Label>
                <Progress 
                  value={selectedJob.pagesFound > 0 ? (selectedJob.pagesProcessed / selectedJob.pagesFound) * 100 : 0} 
                  className="mt-1"
                />
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
