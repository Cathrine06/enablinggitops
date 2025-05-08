import { useState } from "react";
import Header from "@/components/ui/layout/header";

type SettingsTab = "general" | "users" | "notifications" | "integrations";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [theme, setTheme] = useState("light");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Settings" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
            <p className="text-gray-600 mt-1">
              Configure dashboard preferences, user access, notifications, and integration settings
            </p>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "general"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "users"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  User Management
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "notifications"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("integrations")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "integrations"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Integrations
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "general" && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-4">General Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                        >
                          <option value="light">Light Mode</option>
                          <option value="dark">Dark Mode</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ja">Japanese</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">Auto-refresh Dashboard</label>
                        <div className="flex items-center">
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={autoRefresh}
                              onChange={() => setAutoRefresh(!autoRefresh)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                      {autoRefresh && (
                        <div className="mt-3">
                          <label className="block text-sm text-gray-700 mb-1">Refresh Interval (seconds)</label>
                          <select
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(e.target.value)}
                          >
                            <option value="10">10 seconds</option>
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                            <option value="300">5 minutes</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="date-format-1"
                            name="date-format"
                            type="radio"
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            defaultChecked
                          />
                          <label htmlFor="date-format-1" className="ml-3 block text-sm text-gray-700">
                            MM/DD/YYYY (e.g., 06/15/2023)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="date-format-2"
                            name="date-format"
                            type="radio"
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="date-format-2" className="ml-3 block text-sm text-gray-700">
                            DD/MM/YYYY (e.g., 15/06/2023)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="date-format-3"
                            name="date-format"
                            type="radio"
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="date-format-3" className="ml-3 block text-sm text-gray-700">
                            YYYY-MM-DD (e.g., 2023-06-15)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-gray-800">User Management</h3>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <span className="material-icons mr-1 text-sm">person_add</span>
                      Add User
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Activity
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                                A
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Admin User</div>
                                <div className="text-sm text-gray-500">admin@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Administrator
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Just now
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Deactivate</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                                D
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Dev User</div>
                                <div className="text-sm text-gray-500">dev@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Developer
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            2 hours ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Deactivate</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-4">Notification Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Email Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700">Deployment Failures</label>
                          <div className="flex items-center">
                            <label className="inline-flex relative items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700">Sync Status Changes</label>
                          <div className="flex items-center">
                            <label className="inline-flex relative items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700">New User Registrations</label>
                          <div className="flex items-center">
                            <label className="inline-flex relative items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">In-App Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700">Deployment Status Changes</label>
                          <div className="flex items-center">
                            <label className="inline-flex relative items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700">Application Health Changes</label>
                          <div className="flex items-center">
                            <label className="inline-flex relative items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700">System Announcements</label>
                          <div className="flex items-center">
                            <label className="inline-flex relative items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">External Integrations</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm text-gray-700">Slack Notifications</label>
                          <p className="text-xs text-gray-500 mt-1">Send important notifications to your Slack channel</p>
                        </div>
                        <div className="flex items-center">
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Save Notification Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "integrations" && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-4">Integration Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-5 bg-gray-50 sm:px-6 flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">ArgoCD Integration</h4>
                          <p className="mt-1 text-sm text-gray-500">Connect to your ArgoCD instance</p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Connected</span>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="api-url" className="block text-sm font-medium text-gray-700">
                              API URL
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="api-url"
                                id="api-url"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                defaultValue="https://argocd.example.com/api"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="api-token" className="block text-sm font-medium text-gray-700">
                              API Token
                            </label>
                            <div className="mt-1">
                              <input
                                type="password"
                                name="api-token"
                                id="api-token"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                defaultValue="•••••••••••••••••"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-end space-x-3">
                          <button
                            type="button"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Test Connection
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Save Settings
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-5 bg-gray-50 sm:px-6 flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Git Provider Integration</h4>
                          <p className="mt-1 text-sm text-gray-500">Connect to your Git repository provider</p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Connected</span>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="git-provider" className="block text-sm font-medium text-gray-700">
                              Provider
                            </label>
                            <div className="mt-1">
                              <select
                                id="git-provider"
                                name="git-provider"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option>GitHub</option>
                                <option>GitLab</option>
                                <option>Bitbucket</option>
                                <option>Azure DevOps</option>
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="git-token" className="block text-sm font-medium text-gray-700">
                              Access Token
                            </label>
                            <div className="mt-1">
                              <input
                                type="password"
                                name="git-token"
                                id="git-token"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                defaultValue="•••••••••••••••••"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-end space-x-3">
                          <button
                            type="button"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Test Connection
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Save Settings
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-5 bg-gray-50 sm:px-6 flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Slack Integration</h4>
                          <p className="mt-1 text-sm text-gray-500">Connect to Slack for notifications</p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700">
                              Webhook URL
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="webhook-url"
                                id="webhook-url"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="https://hooks.slack.com/services/..."
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="slack-channel" className="block text-sm font-medium text-gray-700">
                              Channel
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="slack-channel"
                                id="slack-channel"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="#deployments"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-end space-x-3">
                          <button
                            type="button"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Test Webhook
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Connect Slack
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <div className="flex items-start">
              <span className="material-icons text-blue-600 mt-0.5 mr-2">info</span>
              <div>
                <h4 className="font-medium">About ArgoDash Settings</h4>
                <p className="text-sm mt-1">
                  Changes to these settings will affect your personal dashboard view and system configuration.
                  System-wide changes will apply to all users when you have administrator privileges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
