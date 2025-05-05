
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Users,
  FileBox,
  Bell,
  Settings,
  CheckSquare,
  BookOpen,
  ClipboardList,
  Clock
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Projects", path: "/projects", icon: ClipboardList },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Groups", path: "/groups", icon: Users },
    { name: "Resources", path: "/resources", icon: FileBox },
    { name: "Work Log", path: "/work-log", icon: Clock },
    { name: "Study Room", path: "/study-room", icon: BookOpen },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "flex flex-col h-screen border-r transition-all duration-300 bg-background",
        collapsed ? "w-[70px]" : "w-[250px]",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <span className="text-xl font-bold text-primary">Synergy</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapsed}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground"
                  )
                }
              >
                <item.icon size={20} />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && user && (
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
