
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { 
  Plus, 
  Check, 
  Music, 
  PauseCircle, 
  PlayCircle, 
  Volume2, 
  VolumeX,
  Clock,
  BookOpen,
  Bookmark
} from "lucide-react";

// Music tracks data
const musicTracks = [
  { id: "1", title: "Lo-Fi Study Beats", duration: "3:15" },
  { id: "2", title: "Ambient Nature Sounds", duration: "4:22" },
  { id: "3", title: "Classical Focus Music", duration: "2:58" },
  { id: "4", title: "Deep Concentration", duration: "5:10" },
  { id: "5", title: "Peaceful Piano", duration: "3:45" }
];

// Citation styles
const citationStyles = ["APA", "MLA", "Chicago", "Harvard", "IEEE"];

export default function StudyRoomPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([
    { id: "1", text: "Review Chapter 5", completed: false },
    { id: "2", text: "Complete practice questions", completed: false },
    { id: "3", text: "Organize lecture notes", completed: true }
  ]);
  const [newTask, setNewTask] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [citations, setCitations] = useState([
    { id: "1", title: "Machine Learning Fundamentals", author: "Smith, J.", year: "2023", source: "Journal of AI" },
    { id: "2", title: "Data Analysis Techniques", author: "Johnson, A.", year: "2022", source: "Data Science Review" }
  ]);
  const [citationForm, setCitationForm] = useState({
    title: "",
    author: "",
    year: "",
    source: "",
    style: "APA"
  });
  const [showCitationForm, setShowCitationForm] = useState(false);

  // Study timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive) {
      interval = setInterval(() => {
        setStudyTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    setTasks([...tasks, { id: (tasks.length + 1).toString(), text: newTask, completed: false }]);
    setNewTask("");
    toast.success("Task added to your study list");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const playNextTrack = () => {
    setCurrentTrack((currentTrack + 1) % musicTracks.length);
  };

  const playPreviousTrack = () => {
    setCurrentTrack((currentTrack - 1 + musicTracks.length) % musicTracks.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success(`Now playing: ${musicTracks[currentTrack].title}`);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
    if (!timerActive) {
      toast.success("Study timer started");
    } else {
      toast.success(`Study session: ${formatTime(studyTime)}`);
    }
  };

  const resetTimer = () => {
    setStudyTime(0);
    setTimerActive(false);
    toast.success("Timer reset");
  };

  const handleAddCitation = () => {
    if (!citationForm.title || !citationForm.author) {
      toast.error("Title and author are required");
      return;
    }

    setCitations([
      ...citations, 
      { 
        id: (citations.length + 1).toString(), 
        title: citationForm.title,
        author: citationForm.author,
        year: citationForm.year,
        source: citationForm.source
      }
    ]);
    
    setCitationForm({
      title: "",
      author: "",
      year: "",
      source: "",
      style: "APA"
    });
    
    setShowCitationForm(false);
    toast.success("Citation added to your collection");
  };

  const formatCitation = (citation: any, style: string) => {
    switch (style) {
      case "APA":
        return `${citation.author} (${citation.year}). ${citation.title}. ${citation.source}.`;
      case "MLA":
        return `${citation.author}. "${citation.title}." ${citation.source}, ${citation.year}.`;
      case "Chicago":
        return `${citation.author}. ${citation.title}. ${citation.source} (${citation.year}).`;
      default:
        return `${citation.author} (${citation.year}). ${citation.title}. ${citation.source}.`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Room</h1>
          <p className="text-muted-foreground">Your personal distraction-free study space</p>
        </div>
        <Button 
          variant={timerActive ? "destructive" : "default"}
          onClick={toggleTimer}
        >
          {timerActive ? "Stop Timer" : "Start Study Session"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Study To-Do List
            </CardTitle>
            <CardDescription>Track what you need to study today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      task.completed ? "bg-muted line-through text-muted-foreground" : ""
                    }`}
                  >
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTask(task.id)}
                      id={`task-${task.id}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {task.text}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No tasks yet. Add some to start studying!</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Study Timer
            </CardTitle>
            <CardDescription>Keep track of your study time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-mono text-center pt-6 pb-8">
              {formatTime(studyTime)}
            </div>
            <div className="flex justify-center space-x-2">
              <Button onClick={toggleTimer} variant="outline">
                {timerActive ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                {timerActive ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimer} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="mr-2 h-5 w-5" />
              Study Music
            </CardTitle>
            <CardDescription>Background music to enhance focus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {musicTracks.map((track, index) => (
                <div 
                  key={track.id} 
                  className={`p-2 rounded-md flex justify-between items-center ${
                    currentTrack === index ? "bg-secondary" : ""
                  }`}
                  onClick={() => setCurrentTrack(index)}
                >
                  <div className="flex items-center">
                    {currentTrack === index && isPlaying ? (
                      <PauseCircle className="h-4 w-4 mr-2 text-primary" />
                    ) : (
                      <PlayCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span className="text-sm">{track.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{track.duration}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={playPreviousTrack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5"></line>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlayPause}>
                {isPlaying ? (
                  <PauseCircle className="h-5 w-5" />
                ) : (
                  <PlayCircle className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNextTrack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Bookmark className="mr-2 h-5 w-5" />
                Citation Collection
              </CardTitle>
              <CardDescription>Organize your research references</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCitationForm(!showCitationForm)}>
              {showCitationForm ? "Cancel" : "Add Citation"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {showCitationForm && (
              <Card className="mb-4 border-dashed">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        value={citationForm.title}
                        onChange={(e) => setCitationForm({...citationForm, title: e.target.value})}
                        placeholder="Publication title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input 
                        id="author" 
                        value={citationForm.author}
                        onChange={(e) => setCitationForm({...citationForm, author: e.target.value})}
                        placeholder="Last name, First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input 
                        id="year" 
                        value={citationForm.year}
                        onChange={(e) => setCitationForm({...citationForm, year: e.target.value})}
                        placeholder="Publication year"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Source</Label>
                      <Input 
                        id="source" 
                        value={citationForm.source}
                        onChange={(e) => setCitationForm({...citationForm, source: e.target.value})}
                        placeholder="Journal, Book, Website, etc."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCitationForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddCitation}>Add Citation</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {citations.length > 0 ? (
              <div className="space-y-2">
                {citations.map((citation) => (
                  <div key={citation.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{citation.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatCitation(citation, "APA")}
                    </div>
                    <div className="flex justify-end mt-2">
                      <div className="text-xs bg-secondary px-2 py-1 rounded">
                        {citation.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No citations yet. Add some for your research!</p>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {citationStyles.map(style => (
                <div key={style} className="px-2 py-1 bg-secondary rounded-full">{style}</div>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
