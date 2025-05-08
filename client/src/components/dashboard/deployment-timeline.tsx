import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDeploymentTimeline } from "@/lib/argo-service";
import { TimelineItem } from "@/lib/types";
import { format } from "date-fns";

const DeploymentTimeline = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/deployments/timeline'],
    queryFn: fetchDeploymentTimeline,
  });

  useEffect(() => {
    if (data) {
      // Filter data based on selected time range
      let filteredData = [...data];
      const now = new Date();

      if (timeRange === "24h") {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        filteredData = data.filter(item => new Date(item.timestamp) >= yesterday);
      } else if (timeRange === "7d") {
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filteredData = data.filter(item => new Date(item.timestamp) >= lastWeek);
      } else if (timeRange === "30d") {
        const lastMonth = new Date(now);
        lastMonth.setDate(lastMonth.getDate() - 30);
        filteredData = data.filter(item => new Date(item.timestamp) >= lastMonth);
      }

      setTimelineData(filteredData);
    }
  }, [data, timeRange]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200 p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Deployment Timeline</h3>
          <div className="flex space-x-3">
            <select
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={timeRange}
              onChange={handleRangeChange}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last Week</option>
              <option value="30d">Last Month</option>
            </select>
            <button
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
              title="Download timeline data"
            >
              <span className="material-icons">download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <div
            className="min-w-full"
            style={{ width: "100%", height: "220px", position: "relative" }}
          >
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-full">
                <span className="material-icons animate-spin text-gray-400 text-2xl">refresh</span>
                <p className="mt-2 text-gray-500">Loading deployment timeline...</p>
              </div>
            ) : timelineData.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full">
                <span className="material-icons text-4xl text-gray-400 mb-2">timeline</span>
                <p className="text-gray-500 max-w-md text-center">
                  No deployment data available for the selected time period.
                </p>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="w-full h-full relative">
                  {/* 
                    In a real implementation, this would be a Chart.js or D3.js timeline chart.
                    For now, we'll show a placeholder message.
                  */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-icons text-4xl text-gray-400 mb-2">timeline</span>
                    <p className="text-gray-500 max-w-md text-center ml-4">
                      Interactive timeline chart would display {timelineData.length} deployments 
                      from {format(new Date(timelineData[timelineData.length - 1]?.timestamp || new Date()), 'MMM d')} 
                      to {format(new Date(timelineData[0]?.timestamp || new Date()), 'MMM d')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <div>
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            <span>Success</span>
          </div>
          <div>
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
            <span>Pending</span>
          </div>
          <div>
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1"></span>
            <span>Failed</span>
          </div>
          <div>
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
            <span>Rollback</span>
          </div>
          <div>
            <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mr-1"></span>
            <span>Manual</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentTimeline;
