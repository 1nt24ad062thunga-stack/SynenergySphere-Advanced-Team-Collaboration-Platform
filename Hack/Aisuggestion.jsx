
import React, { useState, useEffect, useCallback } from 'react';
import { InvokeLLM } from '@/integrations/Core';
import { Task } from '@/entities/Task';
import { Project } from '@/entities/Project';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  Users, 
  Calendar,
  ArrowRight,
  RefreshCw, // Changed from Refresh
  CheckCircle,
  Clock
} from 'lucide-react';

export default function AISuggestions({ projectId, className }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const generateSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tasks, project, currentUser] = await Promise.all([ // Renamed 'projects' to 'project'
        Task.filter({ project_id: projectId }),
        Project.list().then(projects => projects.find(p => p.id === projectId)),
        User.me()
      ]);

 