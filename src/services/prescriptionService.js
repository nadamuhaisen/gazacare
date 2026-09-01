import api from './api';
import { mockPrescriptions } from '../data/mockData';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('gazacare_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getUserPrescriptions = (userId) => {
  try {
    const raw = localStorage.getItem(`gazacare_user_prescriptions_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUserPrescriptions = (userId, prescriptions) => {
  try {
    localStorage.setItem(`gazacare_user_prescriptions_${userId}`, JSON.stringify(prescriptions));
  } catch (e) {
    console.error('Error saving user prescriptions', e);
  }
};

const getAllStoredPrescriptions = () => {
  try {
    const raw = localStorage.getItem('gazacare_all_prescriptions');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const prescriptionService = {
  getPrescriptions: async (params) => {
    return prescriptionService.getAll(params);
  },

  getAll: async (params) => {
    try {
      return await api.get('/prescriptions/index.php', { params });
    } catch {
      const currentUser = getCurrentUser();
      const allStored = getAllStoredPrescriptions();

      if (currentUser?.role === 'PATIENT') {
        const userRx = getUserPrescriptions(currentUser.id);
        if (currentUser.isNewUser) {
          return { success: true, data: userRx };
        }
        return { success: true, data: [...userRx, ...mockPrescriptions] };
      }

      // For Doctor / Manager / Pharmacist -> return all prescriptions
      return { success: true, data: [...allStored, ...mockPrescriptions] };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/prescriptions/show.php?id=${id}`);
    } catch {
      const allRes = await prescriptionService.getAll();
      const rx = allRes.data.find(p => p.id === id || p.prescriptionNumber === id) || allRes.data[0] || null;
      return { success: true, data: rx };
    }
  },

  create: async (prescriptionData) => {
    try {
      return await api.post('/prescriptions/create.php', prescriptionData);
    } catch {
      const currentUser = getCurrentUser();
      const newRx = {
        id: 'RX-' + Math.floor(5500 + Math.random() * 1000),
        prescriptionNumber: 'RX-2026-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split('T')[0],
        status: 'active',
        patientName: prescriptionData.patientName || currentUser?.fullName || currentUser?.name || 'أحمد يوسف خليل',
        patientMrn: prescriptionData.patientMrn || currentUser?.mrn || 'P-10492',
        doctorName: prescriptionData.doctorName || currentUser?.fullName || currentUser?.name || 'د. هالة منير النجار',
        hospital: prescriptionData.hospital || 'مجمع الشفاء الطبي',
        ...prescriptionData
      };

      // 1. Save to patient's private prescriptions
      const targetPatientId = prescriptionData.patientId || currentUser?.id;
      if (targetPatientId) {
        const existing = getUserPrescriptions(targetPatientId);
        saveUserPrescriptions(targetPatientId, [newRx, ...existing]);

        // Also add medications to patient's active medication list if medicines array provided
        if (prescriptionData.medicines && Array.isArray(prescriptionData.medicines)) {
          const medKey = `gazacare_user_medications_${targetPatientId}`;
          let activeMeds = [];
          const storedMeds = localStorage.getItem(medKey);
          if (storedMeds) {
            try { activeMeds = JSON.parse(storedMeds); } catch {}
          }

          const formattedMeds = prescriptionData.medicines.map((m, idx) => ({
            id: 'MED-' + Date.now() + '-' + idx,
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration || 'علاج مستمر',
            instructions: m.instructions || 'حسب إرشادات الطبيب المعالج',
            prescribedBy: newRx.doctorName,
            hospital: newRx.hospital,
            status: 'active'
          }));

          localStorage.setItem(medKey, JSON.stringify([...formattedMeds, ...activeMeds]));
        }
      }

      // 2. Save to global prescriptions collection
      const allStored = getAllStoredPrescriptions();
      localStorage.setItem('gazacare_all_prescriptions', JSON.stringify([newRx, ...allStored]));

      return {
        success: true,
        message: 'تم إنشاء وصرف الوصفة الطبية الإلكترونية بنجاح',
        data: newRx
      };
    }
  }
};
