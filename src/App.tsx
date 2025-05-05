
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import AuthGuard from "@/components/auth-guard";

import { Layout } from "@/components/layout/layout";
import DashboardPage from "./pages/dashboard";
import ProjectsPage from "./pages/projects";
import TasksPage from "./pages/tasks";
import WorkLogPage from "./pages/work-log";
import StudyRoomPage from "./pages/study-room";
import GroupsPage from "./pages/groups";
import ResourcesPage from "./pages/resources";
import NotificationsPage from "./pages/notifications";
import SettingsPage from "./pages/settings";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthGuard>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/work-log" element={<WorkLogPage />} />
                  <Route path="/study-room" element={<StudyRoomPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
