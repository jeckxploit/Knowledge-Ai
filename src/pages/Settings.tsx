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
import { 
  Settings, 
  Database, 
  Brain, 
  Shield, 
  Bell, 
  Palette,
  Key,
  Globe,
  Server
} from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your knowledge base system
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Configuration
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Database className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Organization Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue="Acme Corporation" className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Knowledge Base Name</Label>
                  <Input defaultValue="Internal KB" className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="asia">
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia">Asia/Jakarta (WIB)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="us">US/Eastern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Email notifications for new documents", enabled: true },
                  { label: "Weekly analytics summary", enabled: true },
                  { label: "Security alerts", enabled: true },
                  { label: "Out-of-scope query notifications", enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Configuration */}
          <TabsContent value="ai" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Model Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Model</Label>
                  <Select defaultValue="gpt4">
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gemini">Gemini Pro</SelectItem>
                      <SelectItem value="claude">Claude 3 Opus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Embedding Model</Label>
                  <Select defaultValue="ada">
                    <SelectTrigger className="bg-secondary/50">
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
                  <Label>Temperature</Label>
                  <Input type="number" defaultValue="0.3" min="0" max="2" step="0.1" className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Max Tokens</Label>
                  <Input type="number" defaultValue="2048" className="bg-secondary/50" />
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-border/50">
                {[
                  { label: "Enable hybrid retrieval (semantic + keyword)", enabled: true },
                  { label: "Require citations in answers", enabled: true },
                  { label: "Enable confidence scoring", enabled: true },
                  { label: "Enable out-of-scope detection", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                API Keys
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>OpenAI API Key</Label>
                  <Input type="password" defaultValue="sk-xxxxxxxxxxxxxxxx" className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Pinecone API Key</Label>
                  <Input type="password" defaultValue="xxxxxxxx-xxxx-xxxx" className="bg-secondary/50" />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Policies
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Enable rate limiting", enabled: true },
                  { label: "Input sanitization", enabled: true },
                  { label: "AI prompt injection protection", enabled: true },
                  { label: "Require MFA for admin users", enabled: false },
                  { label: "Audit log retention (90 days)", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Connected Services
              </h3>
              <div className="space-y-4">
                {[
                  { name: "PostgreSQL Database", status: "connected", icon: Database },
                  { name: "Pinecone Vector DB", status: "connected", icon: Database },
                  { name: "Redis Cache", status: "connected", icon: Server },
                  { name: "Slack Integration", status: "disconnected", icon: Bell },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className={`text-xs ${service.status === "connected" ? "text-success" : "text-muted-foreground"}`}>
                          {service.status === "connected" ? "● Connected" : "○ Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button variant={service.status === "connected" ? "outline" : "default"} size="sm">
                      {service.status === "connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="px-8">Save Changes</Button>
        </div>
      </div>
    </AppLayout>
  );
}
