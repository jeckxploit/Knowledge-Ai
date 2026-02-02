import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConnectionStatus } from "@/components/pwa/ConnectionStatus";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import Dashboard from "./pages/Dashboard";
import AIQuery from "./pages/AIQuery";
import KnowledgeBase from "./pages/KnowledgeBase";
import Ingestion from "./pages/Ingestion";
import Analytics from "./pages/Analytics";
import UsersRoles from "./pages/UsersRoles";
import Governance from "./pages/Governance";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConnectionStatus />
      <InstallPrompt />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/query" element={<AIQuery />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/ingestion" element={<Ingestion />} />
          <Route path="/documents" element={<Navigate to="/knowledge" replace />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/query-logs" element={<Navigate to="/analytics" replace />} />
          <Route path="/users" element={<UsersRoles />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
