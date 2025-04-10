
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
import { toast } from "sonner";
import { FileIcon, ImageIcon, PlusIcon, SearchIcon, FileText, Download, File, FilePdf } from "lucide-react";

// Dummy data for resources
const initialResources = [
  {
    id: "1",
    name: "Project Requirements.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadedAt: "2 days ago"
  },
  {
    id: "2",
    name: "Marketing Strategy.docx",
    type: "DOCX",
    size: "1.8 MB",
    uploadedBy: "Jane Smith",
    uploadedAt: "1 week ago"
  },
  {
    id: "3",
    name: "Logo Design.png",
    type: "PNG",
    size: "0.6 MB",
    uploadedBy: "John Doe",
    uploadedAt: "3 days ago"
  },
  {
    id: "4",
    name: "Budget Report.xlsx",
    type: "XLSX",
    size: "3.2 MB",
    uploadedBy: "Jane Smith",
    uploadedAt: "5 hours ago"
  }
];

export default function ResourcesPage() {
  const [resources, setResources] = useState(initialResources);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newResources = Array.from(files).map((file, index) => ({
      id: (resources.length + index + 1).toString(),
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || "UNKNOWN",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: "You",
      uploadedAt: "Just now"
    }));
    
    setResources([...resources, ...newResources]);
    setDialogOpen(false);
    toast.success(`${files.length} resource${files.length > 1 ? 's' : ''} uploaded successfully!`);
  };

  // Type guard for DragEvent
  function isDragEvent(event: React.DragEvent | React.ChangeEvent): event is React.DragEvent {
    return 'dataTransfer' in event;
  }

  const handleChange = (event: React.DragEvent | React.ChangeEvent) => {
    if (isDragEvent(event)) {
      // Drag events
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleUpload(event.dataTransfer.files);
      }
    } else {
      // Input file change events
      const target = event.target as HTMLInputElement;
      if (target.files) {
        handleUpload(target.files);
      }
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'PDF':
        return <FilePdf className="w-10 h-10 text-red-500" />;
      case 'DOCX':
        return <FileText className="w-10 h-10 text-blue-500" />;
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return <ImageIcon className="w-10 h-10 text-green-500" />;
      default:
        return <File className="w-10 h-10 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="w-full sm:w-[260px] pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Resource</DialogTitle>
                <DialogDescription>
                  Drag and drop files or click to browse
                </DialogDescription>
              </DialogHeader>
              <div 
                className={`
                  h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4
                  ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleChange}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleChange}
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <FileIcon className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag files here or click to browse
                  </p>
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start">
                {getResourceIcon(resource.type)}
                <div className="ml-3 flex-1 overflow-hidden">
                  <CardTitle className="text-lg truncate">{resource.name}</CardTitle>
                  <CardDescription>{resource.uploadedBy} • {resource.uploadedAt}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{resource.type}</span>
                <span className="text-muted-foreground">{resource.size}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-10">
          <FileIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No resources found</h3>
          <p className="text-muted-foreground">
            {search ? "Try a different search term" : "Upload your first resource to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
