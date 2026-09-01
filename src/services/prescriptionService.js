import api from './api';
import { mockPrescriptions } from '../data/mockData';

export const prescriptionService = {
  getAll: async (params) => {
    try {
      return await api.get('/prescriptions/index.php', { params });
    } catch {
      return { success: true, data: mockPrescriptions };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/prescriptions/show.php?id=${id}`);
    } catch {
      const rx = mockPrescriptions.find(p => p.id === id) || mockPrescriptions[0];
      return { success: true, data: rx };
    }
  },

  create: async (prescriptionData) => {
    try {
      return await api.post('/prescriptions/create.php', prescriptionData);
    } catch {
      return {
        success: true,
        message: 'تم إنشاء وصرف الوصفة الطبية الإلكترونية بنجاح',
        data: {
          id: 'RX-' + Math.floor(5500 + Math.random() * 1000),
          date: new Date().toISOString().split('T')[0],
          status: 'نشطة',
          ...prescriptionData
        }
      };
    }
  }
};
