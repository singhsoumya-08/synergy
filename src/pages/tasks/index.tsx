
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, CheckCircle2, Hourglass, Play, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Dummy data for tasks
const initialTasks = [
  {
    id: "1",
    name: "Literature Review",
    description: "Review scholarly articles for Research Project",
    project: "Research Project",
    deadline: "2025-05-10",
    status: "completed",
    assignee: "John D."
  },
  {
    id: "2",
    name: "Data Collection",
    description: "Gather survey results for Research Project",
    project: "Research Project",
    deadline: "2025-05-15",
    status: "in-progress",
    assignee: "Sarah L."
  },
  {
    id: "3",
    name: "Analysis",
    description: "Analyze survey data for Research Project",
    project: "Research Project",
    deadline: "2025-05-18",
    status: "pending",
    assignee: "John D."
  },
  {
    id: "4",
    name: "Create Slides",
    description: "Make presentation slides for Economics 101",
    project: "Group Presentation",
    deadline: "2025-05-12",
    status: "pending",
    assignee: "John D."
  },
  {
    id: "5",
    name: "Prepare Script",
    description: "Write talking points for presentation",
    project: "Group Presentation",
    deadline: "2025-05-13",
    status: "pending",
    assignee: "John D."
  },
  {
    id: "6",
    name: "Bibliography",
    description: "Compile references for Research Project",
    project: "Research Project",
    deadline: "2025-05-17",
    status: "on-hold",
    assignee: "John D."
  }
];

// Projects data for dropdown
const initialProjects = [
  { id: "1", name: "Research Project" },
  { id: "2", name: "Group Presentation" }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    project: "",
    deadline: "",
    status: "pending",
    assignee: "Me"
  });

  // Task status counts for pie chart
  const taskCounts = {
    completed: tasks.filter(task => task.status === "completed").length,
    "in-progress": tasks.filter(task => task.status === "in-progress").length,
    "on-hold": tasks.filter(task => task.status === "on-hold").length,
    pending: tasks.filter(task => task.status === "pending").length
  };

  const pieChartData = [
    { name: "Completed", value: taskCounts.completed, color: "#22c55e" },
    { name: "In Progress", value: taskCounts["in-progress"], color: "#3b82f6" },
    { name: "On Hold", value: taskCounts["on-hold"], color: "#f59e0b" },
    { name: "Pending", value: taskCounts.pending, color: "#6b7280" }
  ].filter(item => item.value > 0);

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Filter by status
      if (activeTab !== "all" && task.status !== activeTab) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && 
          !task.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !task.project.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const filteredTasks = getFilteredTasks();
  const tasksPerPage = 6;
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const handleCreateTask = () => {
    if (!newTask.name || !newTask.project || !newTask.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    const task = {
      id: (tasks.length + 1).toString(),
      name: newTask.name,
      description: newTask.description,
      project: newTask.project,
      deadline: newTask.deadline,
      status: newTask.status,
      assignee: newTask.assignee
    };

    setTasks([...tasks, task]);
    setNewTask({
      name: "",
      description: "",
      project: "",
      deadline: "",
      status: "pending",
      assignee: "Me"
    });
    setDialogOpen(false);
    toast.success("Task created successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <Play className="h-3 w-3" /> In Progress
        </Badge>;
      case "on-hold":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> On Hold
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
          <Hourglass className="h-3 w-3" /> Pending
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create a New Task</DialogTitle>
              <DialogDescription>
                Add task details to track your work progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Enter task name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="What's this task about?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-project">Project</Label>
                <Select 
                  value={newTask.project}
                  onValueChange={(value) => setNewTask({ ...newTask, project: value })}
                >
                  <SelectTrigger id="task-project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialProjects.map(project => (
                      <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-deadline">Deadline</Label>
                <Input
                  id="task-deadline"
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status</Label>
                <Select 
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger id="task-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Input
                  id="task-assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="Assigned to"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 sm:grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="grid gap-4">
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden hover:border-primary/50 transition-colors duration-200">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <CardTitle className="text-lg">{task.name}</CardTitle>
                      {getStatusBadge(task.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Due {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Project: </span>
                          <span className="font-medium">{task.project}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Assignee: </span>
                          <span className="font-medium">{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No tasks found.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Tasks']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {pieChartData.map((entry) => (
                  <div key={entry.name} className="flex items-center">
                    <div className="h-3 w-3 mr-2 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-xs">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks
                .filter(task => task.status !== "completed")
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 3)
                .map(task => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{task.name}</p>
                      <p className="text-xs text-muted-foreground">{task.project}</p>
                    </div>
                    <div className="text-xs bg-secondary px-2 py-1 rounded">
                      {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
