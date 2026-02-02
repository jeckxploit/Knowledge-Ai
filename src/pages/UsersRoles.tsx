import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Users, 
  Shield, 
  Edit, 
  Trash2,
  Mail,
  UserPlus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  department: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  avatar?: string;
}

const mockUsers: User[] = [
  { id: "1", name: "John Anderson", email: "john@company.com", role: "admin", department: "IT", status: "active", lastActive: "2 min ago" },
  { id: "2", name: "Sarah Mitchell", email: "sarah@company.com", role: "editor", department: "HR", status: "active", lastActive: "1 hour ago" },
  { id: "3", name: "Mike Chen", email: "mike@company.com", role: "viewer", department: "Engineering", status: "active", lastActive: "3 hours ago" },
  { id: "4", name: "Emily Davis", email: "emily@company.com", role: "editor", department: "Marketing", status: "pending", lastActive: "Never" },
  { id: "5", name: "Alex Johnson", email: "alex@company.com", role: "viewer", department: "Sales", status: "inactive", lastActive: "2 weeks ago" },
];

const roleConfig = {
  admin: { label: "Admin", className: "badge-destructive" },
  editor: { label: "Editor", className: "badge-warning" },
  viewer: { label: "Viewer", className: "badge-info" },
};

const statusConfig = {
  active: { label: "Active", className: "badge-success" },
  inactive: { label: "Inactive", className: "text-muted-foreground border-muted-foreground/30" },
  pending: { label: "Pending", className: "badge-warning" },
};

export default function UsersRoles() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Users & Roles
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage user access and permissions
            </p>
          </div>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "156", icon: Users },
            { label: "Admins", value: "8", icon: Shield },
            { label: "Editors", value: "42", icon: Edit },
            { label: "Viewers", value: "106", icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[300px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="border-border/50 hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", roleConfig[user.role].className)}>
                      {roleConfig[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.department}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", statusConfig[user.status].className)}>
                      {statusConfig[user.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.lastActive}</span>
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
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove User
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
