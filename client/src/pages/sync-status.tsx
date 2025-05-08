import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApplications, syncAllApplications } from "@/lib/argo-service";
import { Application } from "@shared/schema";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/ui/layout/header";
import { format, formatDistanceToNow } from "date-fns";

const SyncStatusPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const { toast } = useToast();
  const { isConnected, lastMessage, forceSync } = useWebSocket();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/applications'],
    queryFn: fetchApplications,
  });

  useEffect(() => {
    if (data) {
      setApplications(data);
    }
  }, [data]);

  // Handle WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'applicationUpdated') {
        setApplications(prev => 
          prev.map(app => app.id === lastMessage.data.id ? lastMessage.data : app)
        );
      } else if (lastMessage.type === 'syncStatusUpdated') {
        refetch();
      }
    }
  }, [lastMessage, refetch]);

  const handleForceSync = async () => {
    try {
      if (isConnected) {
        forceSync('Admin User');
        toast({
          title: "Sync initiated",
          description: "Force sync has been initiated for all applications",
        });
      } else {
        await syncAllApplications('Admin User');
        toast({
          title: "Sync initiated",
          description: "Force sync has been initiated for all applications",
        });
        refetch();
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to initiate sync",
        variant: "destructive",
      });
    }
  };

  const getSyncStatusColor = (syncStatus: string) => {
    switch (syncStatus.toLowerCase()) {
      case "synced":
        return "bg-green-100 text-green-800";
      case "outofsync":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSyncStatusIcon = (syncStatus: string) => {
    switch (syncStatus.toLowerCase()) {
      case "synced":
        return "check_circle";
      case "outofsync":
        return "sync_problem";
      default:
        return "help";
    }
  };

  const getLastSyncedTime = (date: Date | null) => {
    if (!date) return "Never";
    
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  const outOfSyncCount = applications.filter(app => app.syncStatus === "OutOfSync").length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Sync Status" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">GitOps Sync Status</h2>
              <p className="text-gray-600 mt-1">
                Monitor and manage the synchronization status between Git repositories and your deployed applications
              </p>
            </div>
            <button
              onClick={handleForceSync}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
            >
              <span className="material-icons mr-1">sync</span>
              Force Sync All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <span className="material-icons text-purple-500 mr-2">sync</span>
                <h3 className="text-lg font-medium text-gray-800">Sync Status</h3>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold text-gray-800">
                    {applications.length - outOfSyncCount}/{applications.length}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      outOfSyncCount === 0
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {outOfSyncCount === 0 ? "All Synced" : `${outOfSyncCount} Out of Sync`}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${((applications.length - outOfSyncCount) / Math.max(1, applications.length)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Sync History</h3>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <div className="p-4 h-32 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-icons text-gray-400 text-3xl mb-2">timeline</span>
                  <p className="text-sm text-gray-500">
                    Sync activity graph would display here
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Application Sync Status</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => refetch()}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                >
                  <span className="material-icons">refresh</span>
                </button>
                <select className="text-sm border border-gray-300 rounded-md">
                  <option value="all">All environments</option>
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="text-center py-12">
                  <span className="material-icons animate-spin text-gray-400 text-4xl">refresh</span>
                  <p className="mt-4 text-gray-500">Loading sync status...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-icons text-gray-400 text-4xl">sync_disabled</span>
                  <p className="mt-4 text-gray-500">No applications found</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Environment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sync Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Health
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Synced
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {application.environment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getSyncStatusColor(
                              application.syncStatus
                            )}`}
                          >
                            <span className="material-icons text-xs mr-1">
                              {getSyncStatusIcon(application.syncStatus)}
                            </span>
                            {application.syncStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              application.health === "Healthy"
                                ? "bg-green-100 text-green-800"
                                : application.health === "Degraded"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {application.health}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {getLastSyncedTime(application.lastSyncedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 font-code">
                            {application.version || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="p-1.5 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
                            title="Sync now"
                          >
                            <span className="material-icons">sync</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-5">
              <h3 className="text-lg font-medium text-gray-800">Sync Configuration</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="material-icons text-gray-500 mt-0.5 mr-2">schedule</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Auto-Sync Interval</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        ArgoCD automatically checks for changes in Git repositories and
                        syncs applications if changes are detected.
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <select className="text-sm border border-gray-300 rounded-md py-1">
                          <option>3 minutes</option>
                          <option>5 minutes</option>
                          <option>10 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                        </select>
                        <button className="text-blue-600 text-sm hover:underline">Apply</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="material-icons text-gray-500 mt-0.5 mr-2">priority_high</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Sync Failure Notification</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive alerts when application sync operations fail.
                      </p>
                      <div className="mt-2 flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ms-3 text-sm font-medium text-gray-700">Enabled</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="material-icons text-gray-500 mt-0.5 mr-2">settings_backup_restore</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Auto-Prune Resources</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Automatically delete resources that no longer exist in Git when syncing.
                      </p>
                      <div className="mt-2 flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ms-3 text-sm font-medium text-gray-700">Disabled</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="material-icons text-gray-500 mt-0.5 mr-2">history</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Sync History Retention</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Configure how long to retain sync history records.
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <select className="text-sm border border-gray-300 rounded-md py-1">
                          <option>7 days</option>
                          <option>14 days</option>
                          <option>30 days</option>
                          <option>90 days</option>
                        </select>
                        <button className="text-blue-600 text-sm hover:underline">Apply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SyncStatusPage;
