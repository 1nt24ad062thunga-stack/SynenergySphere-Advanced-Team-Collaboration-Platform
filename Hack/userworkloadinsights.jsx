
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '@/entities/Task';
import { Project } from '@/entities/Project';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';
import { addDays, isBefore, isAfter } from 'date-fns';

export default function UserWorkloadInsights({ userId, projectId, className }) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkloadInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tasks, projects] = await Promise.all([
        Task.list(),
        Project.list()
      ]);

      let targetUsers = [];
      
      if (userId) {
        // Single user insights
 