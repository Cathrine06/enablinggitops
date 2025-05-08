import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDeployments } from "@/lib/argo-service";
import { Deployment } from "@shared/schema";
import Header from "@/components/ui/layout/header";
import { format } from "date-fns";

const PipelinesPage = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [view, setView] = useState<"list" | "graph">("list");

  const { data, isLoading } = useQuery({
    queryKey: ['/api/deployments'],
    queryFn: () => fetchDeployments(),
  });

  useEffect(() => {
    if (data) {
      setDeployments(data);
    }
  }, [data]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Successful":
        return "check_circle";
      case "Failed":
        return "error";
      case "Pending":
        return "pending";
      default:
        return "help";
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="CI/CD Pipelines" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">GitOps Pipelines</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 rounded-md flex items-center ${
                  view === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <span className="material-icons mr-1 text-sm">view_list</span>
                List View
              </button>
              <button
                onClick={() => setView("graph")}
                className={`px-4 py-2 rounded-md flex items-center ${
                  view === "graph"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <span className="material-icons mr-1 text-sm">account_tree</span>
                Graph View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200 p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">Pipeline Executions</h3>
                <div className="flex space-x-3">
                  <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <option>All Applications</option>
                    <option>Frontend</option>
                    <option>API Service</option>
                    <option>Database</option>
                    <option>Authentication</option>
                  </select>
                </div>
              </div>
            </div>

            {view === "list" ? (
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="text-center py-12">
                    <span className="material-icons animate-spin text-gray-400 text-4xl">refresh</span>
                    <p className="mt-4 text-gray-500">Loading pipeline executions...</p>
                  </div>
                ) : deployments.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-icons text-gray-400 text-4xl">account_tree</span>
                    <p className="mt-4 text-gray-500">No pipeline executions found</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Application
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revision
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Initiated By
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Started
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {deployments.map((deployment) => (
                        <tr key={deployment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                deployment.status
                              )}`}
                            >
                              <span className="material-icons text-xs mr-1">{getStatusIcon(deployment.status)}</span>
                              {deployment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              App #{deployment.applicationId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 font-code">
                              {deployment.revision}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {deployment.initiatedBy}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {format(new Date(deployment.startedAt), "MMM d, HH:mm")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {deployment.finishedAt
                                ? `${Math.round(
                                    (new Date(deployment.finishedAt).getTime() -
                                      new Date(deployment.startedAt).getTime()) /
                                      1000 / 60
                                  )}m ${Math.round(
                                    ((new Date(deployment.finishedAt).getTime() -
                                      new Date(deployment.startedAt).getTime()) /
                                      1000) %
                                      60
                                  )}s`
                                : "Running..."}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="View details"
                            >
                              <span className="material-icons">visibility</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div className="p-6 h-96 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <span className="material-icons text-4xl text-gray-400 mb-4">account_tree</span>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Pipeline Execution Graph</h4>
                  <p className="text-gray-600">
                    This view would display an interactive graph of pipeline executions,
                    showing the flow of deployments across your GitOps workflow stages.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-5">
              <h3 className="text-lg font-medium text-gray-800">Pipeline Configuration</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <span className="material-icons text-blue-500 mr-2">source</span>
                    <h4 className="font-medium text-gray-800">Source Stage</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Git repository changes trigger the CI/CD pipeline through ArgoCD's GitOps workflow.
                  </p>
                  <div className="text-xs text-gray-500">
                    Connected repositories: <span className="font-medium">2</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <span className="material-icons text-green-500 mr-2">build</span>
                    <h4 className="font-medium text-gray-800">Build Stage</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Automated builds create container images that are versioned and pushed to a registry.
                  </p>
                  <div className="text-xs text-gray-500">
                    Recent builds: <span className="font-medium">34</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <span className="material-icons text-purple-500 mr-2">rocket_launch</span>
                    <h4 className="font-medium text-gray-800">Deploy Stage</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    ArgoCD syncs the target environment with the desired state defined in Git.
                  </p>
                  <div className="text-xs text-gray-500">
                    Successful deployments: <span className="font-medium">28</span>
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

export default PipelinesPage;
