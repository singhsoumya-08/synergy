
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bell, CheckCircle, Clock, X } from "lucide-react";

// Dummy notification data
const initialNotifications = [
  {
    id: "1",
    title: "New resource added",
    description: "A new document was added to Project Alpha",
    time: "2 hours ago",
    read: false,
    type: "resource"
  },
  {
    id: "2",
    title: "Group invitation",
    description: "You've been invited to join Project Beta",
    time: "1 day ago",
    read: false,
    type: "group"
  },
  {
    id: "3",
    title: "Task deadline reminder",
    description: "Task 'Review documentation' is due tomorrow",
    time: "3 hours ago",
    read: false,
    type: "task"
  },
  {
    id: "4",
    title: "System maintenance",
    description: "Scheduled maintenance on April 15, 2025",
    time: "5 days ago",
    read: true,
    type: "system"
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const filteredNotifications = filter === "all" 
    ? notifications 
    : filter === "unread" 
      ? notifications.filter(notification => !notification.read)
      : notifications.filter(notification => notification.type === filter);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
    toast.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success("Notification dismissed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "unread" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button 
            variant={filter === "resource" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("resource")}
          >
            Resources
          </Button>
          <Button 
            variant={filter === "group" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("group")}
          >
            Groups
          </Button>
          <Button 
            variant={filter === "task" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("task")}
          >
            Tasks
          </Button>
          <Button 
            variant={filter === "system" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("system")}
          >
            System
          </Button>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {notification.title}
                    </CardTitle>
                    {!notification.read && (
                      <Badge variant="default" className="ml-2">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={notification.read}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDismiss(notification.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{notification.time}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notification.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
            <p className="text-muted-foreground">
              {filter !== "all" 
                ? `You don't have any ${filter} notifications` 
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
