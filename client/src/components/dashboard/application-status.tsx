import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApplications, syncApplication } from "@/lib/argo-service";
import { Application } from "@shared/schema";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "healthy":
      return "bg-green-500";
    case "degraded":
      return "bg-red-500";
    case "progressing":
      return "bg-yellow-500";
    case "suspended":
      return "bg-gray-500";
    default:
      return "bg-gray-300";
  }
};

const ApplicationStatus = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const { toast } = useToast();
  const { lastMessage, syncApplication: wsSyncApplication } = useWebSocket();

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
      } else if (lastMessage.type === 'applicationCreated') {
        setApplications(prev => [...prev, lastMessage.data]);
      } else if (lastMessage.type === 'applicationDeleted') {
        setApplications(prev => prev.filter(app => app.id !== lastMessage.data.id));
      } else if (lastMessage.type === 'initialState' && lastMessage.data.applications) {
        setApplications(lastMessage.data.applications);
      }
    }
  }, [lastMessage]);

  const handleSync = async (appId: number) => {
    try {
      // Try WebSocket first for real-time updates
      const wsSuccess = wsSyncApplication(appId, 'Admin User');
      
      if (!wsSuccess) {
        // Fallback to REST API
        await syncApplication(appId, 'Admin User');
      }
      
      toast({
        title: "Sync initiated",
        description: "Application sync has been started",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Application Status</h3>
          <div className="flex space-x-2">
            <button 
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
              onClick={() => refetch()}
            >
              <span className="material-icons">refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="text-center py-4">
            <span className="material-icons animate-spin text-gray-400 text-2xl">refresh</span>
            <p className="mt-2 text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-4">
            <span className="material-icons text-gray-400 text-2xl">apps</span>
            <p className="mt-2 text-gray-500">No applications found</p>
          </div>
        ) : (
          <>
            {applications.map((app) => (
              <div key={app.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(app.health)} mr-2`}></div>
                    <h4 className="font-medium text-gray-800">
                      {app.name}
                    </h4>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded">
                    {app.environment}
                  </span>
                </div>
                <div className="ml-4 mt-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Pods: {app.pods || "0/0"}</span>
                    <span>{app.version || "unknown"}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(app.health)} rounded-full`}
                      style={{ 
                        width: app.pods ? 
                          `${(parseInt(app.pods.split('/')[0]) / parseInt(app.pods.split('/')[1])) * 100}%` : 
                          app.health === 'Healthy' ? '100%' : 
                          app.health === 'Degraded' ? '50%' : 
                          app.health === 'Progressing' ? '75%' : '0%'
                      }}
                    ></div>
                  </div>
                  {app.syncStatus === 'OutOfSync' && (
                    <div className="mt-2 flex justify-end">
                      <button 
                        onClick={() => handleSync(app.id)}
                        className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
                      >
                        <span className="material-icons text-xs mr-1 align-text-bottom">sync</span>
                        Sync
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6">
              <button className="w-full py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
                <span className="material-icons mr-1 text-sm">add</span>
                <span>Add Application</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
