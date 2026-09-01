import api from './api';
import { mockUsers } from '../data/mockData';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login.php', credentials);
      return response;
    } catch {
      // Fallback for standalone frontend development
      const email = credentials.email?.toLowerCase() || '';
      let user = mockUsers.doctor;
      if (email.includes('patient')) user = mockUsers.patient;
      else if (email.includes('manager')) user = mockUsers.hospitalManager;
      else if (email.includes('lab')) user = mockUsers.labAnalyst;

      return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: {
          user,
          token: 'token_' + Date.now()
        }
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register.php', userData);
      return response;
    } catch {
      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        data: {
          user: {
            id: 'usr_' + Date.now(),
            ...userData
          },
          token: 'token_' + Date.now()
        }
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      return await api.post('/auth/forgot-password.php', { email });
    } catch {
      return {
        success: true,
        message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني'
      };
    }
  },

  getProfile: async () => {
    try {
      return await api.get('/auth/me.php');
    } catch {
      return {
        success: true,
        data: mockUsers.patient
      };
    }
  }
};
