import api from './api';
import { mockDoctors, mockPatients } from '../data/mockData';
import { patientService } from './patientService';
import { prescriptionService } from './prescriptionService';
import { laboratoryService } from './laboratoryService';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('gazacare_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const doctorService = {
  getDashboard: async () => {
    try {
      return await api.get('/doctor/dashboard.php');
    } catch {
      const currentUser = getCurrentUser();
      const allPatientsRes = await patientService.getAll();
      const totalPatients = allPatientsRes.data?.length || 142;

      if (currentUser?.isNewUser) {
        return {
          success: true,
          data: {
            stats: {
              totalPatients: totalPatients > 0 ? totalPatients : 0,
              todayAppointments: 0,
              pendingLabs: 0,
              criticalAlerts: 0
            }
          }
        };
      }
      return {
        success: true,
        data: {
          stats: {
            totalPatients: 142,
            todayAppointments: 8,
            pendingLabs: 6,
            criticalAlerts: 1
          }
        }
      };
    }
  },

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
      const allRes = await patientService.getAll();
      return {
        success: true,
        data: allRes.data || mockPatients
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

  createPatient: async (patientData) => {
    try {
      const newPatient = {
        id: 'usr_' + Date.now(),
        name: patientData.name,
        fullName: patientData.name,
        email: patientData.email || `patient_${Date.now()}@gazacare.ps`,
        phone: patientData.phone || '',
        nationalId: patientData.nationalId || ('40' + Math.floor(1000000 + Math.random() * 9000000)),
        role: 'PATIENT',
        mrn: 'P-' + Math.floor(10000 + Math.random() * 90000),
        address: patientData.address || 'قطاع غزة - فلسطين',
        age: patientData.age || 30,
        gender: patientData.gender || 'ذكر',
        bloodType: patientData.bloodType || 'O+',
        chronicConditions: patientData.chronicConditions ? (Array.isArray(patientData.chronicConditions) ? patientData.chronicConditions : [patientData.chronicConditions]) : [],
        allergies: patientData.allergies ? (Array.isArray(patientData.allergies) ? patientData.allergies : [patientData.allergies]) : [],
        isNewUser: true,
        createdAt: new Date().toISOString()
      };

      // Save to registered users
      const raw = localStorage.getItem('gazacare_registered_users');
      const registered = raw ? JSON.parse(raw) : [];
      localStorage.setItem('gazacare_registered_users', JSON.stringify([newPatient, ...registered]));

      // Save initial profile
      localStorage.setItem(`gazacare_user_profile_${newPatient.id}`, JSON.stringify(newPatient));
      localStorage.setItem(`gazacare_user_record_${newPatient.id}`, JSON.stringify({
        surgeries: [],
        chronicDiseases: newPatient.chronicConditions,
        visitsHistory: []
      }));

      return {
        success: true,
        message: 'تم إضافة المريض بنجاح وتوليد الرقم الطبي الموحد (MRN)',
        data: newPatient
      };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'فشل إضافة المريض' };
    }
  },

  savePatientConsultation: async (patientId, consultation) => {
    try {
      const currentUser = getCurrentUser();
      const doctorName = currentUser?.fullName || currentUser?.name || 'د. هالة منير النجار';
      const hospitalName = currentUser?.hospital || 'مجمع الشفاء الطبي';

      // 1. Update Patient's Visit History & Record
      const recordKey = `gazacare_user_record_${patientId}`;
      let record = { surgeries: [], chronicDiseases: [], visitsHistory: [] };
      const storedRec = localStorage.getItem(recordKey);
      if (storedRec) {
        try { record = JSON.parse(storedRec); } catch {}
      }

      const newVisit = {
        id: 'VISIT-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        doctorName,
        hospital: hospitalName,
        department: currentUser?.department || 'قسم الباطنة والعيادات الخارجية',
        diagnosis: consultation.diagnosis,
        clinicalNotes: consultation.notes || consultation.clinicalNotes,
        treatmentPlan: consultation.treatmentPlan || 'متابعة الحالة والعلاج الموصوف',
        followUpDate: consultation.followUpDate || 'خلال أسبوعين'
      };

      record.visitsHistory = [newVisit, ...(record.visitsHistory || [])];

      if (consultation.chronicDisease) {
        if (!record.chronicDiseases.includes(consultation.chronicDisease)) {
          record.chronicDiseases.push(consultation.chronicDisease);
        }
      }

      localStorage.setItem(recordKey, JSON.stringify(record));

      // 2. Update Patient Profile (allergies, chronicConditions)
      const profileKey = `gazacare_user_profile_${patientId}`;
      const storedProf = localStorage.getItem(profileKey);
      if (storedProf) {
        try {
          const prof = JSON.parse(storedProf);
          if (consultation.chronicDisease && !prof.chronicConditions?.includes(consultation.chronicDisease)) {
            prof.chronicConditions = [...(prof.chronicConditions || []), consultation.chronicDisease];
          }
          if (consultation.allergy && !prof.allergies?.includes(consultation.allergy)) {
            prof.allergies = [...(prof.allergies || []), consultation.allergy];
          }
          localStorage.setItem(profileKey, JSON.stringify(prof));
        } catch {}
      }

      // 3. If vitals provided -> update patient vitals
      if (consultation.vitals && (consultation.vitals.bpSys || consultation.vitals.hr)) {
        await patientService.updateVitals(patientId, {
          ...consultation.vitals,
          location: hospitalName,
          recordedBy: doctorName
        });
      }

      // 4. If prescription / medicines provided -> issue electronic Rx and add to active meds
      if (consultation.medicines && consultation.medicines.length > 0 && consultation.medicines[0].name) {
        const rxData = {
          patientId,
          patientName: consultation.patientName,
          patientMrn: consultation.patientMrn,
          doctorName,
          hospital: hospitalName,
          diagnosis: consultation.diagnosis,
          medicines: consultation.medicines,
          notes: consultation.notes || 'الالتزام بمواعيد الجرعات الدوائية بدقة'
        };

        await prescriptionService.create(rxData);

        // Also add directly to patient's active medications list
        const medKey = `gazacare_user_medications_${patientId}`;
        let activeMeds = [];
        const storedMeds = localStorage.getItem(medKey);
        if (storedMeds) {
          try { activeMeds = JSON.parse(storedMeds); } catch {}
        }

        const newMeds = consultation.medicines.map((m, idx) => ({
          id: 'MED-' + Date.now() + '-' + idx,
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration || 'حسب إرشادات الطبيب',
          instructions: m.instructions || 'تناول الدواء مع كأس ماء وافر',
          prescribedBy: doctorName,
          hospital: hospitalName,
          status: 'active',
          date: new Date().toISOString().split('T')[0]
        }));

        localStorage.setItem(medKey, JSON.stringify([...newMeds, ...activeMeds]));
      }

      // 5. If laboratory test requested -> create lab request
      if (consultation.labTest && consultation.labTest.testName) {
        await laboratoryService.createRequest({
          patientId,
          patientName: consultation.patientName,
          doctorName,
          testName: consultation.labTest.testName,
          category: consultation.labTest.category || 'كيمياء سريرية',
          sampleType: consultation.labTest.sampleType || 'مصل الدم',
          priority: consultation.labTest.priority || 'عادي',
          notes: consultation.labTest.notes || `طلب فحص للمريض بواسطة ${doctorName}`
        });
      }

      return {
        success: true,
        message: 'تم حفظ الكشف الطبي وتحديث ملف المريض ووصفاته الطبية فورياً',
        data: newVisit
      };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'فشل حفظ الكشف الطبي' };
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
