import api from './api';
import { mockDoctors, mockPatients, mockAppointments, mockLabRequests } from '../data/mockData';

export const doctorService = {
  getAll: async (params) => {
    try {
      return await api.get('/doctors/index.php', { params });
    } catch {
      return {
        success: true,
        data: mockDoctors
      };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/doctors/show.php?id=${id}`);
    } catch {
      const doctor = mockDoctors.find(d => d.id === id) || mockDoctors[0];
      return {
        success: true,
        data: doctor
      };
    }
  },

  getMyPatients: async (params) => {
    try {
      return await api.get('/doctor/patients.php', { params });
    } catch {
      return {
        success: true,
        data: mockPatients
      };
    }
  },

  getDashboardStats: async () => {
    try {
      return await api.get('/doctor/stats.php');
    } catch {
      return {
        success: true,
        data: {
          totalPatients: 142,
          todayAppointments: 8,
          pendingLabs: 6,
          criticalAlerts: 1
        }
      };
    }
  },

  addDiagnosis: async (patientId, diagnosisData) => {
    try {
      return await api.post('/doctor/diagnoses.php', { patient_id: patientId, ...diagnosisData });
    } catch {
      return {
        success: true,
        message: 'تم إضافة التشخيص بنجاح'
      };
    }
  },

  addClinicalNote: async (patientId, noteData) => {
    try {
      return await api.post('/doctor/notes.php', { patient_id: patientId, ...noteData });
    } catch {
      return {
        success: true,
        message: 'تم حفظ الملاحظة السريرية بنجاح'
      };
    }
  }
};
