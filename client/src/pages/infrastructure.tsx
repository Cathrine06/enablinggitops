import Header from "@/components/ui/layout/header";
import InfrastructureTopologyGraph from "@/components/dashboard/infrastructure-topology";

const Infrastructure = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Infrastructure" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200 p-5">
              <h3 className="text-lg font-medium text-gray-800">Infrastructure Overview</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                This page provides a comprehensive view of your infrastructure resources managed through ArgoCD.
                Monitor the health and status of your clusters, namespaces, and other infrastructure components.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">storage</span>
                    <h4 className="font-medium">Clusters</h4>
                  </div>
                  <div className="mt-2 text-2xl font-semibold">1</div>
                </div>
                
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <div className="flex items-center">
                    <span className="material-icons text-purple-500 mr-2">web_asset</span>
                    <h4 className="font-medium">Namespaces</h4>
                  </div>
                  <div className="mt-2 text-2xl font-semibold">4</div>
                </div>
                
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <div className="flex items-center">
                    <span className="material-icons text-green-500 mr-2">dns</span>
                    <h4 className="font-medium">Nodes</h4>
                  </div>
                  <div className="mt-2 text-2xl font-semibold">8</div>
                </div>
              </div>
            </div>
          </div>

          <InfrastructureTopologyGraph />
          
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="border-b border-gray-200 p-5">
              <h3 className="text-lg font-medium text-gray-800">Resource Utilization</h3>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-500">
                Resource utilization metrics would be displayed here, showing CPU, memory, and storage usage across clusters and nodes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Infrastructure;
