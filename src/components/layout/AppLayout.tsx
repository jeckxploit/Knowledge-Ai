import { ReactNode, memo } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface AppLayoutContentProps {
  children: ReactNode;
}

const AppLayoutContent = memo(function AppLayoutContent({ children }: AppLayoutContentProps) {
  const { isCollapsed, isMobile } = useSidebarContext();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <AppHeader />
      <main 
        className={cn(
          "pt-14 sm:pt-16 min-h-screen transition-all duration-300",
          isMobile ? "ml-0" : (isCollapsed ? "ml-16" : "ml-64")
        )}
      >
        <div className="p-3 sm:p-4 md:p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
});

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
