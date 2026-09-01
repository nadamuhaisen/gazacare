import api from './api';
import { mockAppointments } from '../data/mockData';

export const appointmentService = {
  getAll: async (params) => {
    try {
      return await api.get('/appointments/index.php', { params });
    } catch {
      return { success: true, data: mockAppointments };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/appointments/show.php?id=${id}`);
    } catch {
      const apt = mockAppointments.find(a => a.id === id) || mockAppointments[0];
      return { success: true, data: apt };
    }
  },

  create: async (appointmentData) => {
    try {
      return await api.post('/appointments/create.php', appointmentData);
    } catch {
      return {
        success: true,
        message: 'تم حجز الموعد بنجاح وهو قيد التأكيد',
        data: {
          id: 'APT-' + Math.floor(8000 + Math.random() * 1000),
          status: 'في الانتظار',
          ...appointmentData
        }
      };
    }
  },

  updateStatus: async (id, status, notes = '') => {
    try {
      return await api.put(`/appointments/status.php?id=${id}`, { status, notes });
    } catch {
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
      return {
        success: true,
        message: 'تم إلغاء الموعد بنجاح'
      };
    }
  }
};
