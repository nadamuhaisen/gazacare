import api from './api';
import { mockUsers } from '../data/mockData';

// Helper to get registered users from localStorage
const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem('gazacare_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUser = (user) => {
  try {
    const existing = getRegisteredUsers();
    const updated = [user, ...existing.filter(u => u.email !== user.email)];
    localStorage.setItem('gazacare_registered_users', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving registered user', e);
  }
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login.php', credentials);
      return response;
    } catch {
      // Check if there is a registered user with this email
      const email = credentials.email?.toLowerCase().trim() || '';
      const registeredUsers = getRegisteredUsers();
      const matchedUser = registeredUsers.find(u => u.email?.toLowerCase().trim() === email);

      if (matchedUser) {
        return {
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          data: {
            user: matchedUser,
            token: 'token_' + Date.now()
          }
        };
      }

      // If it's a demo account request
      let user = mockUsers.doctor;

      if (
        email === 'patient@gazacare.ps' ||
        email.includes('p-10492') ||
        email.includes('401928374') ||
        (credentials.role === 'PATIENT' && email.includes('patient'))
      ) {
        user = mockUsers.patient;
      } else if (
        email === 'manager@gazacare.ps' ||
        (credentials.role === 'HOSPITAL_MANAGER' && email.includes('manager'))
      ) {
        user = mockUsers.hospitalManager;
      } else if (
        email === 'lab@gazacare.ps' ||
        (credentials.role === 'LAB_ANALYST' && email.includes('lab'))
      ) {
        user = mockUsers.labAnalyst;
      } else if (
        email === 'doctor@gazacare.ps' ||
        (credentials.role === 'DOCTOR' && email.includes('doctor'))
      ) {
        user = mockUsers.doctor;
      } else {
        // Any other non-demo email entered -> create a clean user
        user = {
          id: 'usr_' + Date.now(),
          name: email.split('@')[0] || 'مستخدم جديد',
          fullName: email.split('@')[0] || 'مستخدم جديد',
          email,
          phone: '',
          nationalId: '40' + Math.floor(1000000 + Math.random() * 9000000),
          role: credentials.role || 'PATIENT',
          mrn: 'P-' + Math.floor(10000 + Math.random() * 90000),
          isNewUser: true,
          createdAt: new Date().toISOString()
        };
        saveRegisteredUser(user);
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
      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.fullName || userData.name || 'مستخدم جديد',
        fullName: userData.fullName || userData.name || 'مستخدم جديد',
        email: userData.email,
        phone: userData.phone || '',
        nationalId: userData.nationalId || ('40' + Math.floor(1000000 + Math.random() * 9000000)),
        role: userData.role || 'PATIENT',
        mrn: 'P-' + Math.floor(10000 + Math.random() * 90000),
        address: 'قطاع غزة - فلسطين',
        bloodType: 'غير محدد',
        chronicConditions: [],
        allergies: [],
        isNewUser: true,
        createdAt: new Date().toISOString()
      };

      saveRegisteredUser(newUser);

      // Initialize empty storage for this new user
      try {
        localStorage.setItem(`gazacare_user_appointments_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`gazacare_user_medications_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`gazacare_user_prescriptions_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`gazacare_user_labs_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`gazacare_user_record_${newUser.id}`, JSON.stringify({
          surgeries: [],
          chronicDiseases: [],
          visitsHistory: []
        }));
      } catch (err) {
        console.error('Error initializing user storage', err);
      }

      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        data: {
          user: newUser,
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
      const activeUser = JSON.parse(localStorage.getItem('gazacare_user') || 'null');
      return {
        success: true,
        data: activeUser || mockUsers.patient
      };
    }
  }
};

