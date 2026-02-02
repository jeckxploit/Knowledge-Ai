import { memo } from "react";
import { Bell, Search, User, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

export const AppHeader = memo(function AppHeader() {
  const { isCollapsed, isMobile, toggle } = useSidebarContext();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 sm:h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-3 sm:px-6 transition-all duration-300",
        isMobile ? "left-0" : (isCollapsed ? "left-16" : "left-64")
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggle}
            className="shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Search - Hidden on mobile, shown as icon */}
        <div className="hidden sm:flex relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents, queries..."
            className="pl-10 bg-secondary/50 border-border/50 focus:bg-secondary"
          />
        </div>
        
        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Help - Hidden on mobile */}
        <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-2 sm:pr-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">Admin User</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  Admin
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});
