import api from './api';
import { mockUsers } from '../data/mockData';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login.php', credentials);
      return response;
    } catch {
      // Fallback for standalone frontend development
      const email = credentials.email?.toLowerCase().trim() || '';
      let user = mockUsers.doctor;

      if (
        email.includes('patient') ||
        email.includes('مريض') ||
        email.includes('مراجع') ||
        email.includes('p-10492') ||
        email.includes('401928374') ||
        credentials.role === 'PATIENT'
      ) {
        user = mockUsers.patient;
      } else if (
        email.includes('manager') ||
        email.includes('admin') ||
        email.includes('مدير') ||
        email.includes('مستشفى') ||
        credentials.role === 'HOSPITAL_MANAGER'
      ) {
        user = mockUsers.hospitalManager;
      } else if (
        email.includes('lab') ||
        email.includes('مختبر') ||
        email.includes('تحاليل') ||
        credentials.role === 'LAB_ANALYST'
      ) {
        user = mockUsers.labAnalyst;
      } else if (
        email.includes('doctor') ||
        email.includes('طبيب') ||
        email.includes('دكتور') ||
        credentials.role === 'DOCTOR'
      ) {
        user = mockUsers.doctor;
      }

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
