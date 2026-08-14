import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

interface LiveUpdate {
  id: string;
  type: 'status_update' | 'new_report' | 'resolved' | 'department_assigned';
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

interface LiveFeedProps {
  isVisible: boolean;
}

export function LiveFeed({ isVisible }: LiveFeedProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);

  const mockUpdates: LiveUpdate[] = [
    {
      id: '1',
      type: 'status_update',
      message: 'Pothole on Wardha Road near Chhatrapati Square marked for immediate repair',
      timestamp: new Date(),
      priority: 'high'
    },
    {
      id: '2',
      type: 'department_assigned',
      message: 'NMC Sanitation team assigned to waste overflow at Sitabuldi Main Market',
      timestamp: new Date(Date.now() - 30000),
      priority: 'medium'
    },
    {
      id: '3',
      type: 'resolved',
      message: 'LED Streetlight at Amravati Road near Law College Square has been fixed',
      timestamp: new Date(Date.now() - 120000),
      priority: 'low'
    },
    {
      id: '4',
      type: 'new_report',
      message: 'New water pipeline leak reported near GMCH Medical Square (Zone 3)',
      timestamp: new Date(Date.now() - 300000),
      priority: 'high'
    }
  ];

  useEffect(() => {
    if (isVisible) {
      // Simulate real-time updates
      const interval = setInterval(() => {
        const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
        const newUpdate = {
          ...randomUpdate,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        
        setUpdates(prev => [newUpdate, ...prev.slice(0, 4)]); // Keep only 5 updates
      }, 8000); // New update every 8 seconds

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const getIcon = (type: LiveUpdate['type']) => {
    switch (type) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'status_update': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'department_assigned': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'new_report': return <Zap className="w-4 h-4 text-purple-500" />;
    }
  };

  const getBadgeColor = (type: LiveUpdate['type']) => {
    switch (type) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'status_update': return 'bg-blue-100 text-blue-800';
      case 'department_assigned': return 'bg-orange-100 text-orange-800';
      case 'new_report': return 'bg-purple-100 text-purple-800';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  if (!isVisible || updates.length === 0) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-30 max-w-sm mx-auto">
      <AnimatePresence>
        {updates.slice(0, 1).map((update) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 mb-2"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(update.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${getBadgeColor(update.type)}`}>
                    Live Update
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(update.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-tight">
                  {update.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}