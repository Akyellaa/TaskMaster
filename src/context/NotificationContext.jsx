import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/notificationService';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleTokenInvalidation, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await getNotifications();
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      if (err.message?.toLowerCase().includes('token') || err.response?.status === 401) {
        handleTokenInvalidation();
      }
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      toast({
        title: 'Success',
        description: 'Notification marked as read',
      });
    } catch (err) {
      if (err.message?.toLowerCase().includes('token') || err.response?.status === 401) {
        handleTokenInvalidation();
      }
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Set up polling every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    } else {
      // Clear data when not authenticated
      setNotifications([]);
      setIsLoading(false);
      setError(null);
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    isLoading,
    error,
    markAsRead,
    refreshNotifications: fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 