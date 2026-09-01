import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PwaProvider } from './context/PwaContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppRoutes } from './AppRoutes';
import { ToastContainer } from './components/common/NotificationCenter';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PwaProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppRoutes />
              <ToastContainer />
            </AuthProvider>
          </NotificationProvider>
        </PwaProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
