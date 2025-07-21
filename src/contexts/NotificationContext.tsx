import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification } from '../components/NotificationSystem';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (title: string, message: string) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  };

  const showError = (title: string, message: string) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: 6000
    });
  };

  const showWarning = (title: string, message: string) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  };

  const showInfo = (title: string, message: string) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};