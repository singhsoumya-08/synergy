
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  CheckSquare, 
  Clock, 
  FileText, 
  PlusCircle, 
  Users, 
  ClipboardList, 
  ArrowRight, 
  AlertTriangle,
  Bookmark
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for dashboard
const taskStatusData = [
  { name: "Completed", value: 7, color: "#22c55e" },
  { name: "In Progress", value: 3, color: "#3b82f6" },
  { name: "On Hold", value: 2, color: "#f59e0b" },
  { name: "Pending", value: 5, color: "#6b7280" }
];

const projectProgressData = [
  { name: "Research Project", progress: 65 },
  { name: "Group Presentation", progress: 42 },
  { name: "Literature Review", progress: 85 },
  { name: "Data Analysis", progress: 30 }
];

const studyTimeData = [
  { date: "Mon", hours: 2.5 },
  { date: "Tue", hours: 3 },
  { date: "Wed", hours: 1.5 },
  { date: "Thu", hours: 4 },
  { date: "Fri", hours: 3.5 },
  { date: "Sat", hours: 1 },
  { date: "Sun", hours: 2 }
];

const upcomingDeadlines = [
  { id: "1", type: "project", name: "Group Presentation", date: "2025-05-15" },
  { id: "2", type: "task", name: "Data Collection", date: "2025-05-15" },
  { id: "3", type: "task", name: "Create Slides", date: "2025-05-12" }
];

const recentActivities = [
  { id: "1", text: "Added 2 hours work log to Research Project", time: "2 hours ago" },
  { id: "2", text: "Completed task 'Literature Review'", time: "Yesterday" },
  { id: "3", text: "Created new project 'Data Analysis'", time: "2 days ago" },
  { id: "4", text: "Added new citation to collection", time: "3 days ago" }
];

export default function DashboardPage() {
  const { user } = useAuth();

  const totalTasks = taskStatusData.reduce((sum, item) => sum + item.value, 0);
  const completedTasks = taskStatusData.find(item => item.name === "Completed")?.value || 0;
  const totalStudyHours = studyTimeData.reduce((sum, item) => sum + item.hours, 0);

  // Sort deadlines by date (closest first)
  const sortedDeadlines = [...upcomingDeadlines].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username}!</h1>
        <p className="text-muted-foreground">Here's an overview of your academic progress and tasks.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed ({Math.round((completedTasks / totalTasks) * 100)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projects
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectProgressData.length}</div>
            <p className="text-xs text-muted-foreground">
              {projectProgressData.filter(p => p.progress >= 80).length} near completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Study Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudyHours} hrs</div>
            <p className="text-xs text-muted-foreground">
              This week's study hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resources
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              5 shared in groups
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>
              Breakdown of your current tasks by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} tasks`, 'Count']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {taskStatusData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="h-3 w-3 mr-2 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-xs">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Study Hours</CardTitle>
            <CardDescription>
              Your study time across the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyTimeData}>
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Study Time']} />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Your most pressing due dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedDeadlines.slice(0, 3).map((deadline) => {
                const daysRemaining = getDaysRemaining(deadline.date);
                const isUrgent = daysRemaining <= 3;
                
                return (
                  <div key={deadline.id} className="flex items-start gap-2">
                    {isUrgent ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    ) : (
                      deadline.type === "project" ? (
                        <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5" />
                      ) : (
                        <CheckSquare className="h-5 w-5 text-green-500 mt-0.5" />
                      )
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{deadline.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          {new Date(deadline.date).toLocaleDateString()}
                        </p>
                        <p className={`text-xs ${isUrgent ? "text-amber-500 font-medium" : "text-muted-foreground"}`}>
                          {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {sortedDeadlines.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="link" size="sm" asChild>
                  <Link to="/tasks">
                    View all deadlines
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-full md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>
              Completion status of your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectProgressData.map((project) => (
                <div key={project.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        project.progress >= 80 
                          ? "bg-green-500" 
                          : project.progress >= 40 
                          ? "bg-blue-500" 
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" size="sm" asChild>
                <Link to="/projects">
                  Manage projects
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button className="justify-start" asChild>
                <Link to="/projects">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Project
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link to="/tasks">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Manage Tasks
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link to="/groups">
                  <Users className="mr-2 h-4 w-4" />
                  View Your Groups
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link to="/study-room">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Enter Study Room
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Group Activity</CardTitle>
            <CardDescription>
              Recent updates from your groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <p className="text-sm font-medium">Project Alpha</p>
                <p className="text-xs text-muted-foreground">Sarah added 2 new resources</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-1">
                <p className="text-sm font-medium">Marketing Team</p>
                <p className="text-xs text-muted-foreground">Meeting scheduled for tomorrow</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-1">
                <p className="text-sm font-medium">Study Group</p>
                <p className="text-xs text-muted-foreground">New task assigned to you</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" size="sm" asChild>
                <Link to="/groups">
                  View all groups
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
