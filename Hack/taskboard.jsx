
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  Calendar,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Clock // Added Clock icon import for offline banner
} from "lucide-react";
import { format, isAfter } from "date-fns";
import TaskCard from "./TaskCard";
import { useOffline } from '../OfflineProvider'; // Added useOffline import

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-50' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'done', title: 'Done', color: 'bg-green-50' }
];

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200"
};

export default function TaskBoard({ tasks = [], onTaskUpdate, onNewTask, onTaskClick }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const { isOnline, updateTaskOffline, getOfflineTasks } = useOffline(); // Initialize useOffline hook

  // Use offline tasks if available and offline, otherwise use the provided tasks prop
  const displayTasks = getOfflineTasks() || tasks;

  const handleDragStart = (result) => {
    const task = displayTasks.find(t => t.id === result.draggableId); // Use displayTasks here
    setDraggedTask(task);
  };

  const handleDragEnd = async (result) => {
    setDraggedTask(null);
    
    if (!result.destination) return;
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    const task = displayTasks.find(t => t.id === taskId); // Use displayTasks here
    if (task && task.status !== newStatus) {
      const updates = { status: newStatus };
      
      if (isOnline) {
        await onTaskUpdate(taskId, updates);
      } else {
        updateTaskOffline(taskId, updates);
      }
    }
  };

  // This function is no longer strictly needed as displayTasks.filter is used directly below.
  // Keeping it for potential future use or if the logic needs to be centralized again.
  // const getTasksByStatus = (status) => {
  //   return displayTasks.filter(task => task.status === status);
  // };

  return (
    <div className="h-full flex flex-col">
      {!isOnline && (
        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Offline Mode - Changes will sync when you reconnect</span>
          </div>
        </div>
      )}
      
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
          {columns.map((column) => {
            const columnTasks = displayTasks.filter(task => task.status === column.id); // Filter displayTasks
            
            return (
              <div key={column.id} className="flex flex-col min-h-0">
                <Card className="flex-1 flex flex-col border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader className={`${column.color} dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600 pb-4`}>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {column.title}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {columnTasks.length}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNewTask?.(column.id)}
                        className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-4">
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
 