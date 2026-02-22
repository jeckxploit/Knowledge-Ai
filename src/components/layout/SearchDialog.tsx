import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  type: "document" | "query" | "page";
  description?: string;
  path?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Remote Work Policy",
    type: "document",
    description: "Company guidelines for remote and hybrid work arrangements",
  },
  {
    id: "2",
    title: "Data Warehouse Access Guide",
    type: "document",
    description: "Step-by-step instructions for requesting data access",
  },
  {
    id: "3",
    title: "PII Security Protocols",
    type: "document",
    description: "Handling personally identifiable information securely",
  },
  {
    id: "4",
    title: "Q2 Product Roadmap",
    type: "document",
    description: "Product development plans and milestones for Q2",
  },
  {
    id: "5",
    title: "What is the company's remote work policy?",
    type: "query",
    description: "Asked 3 hours ago - 94% confidence",
  },
  {
    id: "6",
    title: "How to request data warehouse access?",
    type: "query",
    description: "Asked 1 day ago - 87% confidence",
  },
];

const navigationItems = [
  { title: "Dashboard", path: "/", icon: Sparkles },
  { title: "AI Query", path: "/query", icon: MessageSquare },
  { title: "Knowledge Base", path: "/knowledge", icon: FileText },
  { title: "Ingestion", path: "/ingestion", icon: ArrowRight },
  { title: "Analytics", path: "/analytics", icon: ArrowRight },
  { title: "Users & Roles", path: "/users", icon: ArrowRight },
  { title: "Governance", path: "/governance", icon: ArrowRight },
  { title: "Settings", path: "/settings", icon: ArrowRight },
  { title: "Profile", path: "/profile", icon: ArrowRight },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const handleSelect = (path?: string) => {
    if (path) {
      navigate(path);
    }
    onOpenChange(false);
    setSearchQuery("");
  };

  const filteredResults = mockSearchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNavigation = navigationItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search documents, queries, or navigate..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList className="max-h-[60vh] sm:max-h-[400px]">
        <CommandEmpty className="py-6">
          <div className="flex flex-col items-center gap-2 px-4">
            <Search className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">No results found for "{searchQuery}"</p>
          </div>
        </CommandEmpty>

        {/* Navigation */}
        {filteredNavigation.length > 0 && (
          <CommandGroup heading="Navigation">
            {filteredNavigation.map((item) => (
              <CommandItem
                key={item.path}
                onSelect={() => handleSelect(item.path)}
                className="cursor-pointer"
              >
                <item.icon className="w-4 h-4 mr-3 text-muted-foreground shrink-0" />
                <span className="flex-1 text-foreground font-medium">{item.title}</span>
                <CommandShortcut className="hidden sm:flex">
                  <ArrowRight className="w-3 h-3" />
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Documents */}
        {filteredResults.filter((r) => r.type === "document").length > 0 && (
          <CommandGroup heading="Documents">
            {filteredResults
              .filter((r) => r.type === "document")
              .map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect("/knowledge")}
                  className="cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-3 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                  </div>
                  <CommandShortcut className="hidden sm:flex">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                      Document
                    </Badge>
                  </CommandShortcut>
                </CommandItem>
              ))}
          </CommandGroup>
        )}

        {/* Recent Queries */}
        {filteredResults.filter((r) => r.type === "query").length > 0 && (
          <CommandGroup heading="Recent Queries">
            {filteredResults
              .filter((r) => r.type === "query")
              .map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect("/query")}
                  className="cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-3 text-info shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                  </div>
                  <CommandShortcut className="hidden sm:flex">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0 h-5",
                        result.description?.includes("94%")
                          ? "border-success/20 text-success bg-success/5"
                          : "border-warning/20 text-warning bg-warning/5"
                      )}
                    >
                      Query
                    </Badge>
                  </CommandShortcut>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
      <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground overflow-x-auto">
        <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono mx-1">↑↓</kbd> to navigate</span>
        <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono mx-1">↵</kbd> to select</span>
        <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono mx-1">ESC</kbd> to close</span>
        <span className="sm:hidden text-[10px]">Tap to select</span>
      </div>
    </CommandDialog>
  );
}
