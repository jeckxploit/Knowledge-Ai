import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConnectionStatus } from "@/components/pwa/ConnectionStatus";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { AppLayout } from "@/components/layout/AppLayout";

// Lazy load all pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AIQuery = lazy(() => import("./pages/AIQuery"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const Ingestion = lazy(() => import("./pages/Ingestion"));
const Analytics = lazy(() => import("./pages/Analytics"));
const QueryLogs = lazy(() => import("./pages/QueryLogs"));
const UsersRoles = lazy(() => import("./pages/UsersRoles"));
const Governance = lazy(() => import("./pages/Governance"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Page loader with appropriate skeleton
function PageLoader({ variant = "dashboard" }: { variant?: "dashboard" | "list" | "chat" | "form" }) {
  return (
    <AppLayout>
      <PageSkeleton variant={variant} />
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConnectionStatus />
      <InstallPrompt />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={<PageLoader variant="dashboard" />}>
                <Dashboard />
              </Suspense>
            } 
          />
          <Route 
            path="/query" 
            element={
              <Suspense fallback={<PageLoader variant="chat" />}>
                <AIQuery />
              </Suspense>
            } 
          />
          <Route 
            path="/knowledge" 
            element={
              <Suspense fallback={<PageLoader variant="list" />}>
                <KnowledgeBase />
              </Suspense>
            } 
          />
          <Route 
            path="/ingestion" 
            element={
              <Suspense fallback={<PageLoader variant="list" />}>
                <Ingestion />
              </Suspense>
            } 
          />
          <Route path="/documents" element={<Navigate to="/knowledge" replace />} />
          <Route
            path="/analytics"
            element={
              <Suspense fallback={<PageLoader variant="dashboard" />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="/query-logs"
            element={
              <Suspense fallback={<PageLoader variant="list" />}>
                <QueryLogs />
              </Suspense>
            }
          />
          <Route 
            path="/users" 
            element={
              <Suspense fallback={<PageLoader variant="list" />}>
                <UsersRoles />
              </Suspense>
            } 
          />
          <Route 
            path="/governance" 
            element={
              <Suspense fallback={<PageLoader variant="list" />}>
                <Governance />
              </Suspense>
            } 
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader variant="form" />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<PageLoader variant="form" />}>
                <Profile />
              </Suspense>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route 
            path="*" 
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
