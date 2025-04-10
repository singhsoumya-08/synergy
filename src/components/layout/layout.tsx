
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/providers/auth-provider";

export function Layout() {
  const { isAuthenticated } = useAuth();
  
  // Only show layout with sidebar when authenticated
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
