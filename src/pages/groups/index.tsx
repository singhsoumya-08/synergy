
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
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { Plus, Users, Calendar } from "lucide-react";

// Dummy data for groups
const initialGroups = [
  {
    id: "1",
    name: "Project Alpha",
    description: "Main development project for Q2",
    members: 5,
    progress: 65,
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Marketing Team",
    description: "Coordinate all marketing activities",
    members: 3,
    progress: 42,
    lastActive: "1 day ago"
  }
];

export default function GroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState(initialGroups);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateGroup = () => {
    if (!newGroup.name) {
      toast.error("Group name is required");
      return;
    }

    const group = {
      id: (groups.length + 1).toString(),
      name: newGroup.name,
      description: newGroup.description,
      members: 1,
      progress: 0,
      lastActive: "Just now"
    };

    setGroups([...groups, group]);
    setNewGroup({ name: "", description: "" });
    setDialogOpen(false);
    toast.success("Group created successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Groups</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Group</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new collaboration group
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Enter group name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="What's this group about?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{group.members} members</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{group.lastActive}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{group.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${group.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
