import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, Clock, AlertCircle } from 'lucide-react';
import { useOffline } from './OfflineProvider';

export default function OfflineIndicator({ className }) {
  const { isOnline, pendingSync } = useOffline();

  if (isOnline && pendingSync === 0) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      {!isOnline ? (
        <Badge className="bg-red-100 text-red-800 border-red-200 shadow-lg backdrop-blur-sm flex items-center gap-2 px-3 py-2">
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">Offline Mode</span>
        </Badge>
      ) : pendingSync > 0 ? (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 shadow-lg backdrop-blur-sm flex items-center gap-2 px-3 py-2">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="font-medium">Syncing {pendingSync} changes...</span>
        </Badge>
      ) : null}
    </div>
  );
}