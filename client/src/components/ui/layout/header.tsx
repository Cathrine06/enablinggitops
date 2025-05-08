import { useEffect, useState } from "react";
import { format } from "date-fns";

type HeaderProps = {
  title: string;
  lastSyncTime?: Date | null;
  onSearch?: (query: string) => void;
};

const Header = ({ title, lastSyncTime, onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formattedTime, setFormattedTime] = useState<string>("Not synced yet");

  useEffect(() => {
    if (lastSyncTime) {
      const now = new Date();
      const syncDate = new Date(lastSyncTime);
      
      // Format the time differently based on how recent it is
      if (now.getDate() === syncDate.getDate() && 
          now.getMonth() === syncDate.getMonth() && 
          now.getFullYear() === syncDate.getFullYear()) {
        setFormattedTime(`Today at ${format(syncDate, 'HH:mm')}`);
      } else {
        setFormattedTime(format(syncDate, 'MMM d, yyyy HH:mm'));
      }
    } else {
      setFormattedTime("Not synced yet");
    }
  }, [lastSyncTime]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {lastSyncTime && (
            <div className="ml-4 text-sm text-gray-500">
              Last synced: <span className="font-medium">{formattedTime}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-icons absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </form>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
            <span className="material-icons">notifications</span>
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <span className="material-icons">help_outline</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
