import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type SidebarItemType = {
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
};

type SidebarSectionType = {
  title: string;
  items: SidebarItemType[];
};

const SidebarItem = ({ label, icon, href, isActive }: SidebarItemType) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 transition-colors duration-200",
          isActive && "bg-gray-800 text-white"
        )}
      >
        <span className="material-icons mr-3">{icon}</span>
        {label}
      </a>
    </Link>
  );
};

const Sidebar = () => {
  const [location] = useLocation();

  const sections: SidebarSectionType[] = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: "dashboard",
          href: "/",
          isActive: location === "/" || location === "/dashboard",
        },
        {
          label: "Infrastructure",
          icon: "trending_up",
          href: "/infrastructure",
          isActive: location === "/infrastructure",
        },
        {
          label: "Applications",
          icon: "widgets",
          href: "/applications",
          isActive: location === "/applications",
        },
      ],
    },
    {
      title: "GitOps",
      items: [
        {
          label: "Repositories",
          icon: "source",
          href: "/repositories",
          isActive: location === "/repositories",
        },
        {
          label: "Pipelines",
          icon: "account_tree",
          href: "/pipelines",
          isActive: location === "/pipelines",
        },
        {
          label: "Sync Status",
          icon: "sync",
          href: "/sync-status",
          isActive: location === "/sync-status",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Data Storage",
          icon: "storage",
          href: "/data-storage",
          isActive: location === "/data-storage",
        },
        {
          label: "Settings",
          icon: "settings",
          href: "/settings",
          isActive: location === "/settings",
        },
      ],
    },
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 flex-shrink-0 h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <div className="flex items-center">
          <span className="material-icons text-teal-400 mr-2">sailing</span>
          <h1 className="text-xl font-semibold">ArgoDash</h1>
        </div>
      </div>
      <nav className="mt-5 flex-1">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item, itemIndex) => (
              <SidebarItem
                key={itemIndex}
                label={item.label}
                icon={item.icon}
                href={item.href}
                isActive={item.isActive}
              />
            ))}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">administrator</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-white">
            <span className="material-icons text-sm">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
