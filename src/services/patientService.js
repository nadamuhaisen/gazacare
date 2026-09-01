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

const getRegisteredPatients = () => {
  try {
    const raw = localStorage.getItem('gazacare_registered_users');
    const users = raw ? JSON.parse(raw) : [];
    return users.filter(u => u.role === 'PATIENT');
  } catch {
    return [];
  }
};

const getZeroedVitals = () => ({
  current: {
    heartRate: { value: '--', unit: "نبضة/دقيقة", status: "unset", label: "معدل نبضات القلب" },
    bloodPressure: { systolic: '--', diastolic: '--', unit: "ملم زئبق", status: "unset", label: "ضغط الدم الشرياني" },
    temperature: { value: '--', unit: "°C", status: "unset", label: "درجة حرارة الجسم" },
    spO2: { value: '--', unit: "%", status: "unset", label: "تشبع الأكسجين في الدم" },
    respiratoryRate: { value: '--', unit: "تنفس/دقيقة", status: "unset", label: "معدل التنفس" },
    weight: { value: '--', unit: "كغم", status: "unset", label: "الوزن", bmi: '--' }
  },
  history: []
});

export const patientService = {
  getAll: async (params) => {
    try {
      return await api.get('/patients/index.php', { params });
    } catch {
      const regPatients = getRegisteredPatients().map(p => {
        const storedProfile = localStorage.getItem(`gazacare_user_profile_${p.id}`);
        const profile = storedProfile ? JSON.parse(storedProfile) : {};
        const storedVitals = localStorage.getItem(`gazacare_user_vitals_${p.id}`);
        const vitals = storedVitals ? JSON.parse(storedVitals) : getZeroedVitals();
        const storedRecord = localStorage.getItem(`gazacare_user_record_${p.id}`);
        const record = storedRecord ? JSON.parse(storedRecord) : { visitsHistory: [] };

        return {
          id: p.id,
          nationalId: p.nationalId || '40' + Math.floor(1000000 + Math.random() * 9000000),
          mrn: p.mrn || 'P-' + Math.floor(10000 + Math.random() * 90000),
          name: p.fullName || p.name,
          gender: profile.gender || 'ذكر',
          age: profile.age || 35,
          bloodType: profile.bloodType || 'O+',
          phone: p.phone || '0599000000',
          city: profile.address || 'غزة',
          address: profile.address || 'قطاع غزة',
          allergies: profile.allergies || [],
          chronicConditions: profile.chronicConditions || [],
          status: 'عيادات خارجية',
          vitalSigns: vitals,
          visitsHistory: record.visitsHistory || [],
          avatar: p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
      });

      return {
        success: true,
        data: [...regPatients, ...mockPatients]
      };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/patients/show.php?id=${id}`);
    } catch {
      const allRes = await patientService.getAll();
      const patient = allRes.data.find(p => p.id === id || p.mrn === id || p.nationalId === id) || mockPatients[0];
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
      if (currentUser?.isNewUser || currentUser) {
        const storedProfile = localStorage.getItem(`gazacare_user_profile_${currentUser.id}`);
        const storedVitals = localStorage.getItem(`gazacare_user_vitals_${currentUser.id}`);
        const vitals = storedVitals ? JSON.parse(storedVitals) : getZeroedVitals();

        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          return { success: true, data: { ...parsed, vitalSigns: vitals } };
        }

        const freshProfile = {
          id: currentUser.id,
          name: currentUser.fullName || currentUser.name,
          fullName: currentUser.fullName || currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '0599000000',
          nationalId: currentUser.nationalId || ('40' + Math.floor(1000000 + Math.random() * 9000000)),
          mrn: currentUser.mrn || ('P-' + Math.floor(10000 + Math.random() * 90000)),
          age: currentUser.age || 38,
          dateOfBirth: currentUser.dateOfBirth || '1988-04-15',
          bloodType: currentUser.bloodType || 'O+',
          address: currentUser.address || 'قطاع غزة - فلسطين',
          gender: currentUser.gender || 'ذكر',
          avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          chronicConditions: [],
          allergies: [],
          emergencyContact: {
            name: 'لم يُحدد بعد',
            phone: '---',
            relation: '---'
          },
          vitalSigns: vitals
        };

        if (currentUser.isNewUser) {
          localStorage.setItem(`gazacare_user_profile_${currentUser.id}`, JSON.stringify(freshProfile));
          localStorage.setItem(`gazacare_user_vitals_${currentUser.id}`, JSON.stringify(vitals));
        }

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
      const targetId = patientId || currentUser?.id;
      if (targetId) {
        const stored = localStorage.getItem(`gazacare_user_medications_${targetId}`);
        if (stored) {
          return { success: true, data: JSON.parse(stored) };
        }
      }
      if (currentUser?.isNewUser) {
        return { success: true, data: [] };
      }
      // Default demo meds
      return {
        success: true,
        data: [
          {
            id: 'MED-101',
            name: 'ميتفورمين (Metformin HCl)',
            dosage: '500 mg',
            frequency: 'مرتين يومياً (بعد الطعام)',
            duration: 'علاج مستمر',
            prescribedBy: 'د. هالة منير النجار',
            hospital: 'مجمع الشفاء الطبي',
            status: 'active',
            instructions: 'يتم تناوله صباحاً ومساءً بانتظام.'
          },
          {
            id: 'MED-102',
            name: 'أملوديبين (Amlodipine Besylate)',
            dosage: '5 mg',
            frequency: 'مرة واحدة يومياً (صباحاً)',
            duration: 'علاج مستمر',
            prescribedBy: 'د. هالة منير النجار',
            hospital: 'مجمع الشفاء الطبي',
            status: 'active',
            instructions: 'لضبط ضغط الدم الشرياني.'
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
      const targetId = patientId || currentUser?.id;
      if (targetId) {
        const stored = localStorage.getItem(`gazacare_user_vitals_${targetId}`);
        if (stored) {
          return { success: true, data: JSON.parse(stored) };
        }
      }
      if (currentUser?.isNewUser) {
        return {
          success: true,
          data: getZeroedVitals()
        };
      }
      return {
        success: true,
        data: mockVitalSigns
      };
    }
  },

  updateVitals: async (patientId, newVitalRecord) => {
    try {
      return await api.post('/patient/vitals.php', { patient_id: patientId, ...newVitalRecord });
    } catch {
      const currentUser = getCurrentUser();
      const targetId = patientId || currentUser?.id || 'usr_default';

      let currentVitals = getZeroedVitals();
      const stored = localStorage.getItem(`gazacare_user_vitals_${targetId}`);
      if (stored) {
        try {
          currentVitals = JSON.parse(stored);
        } catch {}
      }

      const updatedVitals = {
        current: {
          heartRate: {
            value: newVitalRecord.hr,
            unit: "نبضة/دقيقة",
            status: newVitalRecord.hr > 100 ? "high" : newVitalRecord.hr < 55 ? "low" : "normal",
            label: "معدل نبضات القلب"
          },
          bloodPressure: {
            systolic: newVitalRecord.bpSys,
            diastolic: newVitalRecord.bpDia,
            unit: "ملم زئبق",
            status: newVitalRecord.bpSys > 140 || newVitalRecord.bpDia > 90 ? "high" : "normal",
            label: "ضغط الدم الشرياني"
          },
          temperature: {
            value: newVitalRecord.temp,
            unit: "°C",
            status: newVitalRecord.temp > 37.8 ? "high" : "normal",
            label: "درجة حرارة الجسم"
          },
          spO2: {
            value: newVitalRecord.spo2,
            unit: "%",
            status: newVitalRecord.spo2 < 94 ? "low" : "normal",
            label: "تشبع الأكسجين في الدم"
          },
          respiratoryRate: {
            value: newVitalRecord.rr,
            unit: "تنفس/دقيقة",
            status: newVitalRecord.rr > 22 ? "high" : "normal",
            label: "معدل التنفس"
          },
          weight: {
            value: newVitalRecord.weight,
            unit: "كغم",
            status: "normal",
            label: "الوزن والكتلة",
            bmi: newVitalRecord.bmi
          }
        },
        history: [
          newVitalRecord,
          ...(currentVitals.history || []).slice(0, 15)
        ]
      };

      localStorage.setItem(`gazacare_user_vitals_${targetId}`, JSON.stringify(updatedVitals));

      // Also update in patient profile
      const storedProfile = localStorage.getItem(`gazacare_user_profile_${targetId}`);
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          profile.vitalSigns = updatedVitals;
          localStorage.setItem(`gazacare_user_profile_${targetId}`, JSON.stringify(profile));
        } catch {}
      }

      return {
        success: true,
        message: 'تم حفظ وتحديث العلامات الحيوية بنجاح',
        data: updatedVitals
      };
    }
  },

  getTimeline: async (patientId) => {
    try {
      return await api.get(`/patient/timeline.php?patient_id=${patientId || ''}`);
    } catch {
      const currentUser = getCurrentUser();
      const targetId = patientId || currentUser?.id;
      if (currentUser?.isNewUser) {
        const storedVitals = localStorage.getItem(`gazacare_user_vitals_${targetId}`);
        const storedPrescriptions = localStorage.getItem(`gazacare_user_prescriptions_${targetId}`);
        const timeline = [];

        if (storedPrescriptions) {
          const rxList = JSON.parse(storedPrescriptions);
          rxList.forEach(rx => {
            timeline.push({
              id: 'tl-' + rx.id,
              date: rx.date,
              time: '10:00 ص',
              type: 'prescription',
              title: 'إصدار وصفة طبية إلكترونية',
              subtitle: `تشخيص: ${rx.diagnosis} - ${rx.doctorName}`,
              doctor: rx.doctorName,
              facility: rx.hospital || 'مجمع الشفاء الطبي',
              status: 'نشطة',
              badge: 'وصفة علاجية',
              badgeColor: 'blue'
            });
          });
        }

        if (storedVitals) {
          const vit = JSON.parse(storedVitals);
          vit.history?.forEach((h, i) => {
            timeline.push({
              id: 'tl-v-' + i,
              date: h.date,
              time: h.time || 'صباحاً',
              type: 'doctor_visit',
              title: 'تسجيل علامات حيوية',
              subtitle: `الضغط: ${h.bpSys}/${h.bpDia} - النبض: ${h.hr} - الحرارة: ${h.temp}°C`,
              doctor: h.recordedBy || 'العيادة الطبية',
              facility: h.location || 'مجمع الشفاء الطبي',
              status: 'مكتمل',
              badge: 'مؤشرات حيوية',
              badgeColor: 'indigo'
            });
          });
        }

        return { success: true, data: timeline };
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
