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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  FolderOpen,
  Grid3X3,
  List,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  X,
  Check,
  Upload,
  Link2,
  Tag,
  Calendar,
  User,
  AlertTriangle,
  Loader2,
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
  description?: string;
  tags?: string[];
  fileSize?: string;
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
    description: "Comprehensive guide for company policies and procedures",
    tags: ["hr", "policies", "handbook"],
    fileSize: "2.4 MB",
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
    description: "Security guidelines and best practices for employees",
    tags: ["security", "guidelines"],
    fileSize: "1.8 MB",
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
    description: "Complete API reference and integration guide",
    tags: ["api", "technical", "documentation"],
    fileSize: "856 KB",
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
    description: "Internal wiki with company information",
    tags: ["wiki", "general"],
    fileSize: "N/A",
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
    description: "New employee onboarding process and checklist",
    tags: ["onboarding", "hr", "training"],
    fileSize: "1.2 MB",
  },
];

const categories = ["All", "HR Policies", "IT Security", "Technical Docs", "General", "Finance", "Legal"];
const departments = ["All", "Human Resources", "IT", "Engineering", "Operations", "Finance", "Legal"];
const sensitivities = ["All", "public", "internal", "confidential"];
const types = ["All", "pdf", "docx", "txt", "url", "md"];

const typeIcons: Record<string, string> = {
  pdf: "📄",
  docx: "📝",
  txt: "📃",
  url: "🔗",
  md: "📋",
};

