
import React, { useState, useEffect } from "react";
import { Project } from "@/entities/Project";
import { Task } from "@/entities/Task";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Search,
  Filter,
  FolderKanban,
  Grid3x3,
  List
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProjectCard from "../components/dashboard/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning',
    color: 'blue',
    members: [],
    due_date: ''
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
    } catch (error) {
      console.error("Error loading projects data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;
    
    try {
      const projectData = {
        ...newProject,
        members: user ? [user.email, ...newProject.members] : newProject.members
      };
      
      await Project.create(projectData);
      
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        color: 'blue',
        members: [],
        due_date: ''
      });
      setShowCreateModal(false);
      await loadData();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const getTasksForProject = (projectId) => {
    return tasks.filter(task => task.project_id === projectId);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projectsByStatus = {
    all: filteredProjects,
    planning: filteredProjects.filter(p => p.status === 'planning'),
    active: filteredProjects.filter(p => p.status === 'active'),
    completed: filteredProjects.filter(p => p.status === 'completed'),
    on_hold: filteredProjects.filter(p => p.status === 'on_hold')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage and track your team collaborations</p>
          </div>
          
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
 