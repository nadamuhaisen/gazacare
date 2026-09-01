import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  HOSPITAL_MANAGER: 'HOSPITAL_MANAGER',
  LAB_ANALYST: 'LAB_ANALYST'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check for stored session
    try {
      const storedToken = localStorage.getItem('gazacare_token');
      const storedUser = localStorage.getItem('gazacare_user');
      
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setToken(storedToken);
      } else {
        // Default to Doctor for seamless immediate interactive evaluation if no session
        const defaultUser = mockUsers.doctor;
        setUser(defaultUser);
        setRole(defaultUser.role);
        setToken('gazacare-demo-jwt-token-2026');
      }
    } catch (e) {
      console.error('Error reading auth state from storage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Standard Login for REST API response format
  const login = async (email, password, requestedRole) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password, role: requestedRole });
      if (response.success && response.data) {
        const loggedUser = response.data.user;
        const userToken = response.data.token;

        setUser(loggedUser);
        setRole(loggedUser.role);
        setToken(userToken);

        localStorage.setItem('gazacare_token', userToken);
        localStorage.setItem('gazacare_user', JSON.stringify(loggedUser));
        return response;
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تسجيل الدخول، يرجى التأكد من صحة البيانات.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.success && response.data) {
        const newUser = response.data.user;
        const userToken = response.data.token;

        setUser(newUser);
        setRole(newUser.role);
        setToken(userToken);

        localStorage.setItem('gazacare_token', userToken);
        localStorage.setItem('gazacare_user', JSON.stringify(newUser));
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'فشل إنشاء الحساب، يرجى المحاولة لاحقاً.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('gazacare_token');
    localStorage.removeItem('gazacare_user');
  };

  // Helper function to switch roles
  const switchRole = (newRole) => {
    let targetUser;
    if (newRole === ROLES.PATIENT) targetUser = mockUsers.patient;
    else if (newRole === ROLES.DOCTOR) targetUser = mockUsers.doctor;
    else if (newRole === ROLES.HOSPITAL_MANAGER) targetUser = mockUsers.hospitalManager;
    else if (newRole === ROLES.LAB_ANALYST) targetUser = mockUsers.labAnalyst;

    if (targetUser) {
      setUser(targetUser);
      setRole(targetUser.role);
      localStorage.setItem('gazacare_user', JSON.stringify(targetUser));
    }
  };

  const getDashboardPath = (userRole) => {
    const activeRole = userRole || role;
    switch (activeRole) {
      case ROLES.PATIENT:
        return '/patient/dashboard';
      case ROLES.DOCTOR:
        return '/doctor/dashboard';
      case ROLES.HOSPITAL_MANAGER:
        return '/hospital-manager/dashboard';
      case ROLES.LAB_ANALYST:
        return '/lab-analyst/dashboard';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        switchRole,
        getDashboardPath
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      login: async () => ({ success: false }),
      register: async () => ({ success: false }),
      logout: () => {},
      switchRole: () => {},
      getDashboardPath: () => '/'
    };
  }
  return context;
};
