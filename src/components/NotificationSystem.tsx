import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'error':
        return <XCircle className="w-6 h-6" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6" />;
      case 'info':
        return <Info className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          border: 'border-green-200',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-600',
          border: 'border-red-200',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
          border: 'border-yellow-200',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
          border: 'border-blue-200',
          text: 'text-white',
          icon: 'text-white'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          border: 'border-gray-200',
          text: 'text-white',
          icon: 'text-white'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => {
          const colors = getColors(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4 
              }}
              className={`${colors.bg} ${colors.border} rounded-2xl shadow-2xl border backdrop-blur-sm overflow-hidden`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold ${colors.text}`}>
                      {notification.title}
                    </h4>
                    <p className={`text-sm ${colors.text} opacity-90 mt-1`}>
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(notification.id)}
                    className={`${colors.text} opacity-70 hover:opacity-100 transition-opacity flex-shrink-0`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Progress bar */}
              {notification.duration !== 0 && (
                <motion.div
                  className="h-1 bg-white/30"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: (notification.duration || 5000) / 1000, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;