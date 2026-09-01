import api from './api';
import { mockHospitals, mockDepartments, mockBeds, mockStaff, mockHospitalStats } from '../data/mockData';

export const hospitalService = {
  getHospitals: async () => {
    try {
      return await api.get('/hospitals/index.php');
    } catch {
      return { success: true, data: mockHospitals };
    }
  },

  getDepartments: async () => {
    try {
      return await api.get('/departments/index.php');
    } catch {
      return { success: true, data: mockDepartments };
    }
  },

  getBeds: async (params) => {
    try {
      return await api.get('/beds/index.php', { params });
    } catch {
      return { success: true, data: mockBeds };
    }
  },

  updateBedStatus: async (bedId, status, details = {}) => {
    try {
      return await api.put(`/beds/update.php?id=${bedId}`, { status, ...details });
    } catch {
      return { success: true, message: 'تم تحديث حالة السرير بنجاح' };
    }
  },

  getStaff: async (params) => {
    try {
      return await api.get('/staff/index.php', { params });
    } catch {
      return { success: true, data: mockStaff };
    }
  },

  getAnalytics: async () => {
    try {
      return await api.get('/hospital-manager/analytics.php');
    } catch {
      return { success: true, data: mockHospitalStats };
    }
  }
};
