
import React, { useState, useEffect } from "react";
import { Project } from "@/entities/Project";
import { Task } from "@/entities/Task";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus,
  Zap,
  TrendingUp,
  ArrowRight
} from "lucide-react";

import StatsOverview from "../components/dashboard/StatsOverview";
import ProjectCard from "../components/dashboard/ProjectCard";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getTasksForProject = (projectId) => {
    return tasks.filter(task => task.project_id === projectId);
  };

  const recentProjects = projects.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back{user ? `, ${user.full_name?.split(' ')[0] || user.email?.split('@')[0]}` : ''}!</h1>
                <p className="text-blue-100 text-lg">Ready to make things happen?</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to={createPageUrl("Projects")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Project
                </Button>
              </Link>
              <Link to={createPageUrl("Team")}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Team Activity
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview projects={projects} tasks={tasks} user={user} />

        {/* Recent Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
              <p className="text-gray-600 mt-1">Your active collaborations</p>
            </div>
            <Link to={createPageUrl("Projects")}>
              <Button variant="outline" className="flex items-center gap-2">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={getTasksForProject(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Create your first project to start collaborating with your team</p>
              <Link to={createPageUrl("Projects")}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}