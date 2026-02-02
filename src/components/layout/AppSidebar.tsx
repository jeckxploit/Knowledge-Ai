import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Upload,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Shield,
  Brain,
  FolderOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Brain, label: "AI Query", href: "/query", badge: "AI" },
  { icon: FolderOpen, label: "Knowledge Base", href: "/knowledge" },
  { icon: Upload, label: "Ingestion", href: "/ingestion" },
  { icon: FileText, label: "Documents", href: "/documents" },
];

const analyticsNavItems: NavItem[] = [
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Search, label: "Query Logs", href: "/query-logs" },
];

const adminNavItems: NavItem[] = [
  { icon: Users, label: "Users & Roles", href: "/users" },
  { icon: Shield, label: "Governance", href: "/governance" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavSection = ({ items, title }: { items: NavItem[]; title?: string }) => (
    <div className="space-y-1">
      {title && !collapsed && (
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "nav-item group relative",
              isActive && "nav-item-active"
            )}
          >
            <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center glow-effect">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground">KnowledgeAI</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Enterprise</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <NavSection items={mainNavItems} />
        <NavSection items={analyticsNavItems} title="Analytics" />
        <NavSection items={adminNavItems} title="Administration" />
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
