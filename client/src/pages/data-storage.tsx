import { useState } from "react";
import Header from "@/components/ui/layout/header";

type StorageTab = "deployments" | "configurations" | "logs";

const DataStoragePage = () => {
  const [activeTab, setActiveTab] = useState<StorageTab>("deployments");
  const [retentionPeriod, setRetentionPeriod] = useState("30");
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState("daily");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Data Storage" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Data Storage Management</h2>
            <p className="text-gray-600 mt-1">
              Configure how deployment data, configuration history, and logs are stored and managed
            </p>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("deployments")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "deployments"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Deployment History
                </button>
                <button
                  onClick={() => setActiveTab("configurations")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "configurations"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Configuration Records
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "logs"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  System Logs
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "deployments" && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-4">Deployment History Storage</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <span className="material-icons text-blue-500 mr-2">storage</span>
                        <span className="font-medium text-gray-700">Storage Usage</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Used</span>
                          <span className="text-gray-600">24.5 MB / 1 GB</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "2.45%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <span className="material-icons text-green-500 mr-2">insert_chart</span>
                        <span className="font-medium text-gray-700">Statistics</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Total Deployments</div>
                          <div className="text-lg font-semibold text-gray-800">134</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Oldest Record</div>
                          <div className="text-lg font-semibold text-gray-800">30 days ago</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Retention Policy</h4>
                    <div className="flex items-center space-x-4">
                      <div className="w-64">
                        <label className="block text-sm text-gray-600 mb-1">Keep records for</label>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          value={retentionPeriod}
                          onChange={(e) => setRetentionPeriod(e.target.value)}
                        >
                          <option value="7">7 days</option>
                          <option value="30">30 days</option>
                          <option value="90">90 days</option>
                          <option value="180">180 days</option>
                          <option value="365">1 year</option>
                        </select>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center">
                      <span className="material-icons mr-1 text-sm">delete</span>
                      Clear All Deployment History
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
                      <span className="material-icons mr-1 text-sm">file_download</span>
                      Export Data
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "configurations" && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-4">Configuration Records</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-700">Storage Options</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="compression"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={compressionEnabled}
                            onChange={() => setCompressionEnabled(!compressionEnabled)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="compression" className="font-medium text-gray-700">Enable Compression</label>
                          <p className="text-gray-500">Compress configuration files to save storage space</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Schedule</label>
                        <select
                          className="border border-gray-300 rounded-md px-3 py-2 w-64"
                          value={backupSchedule}
                          onChange={(e) => setBackupSchedule(e.target.value)}
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                      Recent Configuration Changes
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resource
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">database-config.yaml</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Update</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin User</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today at 13:42</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">View Diff</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">api-service-deployment.yaml</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Create</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CI/CD Pipeline</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday at 16:20</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-right">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Configure Versioning
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-4">System Logs Management</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Log Levels</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Application Logs</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                          <option value="debug">Debug</option>
                          <option value="info" selected>Info</option>
                          <option value="warn">Warning</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">System Logs</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                          <option value="debug">Debug</option>
                          <option value="info" selected>Info</option>
                          <option value="warn">Warning</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 text-gray-100 font-code text-sm p-4 rounded-lg h-80 overflow-y-auto mb-6">
                    <div className="text-green-400">[2023-06-15 14:32:45] INFO: Sync completed successfully for app "frontend"</div>
                    <div className="text-gray-400">[2023-06-15 14:32:40] DEBUG: Checking Git repository for changes</div>
                    <div className="text-gray-400">[2023-06-15 14:30:22] DEBUG: Started sync process for application "api-service"</div>
                    <div className="text-yellow-400">[2023-06-15 14:30:15] WARN: Resource definitions outdated in application "api-service"</div>
                    <div className="text-red-400">[2023-06-15 14:15:30] ERROR: Failed to deploy "api-service" - missing environment variables</div>
                    <div className="text-gray-400">[2023-06-15 14:15:28] DEBUG: Starting deployment for "api-service"</div>
                    <div className="text-gray-400">[2023-06-15 14:15:10] INFO: New commit detected in repository "application-repo"</div>
                    <div className="text-green-400">[2023-06-15 13:42:20] INFO: Configuration updated for "database-config.yaml"</div>
                    <div className="text-gray-400">[2023-06-15 13:40:15] DEBUG: User "Admin" authenticated successfully</div>
                    <div className="text-gray-400">[2023-06-15 13:40:10] INFO: System startup completed</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center">
                        <span className="material-icons mr-1 text-sm">clear_all</span>
                        Clear Logs
                      </button>
                      <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                        <span className="material-icons mr-1 text-sm">file_download</span>
                        Download Logs
                      </button>
                    </div>
                    <div>
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-5">
              <h3 className="text-lg font-medium text-gray-800">Storage Metrics</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-700">Total Storage</h4>
                    <span className="material-icons text-blue-500">storage</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">125.4 MB</div>
                  <div className="text-sm text-gray-500 mt-1">0.12 GB of 1 GB used</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-700">Database Records</h4>
                    <span className="material-icons text-green-500">folder</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">1,423</div>
                  <div className="text-sm text-gray-500 mt-1">Across all tables</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-700">Growth Rate</h4>
                    <span className="material-icons text-purple-500">trending_up</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">2.4 MB/day</div>
                  <div className="text-sm text-gray-500 mt-1">Average over last 7 days</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 flex items-start">
                <span className="material-icons text-yellow-600 mr-2 mt-0.5">warning</span>
                <div>
                  <h4 className="font-medium">Storage Recommendation</h4>
                  <p className="text-sm mt-1">
                    Based on your current growth rate, we recommend increasing the retention period cleanup frequency
                    to avoid reaching storage limits. Consider exporting older records for archival.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataStoragePage;
