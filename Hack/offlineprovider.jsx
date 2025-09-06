
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task } from '@/entities/Task';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};

export default function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState([]);
  const [offlineData, setOfflineData] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('synergysphere-offline');
      return stored ? JSON.parse(stored) : { tasks: [], lastSync: null };
    }
    return { tasks: [], lastSync: null };
  });

  const cacheTasksData = useCallback((tasks) => {
    setOfflineData(prev => ({
      ...prev,
      tasks,
      lastSync: new Date().toISOString()
    }));
  }, []);

  const syncPendingChanges = useCallback(async () => {
    if (!navigator.onLine || pendingSync.length === 0) {
        return;
 