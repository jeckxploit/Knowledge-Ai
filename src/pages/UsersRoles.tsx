import { useState } from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  Shield,
  Edit,
  Trash2,
  Mail,
  UserPlus,
  Filter,
  Grid3X3,
  List,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Download,
  RefreshCw,
  ChevronDown,
  Activity,
  Key,
  LogOut
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
  permissions: string[];
  joinedDate: string;
}

const mockUsers: User[] = [
  { 
    id: "1", 
    name: "John Anderson", 
    email: "john@company.com", 
    role: "admin", 
    department: "IT", 
    status: "active", 
    lastActive: "2 min ago",
    permissions: ["all"],
    joinedDate: "2023-01-15",
    avatar: ""
  },
  { 
    id: "2", 
    name: "Sarah Mitchell", 
    email: "sarah@company.com", 
    role: "editor", 
    department: "HR", 
    status: "active", 
    lastActive: "1 hour ago",
    permissions: ["read", "write", "delete"],
    joinedDate: "2023-03-22",
    avatar: ""
  },
  { 
    id: "3", 
    name: "Mike Chen", 
    email: "mike@company.com", 
    role: "viewer", 
    department: "Engineering", 
    status: "active", 
    lastActive: "3 hours ago",
    permissions: ["read"],
    joinedDate: "2023-06-10",
    avatar: ""
  },
  { 
    id: "4", 
    name: "Emily Davis", 
    email: "emily@company.com", 
    role: "editor", 
    department: "Marketing", 
    status: "pending", 
    lastActive: "Never",
    permissions: ["read", "write"],
    joinedDate: "2024-01-10",
    avatar: ""
  },
  { 
    id: "5", 
    name: "Alex Johnson", 
    email: "alex@company.com", 
    role: "viewer", 
    department: "Sales", 
    status: "inactive", 
    lastActive: "2 weeks ago",
    permissions: ["read"],
    joinedDate: "2023-09-05",
    avatar: ""
  },
  { 
    id: "6", 
    name: "Lisa Brown", 
    email: "lisa@company.com", 
    role: "admin", 
    department: "Operations", 
    status: "active", 
    lastActive: "5 min ago",
    permissions: ["all"],
    joinedDate: "2023-02-20",
    avatar: ""
  },
  { 
    id: "7", 
    name: "David Wilson", 
    email: "david@company.com", 
    role: "editor", 
    department: "Finance", 
    status: "active", 
    lastActive: "30 min ago",
    permissions: ["read", "write"],
    joinedDate: "2023-07-14",
    avatar: ""
  },
  { 
    id: "8", 
    name: "Anna Kim", 
    email: "anna@company.com", 
    role: "viewer", 
    department: "Legal", 
    status: "active", 
    lastActive: "1 day ago",
    permissions: ["read"],
    joinedDate: "2023-11-01",
    avatar: ""
  },
];

const roleConfig = {
  admin: { 
    label: "Admin", 
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: Shield,
    description: "Full access to all features"
  },
  editor: { 
    label: "Editor", 
    className: "bg-warning/10 text-warning border-warning/20",
    icon: Edit,
    description: "Can create and edit content"
  },
  viewer: { 
    label: "Viewer", 
    className: "bg-info/10 text-info border-info/20",
    icon: Users,
    description: "Read-only access"
  },
};

const statusConfig = {
  active: { 
    label: "Active", 
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
    dot: "bg-success"
  },
  inactive: { 
    label: "Inactive", 
    className: "bg-muted/20 text-muted-foreground border-border/50",
    icon: UserX,
    dot: "bg-muted"
  },
  pending: { 
    label: "Pending", 
    className: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
    dot: "bg-warning animate-pulse"
  },
};

const departments = ["All", "IT", "HR", "Engineering", "Marketing", "Sales", "Finance", "Legal", "Operations"];

