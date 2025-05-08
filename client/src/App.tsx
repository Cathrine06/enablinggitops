import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/ui/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Infrastructure from "@/pages/infrastructure";
import ApplicationsPage from "@/pages/applications";
import RepositoriesPage from "@/pages/repositories";
import PipelinesPage from "@/pages/pipelines";
import SyncStatusPage from "@/pages/sync-status";
import DataStoragePage from "@/pages/data-storage";
import SettingsPage from "@/pages/settings";
import ToastNotification from "@/components/ui/notifications/toast-notification";
import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/use-websocket";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/infrastructure" component={Infrastructure} />
      <Route path="/applications" component={ApplicationsPage} />
      <Route path="/repositories" component={RepositoriesPage} />
      <Route path="/pipelines" component={PipelinesPage} />
      <Route path="/sync-status" component={SyncStatusPage} />
      <Route path="/data-storage" component={DataStoragePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [syncNotification, setSyncNotification] = useState<{
    show: boolean;
    message: string;
  } | null>(null);
  const { lastMessage } = useWebSocket();

  // Handle real-time sync notifications
  useEffect(() => {
    if (lastMessage && (lastMessage.type === 'syncStatusUpdated' || lastMessage.type === 'applicationUpdated')) {
      if (lastMessage.data.syncStatus === 'Synced') {
        setSyncNotification({
          show: true,
          message: lastMessage.type === 'syncStatusUpdated' 
            ? 'All resources synced successfully from main branch' 
            : `Application ${lastMessage.data.name} synced successfully`
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setSyncNotification(null);
        }, 5000);
      }
    }
  }, [lastMessage]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <Router />
        </div>
        
        <Toaster />
        
        {/* Toast notification for successful syncs */}
        {syncNotification && syncNotification.show && (
          <div className="fixed bottom-4 right-4 space-y-4">
            <div className="bg-white shadow-lg rounded-lg p-4 flex items-start max-w-xs animate-bounce">
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <span className="material-icons">check_circle</span>
                </div>
              </div>
              <div>
                <h4 className="text-gray-800 font-medium">Sync Successful</h4>
                <p className="text-sm text-gray-600">{syncNotification.message}</p>
                <div className="text-xs text-gray-500 mt-1">Just now</div>
              </div>
              <button 
                onClick={() => setSyncNotification(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
