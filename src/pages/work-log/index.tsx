
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Plus, Clock, Calendar } from "lucide-react";

// Mock data for work logs
const initialLogs = [
  { id: "1", project: "Research Project", task: "Literature Review", duration: 4, date: "2025-05-01" },
  { id: "2", project: "Group Presentation", task: "Create Slides", duration: 2, date: "2025-05-02" },
  { id: "3", project: "Research Project", task: "Data Collection", duration: 3, date: "2025-05-02" },
  { id: "4", project: "Group Presentation", task: "Prepare Script", duration: 1.5, date: "2025-05-03" },
  { id: "5", project: "Research Project", task: "Analysis", duration: 2.5, date: "2025-05-04" },
  { id: "6", project: "Research Project", task: "Literature Review", duration: 2, date: "2025-05-04" },
  { id: "7", project: "Group Presentation", task: "Rehearse", duration: 1, date: "2025-05-05" }
];

// Projects data for dropdown
const initialProjects = [
  { id: "1", name: "Research Project", tasks: ["Literature Review", "Data Collection", "Analysis", "Write Report"] },
  { id: "2", name: "Group Presentation", tasks: ["Create Slides", "Prepare Script", "Rehearse", "Presentation Day"] }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export default function WorkLogPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    project: "",
    task: "",
    duration: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedProject, setSelectedProject] = useState("");
  const [availableTasks, setAvailableTasks] = useState<string[]>([]);

  // Process data for bar chart (by date)
  const processBarChartData = () => {
    const dataByDate = logs.reduce((acc: Record<string, any>, log) => {
      const date = log.date;
      if (!acc[date]) {
        acc[date] = {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };
      }
      if (!acc[date][log.project]) {
        acc[date][log.project] = 0;
      }
      acc[date][log.project] += log.duration;
      return acc;
    }, {});

    return Object.values(dataByDate).sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  const barChartData = processBarChartData();

  // Process data for pie chart (by project)
  const processPieChartData = () => {
    const dataByProject = logs.reduce((acc: Record<string, number>, log) => {
      if (!acc[log.project]) {
        acc[log.project] = 0;
      }
      acc[log.project] += log.duration;
      return acc;
    }, {});

    return Object.entries(dataByProject).map(([name, value]) => ({ name, value }));
  };

  const pieChartData = processPieChartData();

  const handleCreateLog = () => {
    if (!newLog.project || !newLog.task || !newLog.duration || !newLog.date) {
      toast.error("Please fill in all fields");
      return;
    }

    const duration = parseFloat(newLog.duration);
    if (isNaN(duration) || duration <= 0) {
      toast.error("Duration must be a positive number");
      return;
    }

    const log = {
      id: (logs.length + 1).toString(),
      project: newLog.project,
      task: newLog.task,
      duration: duration,
      date: newLog.date
    };

    setLogs([...logs, log]);
    setNewLog({
      project: "",
      task: "",
      duration: "",
      date: new Date().toISOString().split('T')[0]
    });
    setDialogOpen(false);
    toast.success("Work log added successfully!");
  };

  const handleProjectChange = (project: string) => {
    setNewLog({ ...newLog, project, task: "" });
    setSelectedProject(project);
    
    const selectedProjectObj = initialProjects.find(p => p.name === project);
    setAvailableTasks(selectedProjectObj ? selectedProjectObj.tasks : []);
  };

  const totalHours = logs.reduce((sum, log) => sum + log.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Log</h1>
          <p className="text-muted-foreground">Track time spent on your projects and tasks</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Your Work</DialogTitle>
              <DialogDescription>
                Record time spent on a project or task
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Select 
                  value={newLog.project}
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger id="project">
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
                <Label htmlFor="task">Task</Label>
                <Select 
                  value={newLog.task}
                  onValueChange={(task) => setNewLog({ ...newLog, task })}
                  disabled={!selectedProject}
                >
                  <SelectTrigger id="task">
                    <SelectValue placeholder={selectedProject ? "Select task" : "Select a project first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTasks.map(task => (
                      <SelectItem key={task} value={task}>{task}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={newLog.duration}
                  onChange={(e) => setNewLog({ ...newLog, duration: e.target.value })}
                  placeholder="2.5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newLog.date}
                  onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateLog}>Log Work</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <span className="text-3xl font-bold">{totalHours}</span>
            </div>
            <p className="text-muted-foreground text-center mt-2">Hours logged</p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Time Distribution by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Work Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                <Legend />
                {initialProjects.map((project, index) => (
                  <Bar 
                    key={project.id} 
                    dataKey={project.name}
                    stackId="a" 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
              <div>Date</div>
              <div className="col-span-2">Project & Task</div>
              <div>Duration</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {logs
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((log) => (
                  <div key={log.id} className="grid grid-cols-5 p-3 text-sm items-center">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(log.date).toLocaleDateString()}
                    </div>
                    <div className="col-span-2">
                      <div className="font-medium">{log.project}</div>
                      <div className="text-muted-foreground">{log.task}</div>
                    </div>
                    <div>{log.duration} {log.duration === 1 ? 'hour' : 'hours'}</div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
