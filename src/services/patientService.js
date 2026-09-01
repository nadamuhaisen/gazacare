import api from './api';
import { mockPatients, mockVitalSigns, mockPrescriptions, mockMedicalTimeline, mockUsers } from '../data/mockData';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('gazacare_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

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

  getProfile: async () => {
    return patientService.getMyProfile();
  },

  getMyProfile: async () => {
    try {
      return await api.get('/patient/profile.php');
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        // Return fresh clean profile for the newly registered user
        const storedProfile = localStorage.getItem(`gazacare_user_profile_${currentUser.id}`);
        if (storedProfile) {
          return { success: true, data: JSON.parse(storedProfile) };
        }
        const freshProfile = {
          id: currentUser.id,
          name: currentUser.fullName || currentUser.name,
          fullName: currentUser.fullName || currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || 'لم يُحدد',
          nationalId: currentUser.nationalId || 'لم يُحدد',
          mrn: currentUser.mrn || ('P-' + Math.floor(10000 + Math.random() * 90000)),
          age: currentUser.age || 'غير محدد',
          dateOfBirth: currentUser.dateOfBirth || 'غير محدد',
          bloodType: currentUser.bloodType || 'غير محدد',
          address: currentUser.address || 'قطاع غزة - فلسطين',
          gender: currentUser.gender || 'غير محدد',
          avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          chronicConditions: [],
          allergies: [],
          emergencyContact: {
            name: 'لم يُحدد بعد',
            phone: '---',
            relation: '---'
          },
          vitalSigns: {
            heartRate: '--',
            bloodPressure: '--/--',
            oxygenSaturation: '--',
            temperature: '--',
            bloodSugar: '--',
            respiratoryRate: '--'
          }
        };
        return { success: true, data: freshProfile };
      }
      return {
        success: true,
        data: mockUsers.patient
      };
    }
  },

  getMedications: async (patientId) => {
    try {
      return await api.get(`/patient/medications.php?patient_id=${patientId || ''}`);
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        const stored = localStorage.getItem(`gazacare_user_medications_${currentUser.id}`);
        return { success: true, data: stored ? JSON.parse(stored) : [] };
      }
      // Demo user active medications
      return {
        success: true,
        data: [
          {
            id: 'MED-101',
            name: 'ميتفورمين (Metformin HCl)',
            dosage: '500 mg',
            frequency: 'مرتين يومياً (بعد الطعام)',
            duration: 'علاج مستمر',
            prescribedBy: 'د. هالة النجار',
            status: 'active',
            instructions: 'يتم تناوله صباحاً ومساءً بانتظام.'
          },
          {
            id: 'MED-102',
            name: 'أملوديبين (Amlodipine Besylate)',
            dosage: '5 mg',
            frequency: 'مرة واحدة يومياً (صباحاً)',
            duration: 'علاج مستمر',
            prescribedBy: 'د. هالة النجار',
            status: 'active',
            instructions: 'لضبط ضغط الدم.'
          },
          {
            id: 'MED-103',
            name: 'أتورفاستاتين (Atorvastatin)',
            dosage: '20 mg',
            frequency: 'مرة واحدة يومياً (مساءً قبل النوم)',
            duration: '3 أشهر',
            prescribedBy: 'د. هالة النجار',
            status: 'active',
            instructions: 'لضبط الدهون والكوليسترول.'
          }
        ]
      };
    }
  },

  getVitalSigns: async (patientId) => {
    try {
      return await api.get(`/patient/vitals.php?patient_id=${patientId || ''}`);
    } catch {
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        return {
          success: true,
          data: {
            heartRate: '--',
            bloodPressure: '--/--',
            oxygenSaturation: '--',
            temperature: '--',
            bloodSugar: '--',
            respiratoryRate: '--',
            recordedAt: 'لم تسجل قراءات بعد'
          }
        };
      }
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
      const currentUser = getCurrentUser();
      if (currentUser?.isNewUser) {
        return { success: true, data: [] };
      }
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
      const currentUser = getCurrentUser();
      if (currentUser) {
        localStorage.setItem(`gazacare_user_profile_${currentUser.id}`, JSON.stringify(data));
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem('gazacare_user', JSON.stringify(updatedUser));
      }
      return {
        success: true,
        message: 'تم حفظ وتحديث الملف بنجاح',
        data
      };
    }
  }
};

