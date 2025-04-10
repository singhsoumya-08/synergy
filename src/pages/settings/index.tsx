
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user } = useAuth();
  
  // Profile settings state
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    displayName: "",
    bio: "",
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    groupUpdates: true,
    resourceUpdates: true,
    taskReminders: true,
    systemAnnouncements: true,
  });
  
  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    compactMode: false,
    highContrastMode: false,
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  
  const handleAppearanceChange = (setting: keyof typeof appearanceSettings) => {
    setAppearanceSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would save to a backend
    toast.success("Profile settings saved successfully");
  };
  
  const handleSaveNotifications = () => {
    // In a real app, this would save to a backend
    toast.success("Notification preferences saved");
  };
  
  const handleSaveAppearance = () => {
    // In a real app, this would save to a backend
    toast.success("Appearance settings saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleProfileChange}
                  placeholder="Enter display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  id="emailNotifications" 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationChange('emailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="groupUpdates">Group Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about group activity
                  </p>
                </div>
                <Switch 
                  id="groupUpdates" 
                  checked={notificationSettings.groupUpdates}
                  onCheckedChange={() => handleNotificationChange('groupUpdates')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="resourceUpdates">Resource Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when resources are added or updated
                  </p>
                </div>
                <Switch 
                  id="resourceUpdates" 
                  checked={notificationSettings.resourceUpdates}
                  onCheckedChange={() => handleNotificationChange('resourceUpdates')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="taskReminders">Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders about upcoming and due tasks
                  </p>
                </div>
                <Switch 
                  id="taskReminders" 
                  checked={notificationSettings.taskReminders}
                  onCheckedChange={() => handleNotificationChange('taskReminders')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemAnnouncements">System Announcements</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important system announcements
                  </p>
                </div>
                <Switch 
                  id="systemAnnouncements" 
                  checked={notificationSettings.systemAnnouncements}
                  onCheckedChange={() => handleNotificationChange('systemAnnouncements')}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactMode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout
                    </p>
                  </div>
                  <Switch 
                    id="compactMode" 
                    checked={appearanceSettings.compactMode}
                    onCheckedChange={() => handleAppearanceChange('compactMode')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="highContrastMode">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch 
                    id="highContrastMode" 
                    checked={appearanceSettings.highContrastMode}
                    onCheckedChange={() => handleAppearanceChange('highContrastMode')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAppearance}>Save Appearance</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Select your preferred theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use the theme toggle in the header to switch between light and dark mode
              </p>
              <div className="flex space-x-2">
                <Badge variant="outline">System</Badge>
                <Badge variant="outline">Light</Badge>
                <Badge variant="outline">Dark</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
