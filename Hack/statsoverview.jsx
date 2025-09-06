import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Users,
  TrendingUp,
  Target
} from "lucide-react";

export default function StatsOverview({ projects, tasks, user }) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const myTasks = tasks.filter(t => t.assigned_to === user?.email).length;
  const overdueTasks = tasks.filter(t => 
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
  ).length;

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects,
      total: totalProjects,
      icon: FolderKanban,
      color: "blue",
      trend: "+12%"
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      total: tasks.length,
      icon: CheckCircle2,
      color: "green",
      trend: "+8%"
    },
    {
      title: "My Tasks",
      value: myTasks,
      total: tasks.length,
      icon: Target,
      color: "purple",
      trend: "5 active"
    },
    {
      title: "Team Members",
      value: new Set(projects.flatMap(p => p.members || [])).size,
      total: null,
      icon: Users,
      color: "orange",
      trend: "+2 this week"
    }
  ];

  const colorSchemes = {
    blue: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
    green: "from-green-500 to-green-600 text-green-600 bg-green-50",
    purple: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50",
    orange: "from-orange-500 to-orange-600 text-orange-600 bg-orange-50"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const colorScheme = colorSchemes[stat.color];
        const percentage = stat.total ? Math.round((stat.value / stat.total) * 100) : null;
        
        return (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-r ${colorScheme.split('text-')[0]} rounded-full opacity-10`} />
            
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                {stat.title}
                <div className={`p-2 rounded-lg ${colorScheme.split('from-')[1].split(' ')[0] === 'blue-500' ? 'bg-blue-50' : colorScheme.split('from-')[1].split(' ')[0] === 'green-500' ? 'bg-green-50' : colorScheme.split('from-')[1].split(' ')[0] === 'purple-500' ? 'bg-purple-50' : 'bg-orange-50'}`}>
                  <stat.icon className={`w-4 h-4 ${colorScheme.split('bg-')[0].trim()}`} />
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  {stat.total && (
                    <span className="text-sm text-gray-500">
                      of {stat.total}
                    </span>
                  )}
                </div>
                
                {percentage && (
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`bg-gradient-to-r ${colorScheme.split('text-')[0].trim()} h-1 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className={`w-3 h-3 ${colorScheme.split('bg-')[0].trim()}`} />
                  <span className={`font-medium ${colorScheme.split('bg-')[0].trim()}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}