import api from './api';
import { mockAppointments } from '../data/mockData';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('gazacare_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getUserAppointments = (userId) => {
  try {
    const raw = localStorage.getItem(`gazacare_user_appointments_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUserAppointments = (userId, appointments) => {
  try {
    localStorage.setItem(`gazacare_user_appointments_${userId}`, JSON.stringify(appointments));
  } catch (e) {
    console.error('Error saving user appointments', e);
  }
};

export const appointmentService = {
  getAppointments: async (params) => {
    return appointmentService.getAll(params);
  },

  getAll: async (params) => {
    try {
      return await api.get('/appointments/index.php', { params });
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        const list = getUserAppointments(currentUser.id);
        return { success: true, data: list };
      }
      return { success: true, data: mockAppointments };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/appointments/show.php?id=${id}`);
    } catch {
      const currentUser = getCurrentUser();
      const list = currentUser?.isNewUser ? getUserAppointments(currentUser.id) : mockAppointments;
      const apt = list.find(a => a.id === id) || list[0] || null;
      return { success: true, data: apt };
    }
  },

  createAppointment: async (appointmentData) => {
    return appointmentService.create(appointmentData);
  },

  create: async (appointmentData) => {
    try {
      return await api.post('/appointments/create.php', appointmentData);
    } catch {
      const currentUser = getCurrentUser();
      const newAppointment = {
        id: 'APT-' + Math.floor(8000 + Math.random() * 1000),
        status: 'confirmed',
        patientName: currentUser?.fullName || currentUser?.name || appointmentData.patientName || 'المريض',
        patientMrn: currentUser?.mrn || appointmentData.patientMrn || 'P-10492',
        ...appointmentData
      };

      if (currentUser?.isNewUser) {
        const existing = getUserAppointments(currentUser.id);
        const updated = [newAppointment, ...existing];
        saveUserAppointments(currentUser.id, updated);
      }

      return {
        success: true,
        message: 'تم حجز الموعد بنجاح وهو قيد التأكيد',
        data: newAppointment
      };
    }
  },

  updateStatus: async (id, status, notes = '') => {
    try {
      return await api.put(`/appointments/status.php?id=${id}`, { status, notes });
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        const existing = getUserAppointments(currentUser.id);
        const updated = existing.map(a => a.id === id ? { ...a, status, notes } : a);
        saveUserAppointments(currentUser.id, updated);
      }
      return {
        success: true,
        message: `تم تحديث حالة الموعد إلى (${status}) بنجاح`
      };
    }
  },

  cancel: async (id, reason = '') => {
    try {
      return await api.post(`/appointments/cancel.php?id=${id}`, { reason });
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        const existing = getUserAppointments(currentUser.id);
        const updated = existing.filter(a => a.id !== id);
        saveUserAppointments(currentUser.id, updated);
      }
      return {
        success: true,
        message: 'تم إلغاء الموعد بنجاح'
      };
    }
  }
};

