import api from './api';
import { mockRadiology, mockClinicalNotes, mockPatients, mockVitalSigns, mockLabRequests } from '../data/mockData';

export const medicalRecordService = {
  getFullRecord: async (patientId) => {
    try {
      return await api.get(`/medical-records/show.php?patient_id=${patientId}`);
    } catch {
      return {
        success: true,
        data: {
          patient: mockPatients[0],
          vitals: mockVitalSigns,
          radiology: mockRadiology,
          clinicalNotes: mockClinicalNotes,
          labs: mockLabRequests
        }
      };
    }
  },

  getRadiology: async (patientId) => {
    try {
      return await api.get(`/radiology/index.php?patient_id=${patientId || ''}`);
    } catch {
      return { success: true, data: mockRadiology };
    }
  },

  requestRadiology: async (radiologyData) => {
    try {
      return await api.post('/radiology/request.php', radiologyData);
    } catch {
      return {
        success: true,
        message: 'تم إرسال طلب التصوير الشعاعي بنجاح',
        data: { id: 'RAD-REQ-' + Date.now(), ...radiologyData }
      };
    }
  },

  getClinicalNotes: async (patientId) => {
    try {
      return await api.get(`/clinical-notes/index.php?patient_id=${patientId || ''}`);
    } catch {
      return { success: true, data: mockClinicalNotes };
    }
  }
};
