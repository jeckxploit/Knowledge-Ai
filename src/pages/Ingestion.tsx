import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
}

interface CrawlJob {
  id: string;
  url: string;
  status: "active" | "paused" | "completed" | "failed";
  pagesFound: number;
  pagesProcessed: number;
  lastRun: string;
}

const mockUploads: UploadedFile[] = [
  { id: "1", name: "Q4_Report.pdf", size: "2.4 MB", type: "pdf", status: "completed" },
  { id: "2", name: "Security_Policy.docx", size: "890 KB", type: "docx", status: "processing", progress: 67 },
  { id: "3", name: "API_Docs.md", size: "156 KB", type: "md", status: "pending" },
];

const mockCrawlJobs: CrawlJob[] = [
  { id: "1", url: "https://docs.company.com", status: "active", pagesFound: 234, pagesProcessed: 189, lastRun: "5 min ago" },
  { id: "2", url: "https://wiki.company.com", status: "completed", pagesFound: 156, pagesProcessed: 156, lastRun: "2 hours ago" },
  { id: "3", url: "https://blog.company.com", status: "paused", pagesFound: 89, pagesProcessed: 45, lastRun: "1 day ago" },
];

export default function Ingestion() {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");

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
    // Handle file drop
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            Ingestion Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload documents and configure web crawlers
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="upload" className="gap-2">
              <FileText className="w-4 h-4" />
              Document Upload
            </TabsTrigger>
            <TabsTrigger value="crawler" className="gap-2">
              <Link2 className="w-4 h-4" />
              URL Crawler
            </TabsTrigger>
            <TabsTrigger value="queue" className="gap-2">
              <Clock className="w-4 h-4" />
              Processing Queue
            </TabsTrigger>
          </TabsList>

          {/* Document Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "glass-card rounded-xl border-2 border-dashed p-12 text-center transition-all",
                isDragging ? "border-primary bg-primary/5" : "border-border/50"
              )}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
                <p className="text-muted-foreground mb-4">
                  Supports PDF, DOCX, TXT, MD files up to 50MB
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Upload Queue */}
            <div className="glass-card rounded-xl">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-semibold">Upload Queue</h3>
                <Button variant="ghost" size="sm" className="gap-2 text-primary">
                  <RefreshCw className="w-4 h-4" />
                  Process All
                </Button>
              </div>
              <div className="divide-y divide-border/50">
                {mockUploads.map((file) => (
                  <div key={file.id} className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                        {file.progress !== undefined && (
                          <div className="flex-1 max-w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-info rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        file.status === "completed" && "badge-success",
                        file.status === "processing" && "badge-info",
                        file.status === "pending" && "text-muted-foreground",
                        file.status === "failed" && "badge-destructive"
                      )}
                    >
                      {file.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* URL Crawler Tab */}
          <TabsContent value="crawler" className="space-y-6">
            {/* Add URL */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold mb-4">Add New Crawl Job</h3>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://docs.yourcompany.com"
                    className="pl-10 bg-secondary/50"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Settings2 className="w-4 h-4" />
                  Options
                </Button>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Start Crawl
                </Button>
              </div>
            </div>

            {/* Active Crawl Jobs */}
            <div className="glass-card rounded-xl">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold">Crawl Jobs</h3>
              </div>
              <div className="divide-y divide-border/50">
                {mockCrawlJobs.map((job) => (
                  <div key={job.id} className="p-4 flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      job.status === "active" && "bg-success/10",
                      job.status === "paused" && "bg-warning/10",
                      job.status === "completed" && "bg-info/10",
                      job.status === "failed" && "bg-destructive/10"
                    )}>
                      <Link2 className={cn(
                        "w-5 h-5",
                        job.status === "active" && "text-success",
                        job.status === "paused" && "text-warning",
                        job.status === "completed" && "text-info",
                        job.status === "failed" && "text-destructive"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{job.url}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {job.pagesProcessed} / {job.pagesFound} pages
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Last run: {job.lastRun}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        job.status === "active" && "badge-success",
                        job.status === "paused" && "badge-warning",
                        job.status === "completed" && "badge-info",
                        job.status === "failed" && "badge-destructive"
                      )}
                    >
                      {job.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {job.status === "active" ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : job.status === "paused" ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Processing Queue Tab */}
          <TabsContent value="queue" className="space-y-6">
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-info/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-info" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Processing Queue</h3>
              <p className="text-muted-foreground mb-4">
                12 documents currently in the processing queue
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">2,734 completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-info animate-pulse" />
                  <span className="text-sm">12 processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm">3 failed</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
