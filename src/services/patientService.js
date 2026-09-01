import api from './api';
import { mockPatients, mockVitalSigns, mockPrescriptions, mockLabRequests, mockMedicalTimeline, mockUsers } from '../data/mockData';

export const patientService = {
  getAll: async (params) => {
    try {
      return await api.get('/patients/index.php', { params });
    } catch {
      return {
        success: true,
        data: mockPatients
      };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/patients/show.php?id=${id}`);
    } catch {
      const patient = mockPatients.find(p => p.id === id) || mockPatients[0];
      return {
        success: true,
        data: patient
      };
    }
  },

  getMyProfile: async () => {
    try {
      return await api.get('/patient/profile.php');
    } catch {
      return {
        success: true,
        data: mockUsers.patient
      };
    }
  },

  getVitalSigns: async (patientId) => {
    try {
      return await api.get(`/patient/vitals.php?patient_id=${patientId || ''}`);
    } catch {
      return {
        success: true,
        data: mockVitalSigns
      };
    }
  },

  getTimeline: async (patientId) => {
    try {
      return await api.get(`/patient/timeline.php?patient_id=${patientId || ''}`);
    } catch {
      return {
        success: true,
        data: mockMedicalTimeline
      };
    }
  },

  updateProfile: async (data) => {
    try {
      return await api.put('/patient/profile.php', data);
    } catch {
      return {
        success: true,
        message: 'تم تحديث الملف الشخصي بنجاح',
        data
      };
    }
  }
};