const sensitivityColors: Record<string, string> = {
  public: "bg-success/10 text-success border-success/20",
  internal: "bg-info/10 text-info border-info/20",
  confidential: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedSensitivity, setSelectedSensitivity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  
  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Add Document Form
  const [newDoc, setNewDoc] = useState({
    title: "",
    type: "pdf",
    category: "HR Policies",
    sensitivity: "internal",
    department: "Human Resources",
    description: "",
    tags: "",
  });

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesDepartment = selectedDepartment === "All" || doc.department === selectedDepartment;
    const matchesSensitivity = selectedSensitivity === "All" || doc.sensitivity === selectedSensitivity;
    const matchesType = selectedType === "All" || doc.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesDepartment && matchesSensitivity && matchesType;
  });

  const handleAddDocument = () => {
    const doc: Document = {
      id: String(Date.now()),
      title: newDoc.title,
      type: newDoc.type as Document["type"],
      category: newDoc.category,
      sensitivity: newDoc.sensitivity as Document["sensitivity"],
      author: "Current User",
      department: newDoc.department,
      version: "1.0",
      indexed: false,
      chunksCount: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      description: newDoc.description,
      tags: newDoc.tags.split(",").map(t => t.trim()).filter(Boolean),
      fileSize: "Pending",
    };
    
    setDocuments([doc, ...documents]);
    setIsAddDialogOpen(false);
    setNewDoc({ title: "", type: "pdf", category: "HR Policies", sensitivity: "internal", department: "Human Resources", description: "", tags: "" });
    toast.success("Document added successfully");
  };

  const handleViewDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setIsViewDialogOpen(true);
  };

  const handleEditDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedDoc) {
      setDocuments(documents.map(d => d.id === selectedDoc.id ? selectedDoc : d));
      toast.success("Document updated successfully");
      setIsEditDialogOpen(false);
      setSelectedDoc(null);
    }
  };

  const handleDeleteDoc = () => {
    if (selectedDoc) {
      setDocuments(documents.filter(d => d.id !== selectedDoc.id));
      toast.success("Document deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedDoc(null);
    }
  };

  const handleDownload = (doc: Document) => {
    toast.info(`Downloading ${doc.title}...`);
    // Simulate download
    setTimeout(() => {
      toast.success(`Downloaded ${doc.title}`);
    }, 1500);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedDepartment("All");
    setSelectedSensitivity("All");
    setSelectedType("All");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedDepartment !== "All" || 
    selectedSensitivity !== "All" || selectedType !== "All" || searchQuery !== "";

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-primary" />
              Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage your indexed documents
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Document
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents by title, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
            
            {/* Filters Toggle */}
            <Button 
              variant="outline" 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={cn("gap-2", hasActiveFilters && "border-primary bg-primary/5")}
            >
              <Filter className={cn("w-4 h-4", hasActiveFilters && "text-primary")} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg self-start sm:self-auto">
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

          {/* Expandable Filters */}
          {isFiltersOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50 animate-fade-in">
              <div className="space-y-2">
                <Label className="text-xs">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Sensitivity</Label>
                <Select value={selectedSensitivity} onValueChange={setSelectedSensitivity}>
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue placeholder="Select sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensitivities.map((sens) => (
                      <SelectItem key={sens} value={sens} className="capitalize">{sens}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">File Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type} className="uppercase">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {hasActiveFilters && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="w-full gap-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-semibold">{filteredDocuments.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Indexed:</span>
              <span className="font-semibold text-success">{filteredDocuments.filter(d => d.indexed).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Pending:</span>
              <span className="font-semibold text-warning">{filteredDocuments.filter(d => !d.indexed).length}</span>
            </div>
          </div>
        </div>

        {/* Documents List/Grid */}
        {viewMode === "list" ? (
          <div className="glass-card rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-[400px]">Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sensitivity</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FolderOpen className="w-8 h-8" />
                        <p>No documents found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="border-border/50 hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{typeIcons[doc.type]}</span>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">{doc.author}</p>
                          </div>
                          {doc.indexed && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20 shrink-0">
                              <Check className="w-3 h-3 mr-1" />
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
                        <span className="text-sm font-mono">{doc.chunksCount}</span>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDoc(doc)} className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditDoc(doc)} className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Metadata
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(doc)} className="cursor-pointer">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => { setSelectedDoc(doc); setIsDeleteDialogOpen(true); }}
                              className="text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.length === 0 ? (
              <div className="col-span-full h-32 flex items-center justify-center glass-card rounded-xl">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FolderOpen className="w-8 h-8" />
                  <p>No documents found</p>
                </div>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="glass-card group hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{typeIcons[doc.type]}</span>
                        <div className="min-w-0">
                          <p className="font-medium truncate text-sm">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.author}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDoc(doc)} className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDoc(doc)} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(doc)} className="cursor-pointer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { setSelectedDoc(doc); setIsDeleteDialogOpen(true); }}
                            className="text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className={cn("text-xs capitalize", sensitivityColors[doc.sensitivity])}>
                        {doc.sensitivity}
                      </Badge>
                      {doc.indexed && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                          <Check className="w-2.5 h-2.5 mr-1" />
                          {doc.chunksCount} chunks
                        </Badge>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground line-clamp-2">{doc.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.department}</span>
                      <span>{doc.lastUpdated}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Add Document
            </DialogTitle>
            <DialogDescription>
              Add a new document to the knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">File Type</Label>
                <Select value={newDoc.type} onValueChange={(v) => setNewDoc({ ...newDoc, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.filter(t => t !== "All").map((type) => (
                      <SelectItem key={type} value={type} className="uppercase">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensitivity">Sensitivity</Label>
                <Select value={newDoc.sensitivity} onValueChange={(v) => setNewDoc({ ...newDoc, sensitivity: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sensitivities.filter(s => s !== "All").map((sens) => (
                      <SelectItem key={sens} value={sens} className="capitalize">{sens}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newDoc.category} onValueChange={(v) => setNewDoc({ ...newDoc, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newDoc.department} onValueChange={(v) => setNewDoc({ ...newDoc, department: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.filter(d => d !== "All").map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the document"
                value={newDoc.description}
                onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tags"
                  placeholder="hr, policies, guide"
                  value={newDoc.tags}
                  onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument} disabled={!newDoc.title}>
              <Upload className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Document Details
            </DialogTitle>
            <DialogDescription>
              View document information and metadata
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{typeIcons[selectedDoc.type]}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedDoc.title}</h3>
                  <p className="text-muted-foreground">{selectedDoc.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> Author
                  </Label>
                  <p className="text-sm font-medium">{selectedDoc.author}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Last Updated
                  </Label>
                  <p className="text-sm font-medium">{selectedDoc.lastUpdated}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p className="text-sm font-medium">{selectedDoc.category}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p className="text-sm font-medium">{selectedDoc.department}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Version</Label>
                  <p className="text-sm font-medium">v{selectedDoc.version}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">File Size</Label>
                  <p className="text-sm font-medium">{selectedDoc.fileSize}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Sensitivity</Label>
                  <Badge variant="outline" className={cn("mt-1 capitalize", sensitivityColors[selectedDoc.sensitivity])}>
                    {selectedDoc.sensitivity}
                  </Badge>
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {selectedDoc.indexed ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <Check className="w-3 h-3 mr-1" />
                        Indexed ({selectedDoc.chunksCount} chunks)
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedDoc.tags && selectedDoc.tags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => { handleDownload(selectedDoc!); }}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Metadata
            </DialogTitle>
            <DialogDescription>
              Update document information
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={selectedDoc.title}
                  onChange={(e) => setSelectedDoc({ ...selectedDoc, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedDoc.description}
                  onChange={(e) => setSelectedDoc({ ...selectedDoc, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={selectedDoc.category} 
                    onValueChange={(v) => setSelectedDoc({ ...selectedDoc, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sensitivity">Sensitivity</Label>
                  <Select 
                    value={selectedDoc.sensitivity} 
                    onValueChange={(v) => setSelectedDoc({ ...selectedDoc, sensitivity: v as Document["sensitivity"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sensitivities.filter(s => s !== "All").map((sens) => (
                        <SelectItem key={sens} value={sens} className="capitalize">{sens}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-version">Version</Label>
                  <Input
                    id="edit-version"
                    value={selectedDoc.version}
                    onChange={(e) => setSelectedDoc({ ...selectedDoc, version: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tags">Tags</Label>
                  <Input
                    id="edit-tags"
                    value={selectedDoc.tags?.join(", ") || ""}
                    onChange={(e) => setSelectedDoc({ ...selectedDoc, tags: e.target.value.split(",").map(t => t.trim()) })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Document
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedDoc?.title}"</span>?
              This will remove all {selectedDoc?.chunksCount} indexed chunks from the knowledge base.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDoc}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
