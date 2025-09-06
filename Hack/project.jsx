
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Project } from "@/entities/Project";
import { Task } from "@/entities/Task";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Settings,
  Users,
  MessageSquare,
  LayoutGrid,
  Plus,
  Calendar,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

import TaskBoard from "../components/tasks/TaskBoard";
import TaskModal from "../components/tasks/TaskModal";
import DiscussionThread from "../components/discussions/DiscussionThread";
import UserWorkloadInsights from "../components/insights/UserWorkloadInsights";
import AISuggestions from "../components/ai/AISuggestions";
import { useOffline } from "../components/OfflineProvider";

export default function ProjectPage() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const projectId = urlParams.get('id');
  const { cacheTasksData } = useOffline();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');

  const loadProjectData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [currentUser, projectData, tasksData] = await Promise.all([
        User.me(),
        Project.list().then(projects => projects.find(p => p.id === projectId)),
        Task.filter({ project_id: projectId }, '-updated_date')
      ]);
      
      setUser(currentUser);
      setProject(projectData);
      setTasks(tasksData);
      
      // Cache tasks for offline use
      cacheTasksData(tasksData);
    } catch (error) {
      console.error("Error loading project data:", error);
    }
    setIsLoading(false);
  }, [projectId, cacheTasksData]);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId, loadProjectData]);

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await Task.update(taskId, updates);
      await loadProjectData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await Task.update(selectedTask.id, taskData);
      } else {
        await Task.create({ ...taskData, project_id: projectId });
      }
      await loadProjectData();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await Task.delete(taskId);
      await loadProjectData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleNewTask = (status = 'todo') => {
    setSelectedTask(null);
    setDefaultTaskStatus(status);
    setShowTaskModal(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to={createPageUrl("Projects")}>
              <Button variant="outline" size="icon">
 