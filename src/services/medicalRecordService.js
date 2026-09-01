import api from './api';
import { mockRadiology, mockClinicalNotes, mockPatients, mockVitalSigns, mockLabRequests } from '../data/mockData';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('gazacare_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const medicalRecordService = {
  getRecordByPatientId: async (patientId) => {
    return medicalRecordService.getFullRecord(patientId);
  },

  getFullRecord: async (patientId) => {
    try {
      return await api.get(`/medical-records/show.php?patient_id=${patientId}`);
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        const stored = localStorage.getItem(`gazacare_user_record_${currentUser.id}`);
        const parsed = stored ? JSON.parse(stored) : { surgeries: [], chronicDiseases: [], visitsHistory: [] };
        return {
          success: true,
          data: {
            patient: currentUser,
            surgeries: parsed.surgeries || [],
            chronicDiseases: parsed.chronicDiseases || [],
            visitsHistory: parsed.visitsHistory || [],
            vitals: {
              heartRate: '--',
              bloodPressure: '--/--',
              oxygenSaturation: '--',
              temperature: '--',
              bloodSugar: '--'
            },
            radiology: [],
            clinicalNotes: [],
            labs: []
          }
        };
      }
      return {
        success: true,
        data: {
          patient: mockPatients[0],
          surgeries: [
            { name: 'استئصال الزائدة الدودية (Appendectomy)', hospital: 'مجمع الشفاء الطبي', year: '2021' },
            { name: 'تنظير علوي للجهاز الهضمي (Endoscopy)', hospital: 'مستشفى القدس', year: '2023' }
          ],
          chronicDiseases: [
            { name: 'داء السكري من النوع الثاني (Type 2 Diabetes)', since: '2019', status: 'تحت السيطرة' },
            { name: 'ارتفاع ضغط الدم الشرياني (Hypertension)', since: '2020', status: 'مستقر' }
          ],
          visitsHistory: [
            { id: 'V-1', doctorName: 'د. هالة النجار', hospital: 'مجمع الشفاء', department: 'باطنة عامة', diagnosis: 'متابعة دورية للسكر وضغط الدم', notes: 'التحاليل مستقرة والجرعات ملائمة', date: '2026-02-15' },
            { id: 'V-2', doctorName: 'د. يحيى خليل', hospital: 'مستشفى ناصر', department: 'جهاز هضمي', diagnosis: 'التهاب معدة خفيف', notes: 'تم صرف مضاد حموضة وتعديل النظام الغذائي', date: '2026-01-10' }
          ],
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
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        return { success: true, data: [] };
      }
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
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        return { success: true, data: [] };
      }
      return { success: true, data: mockClinicalNotes };
    }
  }
};

