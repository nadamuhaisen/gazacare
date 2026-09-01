import React, { createContext, useContext, useState, useEffect } from 'react';

const PwaContext = createContext();

export const PwaProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  return (
    <PwaContext.Provider value={{ isOnline, isSyncing, lastSyncTime, triggerSync }}>
      {children}
    </PwaContext.Provider>
  );
};

export const usePwa = () => {
  const context = useContext(PwaContext);
  if (!context) {
    return {
      isOnline: true,
      isSyncing: false,
      lastSyncTime: '',
      triggerSync: () => {}
    };
  }
  return context;
};
