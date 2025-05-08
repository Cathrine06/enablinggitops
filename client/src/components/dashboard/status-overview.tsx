import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClusterHealth, fetchDeploymentStats, fetchSyncStatus, syncAllApplications } from "@/lib/argo-service";
import { ClusterHealth, DeploymentStats, SyncStatus } from "@/lib/types";
import { useWebSocket } from "@/hooks/use-websocket";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const StatusOverview = () => {
  const { toast } = useToast();
  const { isConnected, lastMessage, forceSync } = useWebSocket();
  const [clusterHealth, setClusterHealth] = useState<ClusterHealth | null>(null);
  const [deploymentStats, setDeploymentStats] = useState<DeploymentStats | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  // Fetch cluster health
  const { data: healthData } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: fetchClusterHealth,
  });

  // Fetch deployment stats
  const { data: statsData } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: fetchDeploymentStats,
  });

  // Fetch sync status
  const { data: syncData } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: fetchSyncStatus,
  });

  useEffect(() => {
    if (healthData) {
      setClusterHealth(healthData);
    }
  }, [healthData]);

  useEffect(() => {
    if (statsData) {
      setDeploymentStats(statsData);
    }
  }, [statsData]);

  useEffect(() => {
    if (syncData) {
      setSyncStatus(syncData);
    }
  }, [syncData]);

  // Handle WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'syncStatusUpdated') {
        setSyncStatus(lastMessage.data);
      }
    }
  }, [lastMessage]);

  const handleForceSync = async () => {
    try {
      // Use WebSocket for real-time updates
      if (isConnected) {
        forceSync('Admin User');
      } else {
        // Fallback to REST API
        await syncAllApplications('Admin User');
      }
      
      toast({
        title: "Sync initiated",
        description: "Force sync has been initiated for all applications",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to initiate sync",
        variant: "destructive",
      });
    }
  };

  const formatSyncTime = (time: Date | null) => {
    if (!time) return 'Never';
    
    const now = new Date();
    const syncTime = new Date(time);
    const diffMinutes = Math.floor((now.getTime() - syncTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 min ago';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    
    return format(syncTime, 'HH:mm');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Cluster Health */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-medium">Cluster Health</h3>
          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-500">
            <span className="material-icons">
              {clusterHealth?.healthy ? "check_circle" : "error"}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="text-3xl font-semibold text-gray-800">
              {clusterHealth?.percentage.toFixed(1)}%
            </div>
            {clusterHealth?.trend && clusterHealth.trend > 0 ? (
              <>
                <span className="material-icons text-green-500 ml-2">trending_up</span>
                <span className="text-sm text-green-500 ml-1">+{clusterHealth.trend}%</span>
              </>
            ) : clusterHealth?.trend && clusterHealth.trend < 0 ? (
              <>
                <span className="material-icons text-red-500 ml-2">trending_down</span>
                <span className="text-sm text-red-500 ml-1">{clusterHealth.trend}%</span>
              </>
            ) : null}
          </div>
          <div className="text-sm text-gray-500 mt-1">Services uptime in last 24h</div>
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${clusterHealth?.percentage || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Deployment Status */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-medium">Deployments</h3>
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            <span className="material-icons">rocket_launch</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="text-3xl font-semibold text-gray-800">
              {deploymentStats?.today || 0}
            </div>
            <span className="text-sm text-gray-500 ml-3">Today</span>
            <span className="text-sm text-gray-400 ml-3">
              ({deploymentStats?.total || 0} total)
            </span>
          </div>
          <div className="flex mt-4 justify-between text-sm">
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
              <span className="text-gray-600">Success: {deploymentStats?.success || 0}</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
              <span className="text-gray-600">Pending: {deploymentStats?.pending || 0}</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
              <span className="text-gray-600">Failed: {deploymentStats?.failed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Git Sync Status */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-medium">Git Sync Status</h3>
          <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
            <span className="material-icons">sync</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${syncStatus?.synced ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse-slow`}></div>
              <span className={`ml-2 ${syncStatus?.synced ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
                {syncStatus?.synced ? 'Synced' : 'Out of Sync'}
              </span>
            </div>
            <div className="ml-4 text-sm text-gray-500">
              Last: <span className="font-medium">{formatSyncTime(syncStatus?.lastSyncTime || null)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="material-icons text-gray-500 mr-1 text-base">code</span>
            <span className="font-code text-gray-600">{syncStatus?.revision || 'unknown'}</span>
            <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">production</span>
          </div>
        </div>
        <button
          onClick={handleForceSync}
          className="mt-4 w-full py-2 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center hover:bg-purple-100 transition-colors"
        >
          <span className="material-icons mr-1 text-sm">refresh</span>
          <span>Force Sync Now</span>
        </button>
      </div>
    </div>
  );
};

export default StatusOverview;
