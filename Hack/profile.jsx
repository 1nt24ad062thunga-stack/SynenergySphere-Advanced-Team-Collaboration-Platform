import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Project } from "@/entities/Project";
import { Task } from "@/entities/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User as UserIcon,
  Mail,
  Save,
  Settings,
  Target,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    location: '',
    timezone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [currentUser, projectsData, tasksData] = await Promise.all([
        User.me(),
        Project.list('-updated_date'),
        Task.list('-updated_date')
      ]);
      
      setUser(currentUser);
      setProjects(projectsData);
      setTasks(tasksData);
      
      setProfileData({
        full_name: currentUser.full_name || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        timezone: currentUser.timezone || ''
      });
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
    setIsLoading(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(profileData);
      await loadData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsSaving(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const myProjects = projects.filter(p => p.created_by === user.email || p.members?.includes(user.email));
  const myTasks = tasks.filter(t => t.assigned_to === user.email);
  const completedTasks = myTasks.filter(t => t.status === 'done');
  const completionRate = myTasks.length > 0 ? Math.round((completedTasks.length / myTasks.length) * 100) : 0;

  const recentActivity = tasks
    .filter(t => t.assigned_to === user.email)
    .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600" />
          <CardContent className="relative p-6 -mt-16">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-white">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-2xl font-bold">
                  {user.full_name?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {user.full_name || user.email?.split('@')[0]}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {user.role}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active since {format(new Date(user.created_date), 'MMM yyyy')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
 