export default function UsersRoles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleRefresh = () => {
    toast.loading("Refreshing users...", { id: "refresh" });
    setTimeout(() => {
      toast.success("Users updated", { id: "refresh" });
    }, 1000);
  };

  const handleInviteUser = (email: string, role: string) => {
    const newUser: User = {
      id: String(Date.now()),
      name: email.split("@")[0],
      email,
      role: role as "admin" | "editor" | "viewer",
      department: "Pending",
      status: "pending",
      lastActive: "Never",
      permissions: role === "admin" ? ["all"] : role === "editor" ? ["read", "write"] : ["read"],
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setUsers([newUser, ...users]);
    setIsInviteDialogOpen(false);
    toast.success(`Invitation sent to ${email}`);
  };

  const handleEditRole = (user: User, newRole: string) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole as "admin" | "editor" | "viewer" } : u));
    setIsEditDialogOpen(false);
    toast.success(`${user.name}'s role updated to ${newRole}`);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      toast.success(`${selectedUser.name} removed`);
      setSelectedUser(null);
    }
  };

  const handleSendEmail = (user: User) => {
    toast.info(`Opening email client for ${user.email}`);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const stats = {
    total: filteredUsers.length,
    admins: filteredUsers.filter(u => u.role === "admin").length,
    editors: filteredUsers.filter(u => u.role === "editor").length,
    viewers: filteredUsers.filter(u => u.role === "viewer").length,
    active: filteredUsers.filter(u => u.status === "active").length,
  };

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
                  <div className="relative p-2 sm:p-3 rounded-xl bg-primary/20">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                  Users & Roles
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage user access, roles and permissions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Invite User</span>
              <span className="sm:hidden">Invite</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="glass-card group hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card group hover:border-destructive/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-destructive/10 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5 text-destructive" />
                </div>
                <Key className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-destructive">{stats.admins}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card group hover:border-warning/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-warning/10 group-hover:scale-110 transition-transform duration-300">
                  <Edit className="w-5 h-5 text-warning" />
                </div>
                <Edit className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-warning">{stats.editors}</p>
              <p className="text-xs text-muted-foreground">Editors</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card group hover:border-info/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-info/10 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-info" />
                </div>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-info">{stats.viewers}</p>
              <p className="text-xs text-muted-foreground">Viewers</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card group hover:border-success/30 transition-all duration-300 lg:col-span-1 col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-success/10 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active Now</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn("gap-2", (filterRole !== "all" || filterStatus !== "all" || filterDepartment !== "all") && "border-primary bg-primary/5")}
              >
                <Filter className={cn("w-4 h-4", (filterRole !== "all" || filterStatus !== "all" || filterDepartment !== "all") && "text-primary")} />
                Filters
                {(filterRole !== "all" || filterStatus !== "all" || filterDepartment !== "all") && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
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

            {isFiltersOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50 animate-fade-in">
                <div className="space-y-2">
                  <Label className="text-xs">Role</Label>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="bg-secondary/30">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-secondary/30">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Department</Label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users List/Grid */}
        {viewMode === "list" ? (
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 bg-secondary/20">
                        <TableHead className="w-[350px]">User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const RoleIcon = roleConfig[user.role].icon;
                        const StatusIcon = statusConfig[user.status].icon;
                        return (
                          <TableRow key={user.id} className="border-border/50 hover:bg-secondary/20 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border-2 border-primary/20">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-info/20 text-primary font-semibold">
                                    {user.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={cn("p-1.5 rounded-md", roleConfig[user.role].className)}>
                                  <RoleIcon className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <Badge variant="outline" className={cn("text-xs capitalize", roleConfig[user.role].className)}>
                                    {roleConfig[user.role].label}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{user.department}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", statusConfig[user.status].dot)} />
                                <Badge variant="outline" className={cn("text-xs capitalize", statusConfig[user.status].className)}>
                                  {statusConfig[user.status].label}
                                </Badge>
                              </div>
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
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }} className="cursor-pointer">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendEmail(user)} className="cursor-pointer">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => { setSelectedUser(user); setIsDeleteDialogOpen(true); }}
                                    className="text-destructive cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => {
              const RoleIcon = roleConfig[user.role].icon;
              const StatusIcon = statusConfig[user.status].icon;
              return (
                <Card key={user.id} className="glass-card group hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <Avatar className="w-14 h-14 border-2 border-primary/20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-info/20 text-primary font-semibold text-lg">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(user)} className="cursor-pointer">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { setSelectedUser(user); setIsDeleteDialogOpen(true); }}
                            className="text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-base">{user.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-md", roleConfig[user.role].className)}>
                        <RoleIcon className="w-3.5 h-3.5" />
                      </div>
                      <Badge variant="outline" className={cn("text-xs capitalize", roleConfig[user.role].className)}>
                        {roleConfig[user.role].label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <span>{user.department}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full", statusConfig[user.status].dot)} />
                        <span>{statusConfig[user.status].label}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last active: {user.lastActive}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Invite User
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join the platform
            </DialogDescription>
          </DialogHeader>
          <InviteForm 
            onSubmit={handleInviteUser} 
            onCancel={() => setIsInviteDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit User Role
            </DialogTitle>
            <DialogDescription>
              Change {selectedUser?.name}'s role and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <EditRoleForm 
              user={selectedUser}
              onSubmit={handleEditRole}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="w-5 h-5" />
              Remove User
            </DialogTitle>
            <DialogDescription>
              This action will remove the user from the platform
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-foreground">"{selectedUser?.name}"</span>?
              This will revoke all their access immediately.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

// Invite Form Component
function InviteForm({ onSubmit, onCancel }: { onSubmit: (email: string, role: string) => void; onCancel: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubmit(email, role);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="user@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-destructive" />
                Admin
              </div>
            </SelectItem>
            <SelectItem value="editor">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-warning" />
                Editor
              </div>
            </SelectItem>
            <SelectItem value="viewer">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-info" />
                Viewer
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {roleConfig[role as keyof typeof roleConfig].description}
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!email}>
          <Mail className="w-4 h-4 mr-2" />
          Send Invitation
        </Button>
      </DialogFooter>
    </form>
  );
}

// Edit Role Form Component
function EditRoleForm({ user, onSubmit, onCancel }: { user: User; onSubmit: (user: User, role: string) => void; onCancel: () => void }) {
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user, role);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-role">New Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="edit-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-destructive" />
                Admin
              </div>
            </SelectItem>
            <SelectItem value="editor">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-warning" />
                Editor
              </div>
            </SelectItem>
            <SelectItem value="viewer">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-info" />
                Viewer
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {roleConfig[role as keyof typeof roleConfig].description}
        </p>
      </div>
      <div className="space-y-2">
        <Label>Current Permissions</Label>
        <div className="flex flex-wrap gap-2">
          {user.permissions.includes("all") ? (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">All Access</Badge>
          ) : (
            <>
              {user.permissions.includes("read") && (
                <Badge variant="outline" className="bg-info/10 text-info border-info/20">Read</Badge>
              )}
              {user.permissions.includes("write") && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Write</Badge>
              )}
              {user.permissions.includes("delete") && (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Delete</Badge>
              )}
            </>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
}
