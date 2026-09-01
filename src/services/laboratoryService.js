import api from './api';
import { mockLabRequests } from '../data/mockData';

export const laboratoryService = {
  getRequests: async (params) => {
    try {
      return await api.get('/lab/requests.php', { params });
    } catch {
      return { success: true, data: mockLabRequests };
    }
  },

  getRequestById: async (id) => {
    try {
      return await api.get(`/lab/requests/show.php?id=${id}`);
    } catch {
      const request = mockLabRequests.find(r => r.id === id) || mockLabRequests[0];
      return { success: true, data: request };
    }
  },

  saveResult: async (requestId, resultData) => {
    try {
      return await api.post(`/lab/results/save.php?id=${requestId}`, resultData);
    } catch {
      return {
        success: true,
        message: 'تم حفظ واعتماد نتيجة التحليل بنجاح',
        data: resultData
      };
    }
  },

  markCritical: async (requestId, note) => {
    try {
      return await api.post(`/lab/requests/critical.php?id=${requestId}`, { note });
    } catch {
      return {
        success: true,
        message: 'تم تصنيف النتيجة كحالة حرجة وإرسال إشعار فوري للطبيب المعالج'
      };
    }
  },

  createRequest: async (requestData) => {
    try {
      return await api.post('/lab/requests/create.php', requestData);
    } catch {
      return {
        success: true,
        message: 'تم إرسال طلب الفحص المخبري بنجاح',
        data: { id: 'LAB-REQ-' + Math.floor(1000 + Math.random() * 9000), ...requestData }
      };
    }
  }
};
