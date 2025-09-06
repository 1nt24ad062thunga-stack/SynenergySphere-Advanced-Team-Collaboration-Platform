import React, { useState, useEffect } from "react";
import { Project } from "@/entities/Project";
import { Task } from "@/entities/Task";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users,
  Search,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Plus,
  UserPlus
} from "lucide-react";
import { format } from "date-fns";

export default function Team() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      console.error("Error loading team data:", error);
    }
    setIsLoading(false);
  };

  // Get all unique team members
  const getAllMembers = () => {
    const memberSet = new Set();
    projects.forEach(project => {
      project.members?.forEach(member => memberSet.add(member));
    });
    return Array.from(memberSet);
  };

  // Get member statistics
  const getMemberStats = (memberEmail) => {
    const memberProjects = projects.filter(p => p.members?.includes(memberEmail));
    const memberTasks = tasks.filter(t => t.assigned_to === memberEmail);
    const completedTasks = memberTasks.filter(t => t.status === 'done');
    
    return {
      projectCount: memberProjects.length,
      taskCount: memberTasks.length,
      completedTasks: completedTasks.length,
      activeTasks: memberTasks.filter(t => t.status !== 'done').length,
      projects: memberProjects
    };
  };

  const allMembers = getAllMembers();
  const filteredMembers = allMembers.filter(member =>
    member.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MemberCard = ({ memberEmail }) => {
    const stats = getMemberStats(memberEmail);
    const memberName = memberEmail.split('@')[0];
    const initials = memberName.charAt(0).toUpperCase();

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{memberName}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Mail className="w-3 h-3" />
                <span className="truncate">{memberEmail}</span>
              </div>
            </div>
            {memberEmail === user?.email && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                You
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{stats.projectCount}</div>
              <div className="text-xs text-blue-700">Projects</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{stats.completedTasks}</div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
          </div>

          {/* Task Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Target className="w-4 h-4" />
                <span>Active Tasks</span>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {stats.activeTasks}
              </Badge>
            </div>
            
            {stats.taskCount > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.completedTasks / stats.taskCount) * 100}%` }}
                />
 