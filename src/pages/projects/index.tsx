
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { Plus, Calendar, Users, Clock, AlertCircle, CheckCircle2, Hourglass, Play } from "lucide-react";

// Dummy data for projects
const initialProjects = [
  {
    id: "1",
    name: "Research Project",
    description: "Literature review and data collection for sociology assignment",
    deadline: "2025-05-20",
    members: ["John D.", "Sarah L."],
    status: "in-progress",
    tasks: [
      { id: "t1", name: "Literature Review", status: "completed", assignee: "John D." },
      { id: "t2", name: "Data Collection", status: "in-progress", assignee: "Sarah L." },
      { id: "t3", name: "Analysis", status: "pending", assignee: "John D." }
    ]
  },
  {
    id: "2",
    name: "Group Presentation",
    description: "End of semester presentation for Economics 101",
    deadline: "2025-05-15",
    members: ["John D."],
    status: "pending",
    tasks: [
      { id: "t4", name: "Create Slides", status: "pending", assignee: "John D." },
      { id: "t5", name: "Prepare Script", status: "pending", assignee: "John D." }
    ]
  }
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(initialProjects);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    deadline: "",
    status: "pending"
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleCreateProject = () => {
    if (!newProject.name) {
      toast.error("Project name is required");
      return;
    }

    if (!newProject.deadline) {
      toast.error("Deadline is required");
      return;
    }

    const project = {
      id: (projects.length + 1).toString(),
      name: newProject.name,
      description: newProject.description,
      deadline: newProject.deadline,
      members: [user?.username || "You"],
      status: newProject.status,
      tasks: []
    };

    setProjects([...projects, project]);
    setNewProject({ name: "", description: "", deadline: "", status: "pending" });
    setDialogOpen(false);
    toast.success("Project created successfully!");
  };

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.status === activeFilter);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-amber-100 text-amber-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress": return <Play className="h-4 w-4" />;
      case "on-hold": return <AlertCircle className="h-4 w-4" />;
      case "pending": return <Hourglass className="h-4 w-4" />;
      default: return <Hourglass className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create a New Project</DialogTitle>
              <DialogDescription>
                Add your project details to get started tracking your work
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="What's this project about?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newProject.status}
                  onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                >
                  <SelectTrigger id="status">
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="on-hold">On Hold</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle>{project.name}</CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadgeColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span>{project.status.replace("-", " ").charAt(0).toUpperCase() + project.status.replace("-", " ").slice(1)}</span>
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Due {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {project.members.join(", ")}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Tasks</span>
                      <span className="text-sm font-medium">{project.tasks.filter(t => t.status === "completed").length}/{project.tasks.length}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${project.tasks.length > 0 ? (project.tasks.filter(t => t.status === "completed").length / project.tasks.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No projects found. Create your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
