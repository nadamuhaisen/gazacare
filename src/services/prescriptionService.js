import api from './api';
import { mockPrescriptions } from '../data/mockData';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('gazacare_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getUserPrescriptions = (userId) => {
  try {
    const raw = localStorage.getItem(`gazacare_user_prescriptions_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUserPrescriptions = (userId, prescriptions) => {
  try {
    localStorage.setItem(`gazacare_user_prescriptions_${userId}`, JSON.stringify(prescriptions));
  } catch (e) {
    console.error('Error saving user prescriptions', e);
  }
};

export const prescriptionService = {
  getPrescriptions: async (params) => {
    return prescriptionService.getAll(params);
  },

  getAll: async (params) => {
    try {
      return await api.get('/prescriptions/index.php', { params });
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        return { success: true, data: getUserPrescriptions(currentUser.id) };
      }
      return { success: true, data: mockPrescriptions };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/prescriptions/show.php?id=${id}`);
    } catch {
      const currentUser = getCurrentUser();
      const list = currentUser?.isNewUser ? getUserPrescriptions(currentUser.id) : mockPrescriptions;
      const rx = list.find(p => p.id === id) || list[0] || null;
      return { success: true, data: rx };
    }
  },

  create: async (prescriptionData) => {
    try {
      return await api.post('/prescriptions/create.php', prescriptionData);
    } catch {
      const currentUser = getCurrentUser();
      const newRx = {
        id: 'RX-' + Math.floor(5500 + Math.random() * 1000),
        prescriptionNumber: 'RX-2026-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split('T')[0],
        status: 'active',
        patientName: prescriptionData.patientName || currentUser?.fullName || currentUser?.name || 'المريض',
        patientMrn: prescriptionData.patientMrn || currentUser?.mrn || 'P-10492',
        ...prescriptionData
      };

      if (currentUser?.isNewUser) {
        const existing = getUserPrescriptions(currentUser.id);
        const updated = [newRx, ...existing];
        saveUserPrescriptions(currentUser.id, updated);
      }

      return {
        success: true,
        message: 'تم إنشاء وصرف الوصفة الطبية الإلكترونية بنجاح',
        data: newRx
      };
    }
  }
};

