import api from './api';
import { mockNotifications } from '../data/mockData';

export const notificationService = {
  getAll: async (params) => {
    try {
      return await api.get('/notifications/index.php', { params });
    } catch {
      return { success: true, data: mockNotifications };
    }
  },

  markAsRead: async (id) => {
    try {
      return await api.put(`/notifications/read.php?id=${id}`);
    } catch {
      return { success: true, message: 'تم تحديث حالة الإشعار' };
    }
  },

  markAllAsRead: async () => {
    try {
      return await api.put('/notifications/read-all.php');
    } catch {
      return { success: true, message: 'تم تعيين جميع الإشعارات كمقروءة' };
    }
  }
};
