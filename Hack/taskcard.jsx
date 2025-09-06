
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar,
  Flag,
  MessageSquare,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200"
};

const priorityIcons = {
  low: null,
  medium: Flag,
  high: Flag,
  urgent: AlertTriangle
};

export default function TaskCard({ task, onClick, isDragging }) {
  const isOverdue = task.due_date && isAfter(new Date(), new Date(task.due_date));
  const isDueSoon = task.due_date && isBefore(new Date(), addDays(new Date(task.due_date), 2));
  const PriorityIcon = priorityIcons[task.priority];

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white dark:bg-gray-800 ${
        isDragging ? 'shadow-2xl ring-2 ring-blue-400' : 'shadow-sm hover:shadow-md'
      } ${task._pendingSync ? 'ring-2 ring-orange-400 bg-orange-50 dark:bg-orange-900/20' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Pending sync indicator */}
        {task._pendingSync && (
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs">
            <Clock className="w-3 h-3" />
            <span>Pending sync</span>
          </div>
        )}

        {/* Task Header */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {task.title}
          </h4>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Task Metadata */}
        <div className="flex flex-wrap gap-2">
          {/* Priority */}
          <Badge className={`${priorityColors[task.priority]} border text-xs font-medium`}>
            {PriorityIcon && <PriorityIcon className="w-3 h-3 mr-1" />}
            {task.priority}
          </Badge>

          {/* Tags */}
          {task.tags && task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Task Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {/* Assignee */}
            {task.assigned_to && (
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                  {task.assigned_to.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Comments indicator */}
            <div className="flex items-center gap-1 text-gray-400">
              <MessageSquare className="w-3 h-3" />
              <span>0</span>
            </div>
          </div>

          {/* Due Date */}
          {task.due_date && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              isOverdue 
                ? 'text-red-600' 
                : isDueSoon 
                  ? 'text-orange-600' 
                  : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(task.due_date), 'MMM d')}</span>
              {isOverdue && <Clock className="w-3 h-3" />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
