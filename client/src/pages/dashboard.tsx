import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/argo-service";
import { DashboardData } from "@/lib/types";
import { useWebSocket } from "@/hooks/use-websocket";

import Header from "@/components/ui/layout/header";
import StatusOverview from "@/components/dashboard/status-overview";
import ActivityFeed from "@/components/dashboard/activity-feed";
import ApplicationStatus from "@/components/dashboard/application-status";
import InfrastructureTopologyGraph from "@/components/dashboard/infrastructure-topology";
import DeploymentTimeline from "@/components/dashboard/deployment-timeline";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { isConnected, lastMessage } = useWebSocket();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: fetchDashboardData,
  });

  useEffect(() => {
    if (data) {
      setDashboardData(data);
    }
  }, [data]);

  // Handle real-time updates via WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'initialState') {
      setDashboardData(lastMessage.data);
    }
  }, [lastMessage]);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search functionality
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Dashboard"
        lastSyncTime={dashboardData?.syncStatus?.lastSyncTime}
        onSearch={handleSearch}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          {isLoading && !dashboardData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="material-icons animate-spin text-blue-500 text-4xl">refresh</span>
                <p className="mt-4 text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            <>
              <StatusOverview />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <ActivityFeed />
                <ApplicationStatus />
              </div>

              <InfrastructureTopologyGraph />
              
              <DeploymentTimeline />
              
              {!isConnected && (
                <div className="fixed bottom-4 left-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow-md">
                  <div className="flex items-center">
                    <span className="material-icons mr-2">wifi_off</span>
                    <span>Realtime updates unavailable. Reconnecting...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
