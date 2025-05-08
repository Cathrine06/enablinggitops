import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRepositories } from "@/lib/argo-service";
import { Repository } from "@shared/schema";
import { useWebSocket } from "@/hooks/use-websocket";
import Header from "@/components/ui/layout/header";
import { format } from "date-fns";

const RepositoriesPage = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { lastMessage } = useWebSocket();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/repositories'],
    queryFn: fetchRepositories,
  });

  useEffect(() => {
    if (data) {
      setRepositories(data);
    }
  }, [data]);

  // Handle WebSocket updates
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'repositoryCreated') {
      setRepositories(prev => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Git Repositories" 
        onSearch={handleSearch}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Git Repositories</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <span className="material-icons mr-1">add</span>
              Add Repository
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            {isLoading ? (
              <div className="text-center py-12">
                <span className="material-icons animate-spin text-gray-400 text-4xl">refresh</span>
                <p className="mt-4 text-gray-500">Loading repositories...</p>
              </div>
            ) : repositories.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-gray-400 text-4xl">source</span>
                <p className="mt-4 text-gray-500">No repositories found</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Add Your First Repository
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Repository Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Added
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRepositories.map((repo) => (
                      <tr key={repo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="material-icons text-gray-500 mr-2">source</span>
                            <div className="font-medium text-gray-900">{repo.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-code">{repo.url}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {repo.branch}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(repo.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-900">
                              <span className="material-icons">refresh</span>
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-900">
                              <span className="material-icons">edit</span>
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900">
                              <span className="material-icons">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoriesPage;
