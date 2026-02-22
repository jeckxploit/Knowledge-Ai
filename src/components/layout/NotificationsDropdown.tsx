import { useState } from "react";
import { Bell, Check, Trash2, ExternalLink, FileText, MessageSquare, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  unread: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New document indexed",
    description: "Employee Handbook 2026 has been successfully processed and indexed",
    type: "success",
    timestamp: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Low confidence query detected",
    description: "\"Q2 budget allocation\" received a 45% confidence score",
    type: "warning",
    timestamp: "15 min ago",
    unread: true,
    action: {
      label: "Review",
      onClick: () => console.log("Review query"),
    },
  },
  {
    id: "3",
    title: "Ingestion pipeline completed",
    description: "Successfully processed 127 documents from HR folder",
    type: "info",
    timestamp: "1 hour ago",
    unread: false,
  },
  {
    id: "4",
    title: "Failed to connect to data source",
    description: "SharePoint connector timeout after 30 seconds",
    type: "error",
    timestamp: "2 hours ago",
    unread: false,
    action: {
      label: "Retry",
      onClick: () => console.log("Retry connection"),
    },
  },
  {
    id: "5",
    title: "Weekly analytics report ready",
    description: "Your weekly knowledge base performance summary is available",
    type: "info",
    timestamp: "1 day ago",
    unread: false,
  },
];

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "success":
      return <Check className="w-4 h-4 text-success" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case "error":
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    default:
      return <Info className="w-4 h-4 text-info" />;
  }
}

function getNotificationColor(type: Notification["type"]) {
  switch (type) {
    case "success":
      return "border-success/20 bg-success/5";
    case "warning":
      return "border-warning/20 bg-warning/5";
    case "error":
      return "border-destructive/20 bg-destructive/5";
    default:
      return "border-info/20 bg-info/5";
  }
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-h-[70vh] sm:max-h-[400px] flex flex-col">
        {/* Header */}
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 border-b border-border gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Bell className="w-4 h-4 shrink-0" />
            <span className="font-semibold truncate">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shrink-0">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-xs hover:bg-secondary px-2"
              >
                <span className="hidden sm:inline">Mark all read</span>
                <span className="sm:hidden">
                  <Check className="w-3.5 h-3.5" />
                </span>
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </DropdownMenuLabel>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start gap-2 p-3 sm:p-4 cursor-default",
                    notification.unread && "bg-secondary/30"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3 w-full">
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0 border",
                        getNotificationColor(notification.type)
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-medium break-words",
                            notification.unread ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 shrink-0 -mr-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                        {notification.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] text-muted-foreground">
                          {notification.timestamp}
                        </span>
                        {notification.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] px-2 hover:bg-primary/10 hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action?.onClick();
                            }}
                          >
                            {notification.action.label}
                            <ExternalLink className="w-2.5 h-2.5 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-primary hover:bg-primary/10"
                onClick={() => console.log("View all notifications")}
              >
                View all notifications
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
