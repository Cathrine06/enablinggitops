import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApplications } from "@/lib/argo-service";
import { Application } from "@shared/schema";
import { useWebSocket } from "@/hooks/use-websocket";
import Header from "@/components/ui/layout/header";

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

const getSyncStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "synced":
      return "bg-green-100 text-green-800";
    case "outofsync":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { lastMessage } = useWebSocket();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/applications'],
    queryFn: fetchApplications,
  });

  useEffect(() => {
    if (data) {
      setApplications(data);
      setFilteredApplications(data);
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
      }
    }
  }, [lastMessage]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.environment.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApplications(filtered);
    }
  }, [searchQuery, applications]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Applications" 
        onSearch={handleSearch}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Managed Applications</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <span className="material-icons mr-1">add</span>
              New Application
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="relative">
                    <select className="pl-8 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Environments</option>
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                    <span className="material-icons absolute left-2 top-2.5 text-gray-400">filter_list</span>
                  </div>
                  
                  <div className="relative">
                    <select className="pl-8 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Health Status</option>
                      <option>Healthy</option>
                      <option>Degraded</option>
                      <option>Progressing</option>
                    </select>
                    <span className="material-icons absolute left-2 top-2.5 text-gray-400">favorite</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                  </span>
                  <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
                    <span className="material-icons">refresh</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="text-center py-12">
                  <span className="material-icons animate-spin text-gray-400 text-4xl">refresh</span>
                  <p className="mt-4 text-gray-500">Loading applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-icons text-gray-400 text-4xl">apps</span>
                  <p className="mt-4 text-gray-500">
                    {searchQuery ? "No applications match your search" : "No applications found"}
                  </p>
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
                        Health
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sync Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pods
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(app.health)} mr-2`}></div>
                            <div className="font-medium text-gray-900">{app.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {app.environment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{app.health}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSyncStatusColor(app.syncStatus)}`}>
                            {app.syncStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {app.version || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {app.pods || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-900" title="View details">
                              <span className="material-icons">visibility</span>
                            </button>
                            <button className="p-1 text-purple-600 hover:text-purple-900" title="Sync">
                              <span className="material-icons">sync</span>
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-900" title="More options">
                              <span className="material-icons">more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationsPage;
