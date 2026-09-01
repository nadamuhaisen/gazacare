import React, { createContext, useContext, useState } from 'react';
import { mockNotifications as initialNotifications } from '../data/mockData';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = (role) => {
    setNotifications(prev =>
      prev.map(n => (role ? (n.targetRole === role ? { ...n, read: true } : n) : { ...n, read: true }))
    );
  };

  const addNotification = (notif) => {
    const newNotification = {
      id: 'NOTIF-' + Date.now(),
      date: 'الآن',
      timestamp: new Date().toISOString(),
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotification, ...prev]);
    addToast({
      title: notif.title,
      message: notif.message,
      type: notif.type === 'critical' ? 'error' : notif.type === 'lab' || notif.type === 'appointment' ? 'success' : 'info'
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        addToast,
        removeToast,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [],
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      addNotification: () => {}
    };
  }
  return context;
};
