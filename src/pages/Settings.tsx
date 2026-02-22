import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Building2,
  Bell,
  Palette,
  Globe,
  Shield,
  Key,
  Database,
  Server,
  Brain,
  Cpu,
  Sparkles,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Layers,
  Workflow,
  Sliders,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("general");

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully", {
      description: "Your changes have been applied",
      icon: <CheckCircle2 className="w-5 h-5 text-success" />,
    });
  };

  const handleReset = () => {
    toast.info("Settings reset to defaults", {
      description: "All changes have been reverted",
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-6 sm:p-8 mb-6 border border-primary/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                    <SettingsIcon className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure your knowledge base system preferences
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
                <Badge variant="outline" className="border-info/30 text-info bg-info/5">
                  v2.4.0
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Modern Tab Navigation */}
          <div className="sticky top-16 sm:top-20 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-3 sm:-mx-6 px-3 sm:px-6 py-4">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-full sm:w-auto grid grid-cols-4 gap-2 bg-secondary/30 p-1.5 rounded-xl">
                <TabsTrigger 
                  value="general" 
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg py-2.5 px-4 text-xs sm:text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg py-2.5 px-4 text-xs sm:text-sm"
                >
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Model</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="gap-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive data-[state=active]:shadow-md transition-all duration-300 rounded-lg py-2.5 px-4 text-xs sm:text-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations" 
                  className="gap-2 data-[state=active]:bg-info data-[state=active]:text-info-foreground data-[state=active]:shadow-md transition-all duration-300 rounded-lg py-2.5 px-4 text-xs sm:text-sm"
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Services</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Organization Settings */}
              <Card className="glass-card border-primary/10 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Organization</CardTitle>
                      <CardDescription>Basic company information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      Organization Name
                    </Label>
                    <Input 
                      defaultValue="Acme Corporation" 
                      className="h-11 bg-secondary/30 border-border/50 focus:border-primary/50 transition-colors"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      Knowledge Base Name
                    </Label>
                    <Input 
                      defaultValue="Internal KB" 
                      className="h-11 bg-secondary/30 border-border/50 focus:border-primary/50 transition-colors"
                      placeholder="Enter KB name"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Regional Settings */}
              <Card className="glass-card border-info/10 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-info/20 to-info/5">
                      <Globe className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Regional</CardTitle>
                      <CardDescription>Language and timezone settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      Default Language
                    </Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="h-11 bg-secondary/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="id">🇮🇩 Indonesian</SelectItem>
                        <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                        <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      Timezone
                    </Label>
                    <Select defaultValue="asia">
                      <SelectTrigger className="h-11 bg-secondary/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia">🌏 Asia/Jakarta (WIB UTC+7)</SelectItem>
                        <SelectItem value="utc">🌍 UTC (Coordinated)</SelectItem>
                        <SelectItem value="us">🌎 US/Eastern (EST)</SelectItem>
                        <SelectItem value="eu">🌍 Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications */}
            <Card className="glass-card border-warning/10 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5">
                    <Bell className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {[
                    { 
                      label: "Email notifications", 
                      description: "Receive emails for new documents",
                      enabled: true,
                      icon: Bell 
                    },
                    { 
                      label: "Weekly analytics", 
                      description: "Get weekly performance summary",
                      enabled: true,
                      icon: TrendingUp 
                    },
                    { 
                      label: "Security alerts", 
                      description: "Critical security notifications",
                      enabled: true,
                      icon: Shield 
                    },
                    { 
                      label: "Out-of-scope queries", 
                      description: "Notify when AI can't answer",
                      enabled: false,
                      icon: AlertCircle 
                    },
                  ].map((item, index) => (
                    <div 
                      key={item.label}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl transition-colors",
                        index < 3 ? "bg-secondary/20 hover:bg-secondary/30" : "bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          item.enabled ? "bg-primary/10" : "bg-muted"
                        )}>
                          <item.icon className={cn(
                            "w-5 h-5",
                            item.enabled ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <Switch 
                        defaultChecked={item.enabled} 
                        className="scale-90"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Configuration */}
          <TabsContent value="ai" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Model Selection */}
              <Card className="lg:col-span-2 glass-card border-accent/10 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">AI Models</CardTitle>
                      <CardDescription>Configure your AI and embedding models</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-accent" />
                        Primary Model
                      </Label>
                      <Select defaultValue="gpt4">
                        <SelectTrigger className="h-11 bg-secondary/30 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt4">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              GPT-4 Turbo
                            </div>
                          </SelectItem>
                          <SelectItem value="gemini">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-info" />
                              Gemini Pro
                            </div>
                          </SelectItem>
                          <SelectItem value="claude">
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-accent" />
                              Claude 3 Opus
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Layers className="w-4 h-4 text-info" />
                        Embedding Model
                      </Label>
                      <Select defaultValue="ada">
                        <SelectTrigger className="h-11 bg-secondary/30 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ada">text-embedding-ada-002</SelectItem>
                          <SelectItem value="3small">text-embedding-3-small</SelectItem>
                          <SelectItem value="3large">text-embedding-3-large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-warning" />
                        Temperature
                      </Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          defaultValue="0.3" 
                          min="0" 
                          max="2" 
                          step="0.1" 
                          className="h-11 bg-secondary/30 border-border/50 pr-12"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          0.3
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Workflow className="w-4 h-4 text-info" />
                        Max Tokens
                      </Label>
                      <Input 
                        type="number" 
                        defaultValue="2048" 
                        className="h-11 bg-secondary/30 border-border/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass-card border-primary/10 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                      <Rocket className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Performance</CardTitle>
                      <CardDescription>Current usage stats</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">API Calls</span>
                      <Badge variant="outline" className="text-xs">This Month</Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary">24,582</p>
                    <p className="text-xs text-success mt-1">↑ 12% from last month</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Avg Response</span>
                      <Badge variant="outline" className="text-xs">Latency</Badge>
                    </div>
                    <p className="text-2xl font-bold text-accent">1.2s</p>
                    <p className="text-xs text-success mt-1">↓ 0.3s improvement</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Features */}
            <Card className="glass-card border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-info/20 to-info/5">
                    <Sparkles className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Features</CardTitle>
                    <CardDescription>Enable or disable AI capabilities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { 
                      label: "Hybrid Retrieval", 
                      description: "Combine semantic + keyword search",
                      enabled: true 
                    },
                    { 
                      label: "Auto Citations", 
                      description: "Require sources in answers",
                      enabled: true 
                    },
                    { 
                      label: "Confidence Scoring", 
                      description: "Show answer confidence level",
                      enabled: true 
                    },
                    { 
                      label: "Out-of-Scope Detection", 
                      description: "Detect irrelevant queries",
                      enabled: true 
                    },
                  ].map((item) => (
                    <div 
                      key={item.label}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                        item.enabled 
                          ? "bg-primary/5 border-primary/20 hover:border-primary/30" 
                          : "bg-muted/30 border-border/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          item.enabled ? "bg-success animate-pulse" : "bg-muted-foreground"
                        )} />
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <Switch defaultChecked={item.enabled} className="scale-90" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* API Keys */}
              <Card className="glass-card border-destructive/10 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5">
                      <Key className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">API Keys</CardTitle>
                      <CardDescription>Manage your API credentials</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        OpenAI API Key
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => toggleApiKeyVisibility("openai")}
                      >
                        {showApiKeys.openai ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </Label>
                    <Input 
                      type={showApiKeys.openai ? "text" : "password"} 
                      defaultValue="sk-xxxxxxxxxxxxxxxx" 
                      className="h-11 bg-secondary/30 border-border/50 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-info" />
                        Pinecone API Key
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => toggleApiKeyVisibility("pinecone")}
                      >
                        {showApiKeys.pinecone ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </Label>
                    <Input 
                      type={showApiKeys.pinecone ? "text" : "password"} 
                      defaultValue="xxxxxxxx-xxxx-xxxx" 
                      className="h-11 bg-secondary/30 border-border/50 font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Policies */}
              <Card className="glass-card border-warning/10 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5">
                      <Lock className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Security Policies</CardTitle>
                      <CardDescription>System protection settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { label: "Rate Limiting", description: "Prevent API abuse", enabled: true },
                    { label: "Input Sanitization", description: "Clean user inputs", enabled: true },
                    { label: "Prompt Injection Protection", description: "Block malicious prompts", enabled: true },
                    { label: "MFA for Admins", description: "Require 2FA for admin accounts", enabled: false },
                    { label: "Audit Log Retention", description: "Keep logs for 90 days", enabled: true },
                  ].map((item) => (
                    <div 
                      key={item.label}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        item.enabled ? "bg-success/5" : "bg-muted/30"
                      )}
                    >
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.enabled} className="scale-90" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6 animate-fade-in">
            <Card className="glass-card border-info/10 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-info/20 to-info/5">
                    <Server className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Connected Services</CardTitle>
                    <CardDescription>Manage external integrations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { 
                      name: "PostgreSQL Database", 
                      status: "connected", 
                      icon: Database,
                      description: "Primary data storage",
                      color: "primary"
                    },
                    { 
                      name: "Pinecone Vector DB", 
                      status: "connected", 
                      icon: Database,
                      description: "Vector embeddings storage",
                      color: "info"
                    },
                    { 
                      name: "Redis Cache", 
                      status: "connected", 
                      icon: Server,
                      description: "Response caching layer",
                      color: "accent"
                    },
                    { 
                      name: "Slack Integration", 
                      status: "disconnected", 
                      icon: Bell,
                      description: "Team notifications",
                      color: "muted"
                    },
                  ].map((service) => (
                    <div 
                      key={service.name}
                      className={cn(
                        "p-5 rounded-xl border transition-all hover:shadow-md",
                        service.status === "connected" 
                          ? "bg-gradient-to-br from-secondary/30 to-secondary/10 border-border/50" 
                          : "bg-muted/20 border-border/30"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2.5 rounded-xl",
                            service.color === "primary" && "bg-primary/10",
                            service.color === "info" && "bg-info/10",
                            service.color === "accent" && "bg-accent/10",
                            service.color === "muted" && "bg-muted"
                          )}>
                            <service.icon className={cn(
                              "w-5 h-5",
                              service.color === "primary" && "text-primary",
                              service.color === "info" && "text-info",
                              service.color === "accent" && "text-accent",
                              service.color === "muted" && "text-muted-foreground"
                            )} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            service.status === "connected" 
                              ? "border-success/30 text-success bg-success/5" 
                              : "border-muted-foreground/30 text-muted-foreground bg-muted/20"
                          )}
                        >
                          {service.status === "connected" ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex gap-2">
                        <Button 
                          variant={service.status === "connected" ? "outline" : "default"} 
                          size="sm" 
                          className={cn(
                            "flex-1 text-xs h-9",
                            service.status === "connected" 
                              ? "border-primary/30 hover:bg-primary/10" 
                              : "bg-primary hover:bg-primary/90"
                          )}
                        >
                          {service.status === "connected" ? "Configure" : "Connect"}
                        </Button>
                        {service.status === "connected" && (
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <SettingsIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 z-20 bg-background/80 backdrop-blur-xl border-t border-border/50 -mx-3 sm:-mx-6 px-3 sm:px-6 py-4 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>All changes are auto-saved</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="h-11 px-6 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                className="h-11 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/60 shadow-lg hover:shadow-xl transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
