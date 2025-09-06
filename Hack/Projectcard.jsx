import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const colorSchemes = {
  blue: "from-blue-500 to-blue-600 border-blue-200 bg-blue-50",
  green: "from-green-500 to-green-600 border-green-200 bg-green-50",
  purple: "from-purple-500 to-purple-600 border-purple-200 bg-purple-50",
  orange: "from-orange-500 to-orange-600 border-orange-200 bg-orange-50",
  red: "from-red-500 to-red-600 border-red-200 bg-red-50",
  pink: "from-pink-500 to-pink-600 border-pink-200 bg-pink-50",
  cyan: "from-cyan-500 to-cyan-600 border-cyan-200 bg-cyan-50"
};

export default function ProjectCard({ project, tasks = [], onEdit, onDelete }) {
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const isOverdue = project.due_date && isAfter(new Date(), new Date(project.due_date));
  const isDueSoon = project.due_date && isBefore(new Date(), addDays(new Date(project.due_date), 3));

  const colorScheme = colorSchemes[project.color] || colorSchemes.blue;

  const getStatusBadge = () => {
    const statusColors = {
      planning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      active: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
      on_hold: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    return (
      <Badge className={`${statusColors[project.status]} border font-medium`}>
        {project.status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${colorScheme.split(' ')[0]} ${colorScheme.split(' ')[1]}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link 
              to={createPageUrl(`Project?id=${project.id}`)}
              className="block hover:text-blue-600 transition-colors"
            >
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {project.name}
              </h3>
            </Link>
            {project.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(project)}>
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(project)} className="text-red-600">
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-gray-900 font-semibold">{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${colorScheme.split(' ')[0]} ${colorScheme.split(' ')[1]} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{completedTasks} completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3" />
              <span>{totalTasks - completedTasks} remaining</span>
            </div>
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{project.members?.length || 0} members</span>
          </div>
          
          {project.due_date && (
            <div className={`flex items-center gap-1 ${
              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-600'
            }`}>
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {format(new Date(project.due_date), 'MMM d')}
 