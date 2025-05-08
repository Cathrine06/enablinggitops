import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActivities } from "@/lib/argo-service";
import { Activity } from "@shared/schema";
import { format } from "date-fns";
import { useWebSocket } from "@/hooks/use-websocket";

const getActivityIcon = (type: string, details?: any) => {
  switch (type) {
    case "Deployment":
      if (details?.status === "Failed" || details?.message?.includes("failed")) {
        return {
          icon: "error",
          bgColor: "bg-red-100",
          textColor: "text-red-500",
        };
      }
      return {
        icon: "check_circle",
        bgColor: "bg-green-100",
        textColor: "text-green-500",
      };
    case "Sync":
      return {
        icon: "history",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-500",
      };
    case "Application":
      return {
        icon: "widgets",
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
      };
    case "Repository":
      return {
        icon: "source",
        bgColor: "bg-purple-100",
        textColor: "text-purple-500",
      };
    case "Configuration":
      return {
        icon: "person",
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
      };
    default:
      return {
        icon: "info",
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
      };
  }
};

const formatTime = (timestamp: string | Date) => {
  return format(new Date(timestamp), "HH:mm");
};

const ActivityItem = ({ activity }: { activity: Activity }) => {
  const { icon, bgColor, textColor } = getActivityIcon(activity.type, activity.details);

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex items-start">
        <div
          className={`h-9 w-9 rounded-full ${bgColor} flex items-center justify-center ${textColor} flex-shrink-0`}
        >
          <span className="material-icons text-sm">{icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
            <span className="text-xs text-gray-500">
              {formatTime(activity.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {activity.details?.message || 
             `${activity.type} activity for ${activity.applicationId ? `application ${activity.applicationId}` : 'system'}`}
          </p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className="material-icons text-xs mr-1">
              {activity.userId ? "account_circle" : "source"}
            </span>
            <span>
              {activity.details?.user || 
               activity.details?.repository || 
               (activity.userId ? "User" : "System")}
            </span>
            {activity.details?.commitHash || activity.details?.revision && (
              <>
                <span className="mx-2">•</span>
                <span className="font-code">
                  {activity.details?.commitHash || activity.details?.revision}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { lastMessage } = useWebSocket();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: () => fetchActivities(10),
  });

  useEffect(() => {
    if (data) {
      setActivities(data);
    }
  }, [data]);

  // Handle WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'activityCreated') {
        setActivities(prev => [lastMessage.data, ...prev].slice(0, 10));
      } else if (lastMessage.type === 'activitiesUpdated') {
        setActivities(lastMessage.data);
      } else if (lastMessage.type === 'initialState' && lastMessage.data.activities) {
        setActivities(lastMessage.data.activities);
      }
    }
  }, [lastMessage]);

  return (
    <div className="col-span-2 bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
          <div className="flex space-x-2">
            <button 
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
              onClick={() => refetch()}
            >
              <span className="material-icons">refresh</span>
            </button>
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
              <span className="material-icons">more_vert</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-0">
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <span className="material-icons animate-spin text-gray-400 text-2xl">refresh</span>
              <p className="mt-2 text-gray-500">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-icons text-gray-400 text-2xl">inbox</span>
              <p className="mt-2 text-gray-500">No recent activities</p>
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
        <div className="p-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
