import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getPatients = async (req: Request, res: Response) => {
  const { search, department } = req.query as { search?: string; department?: string };
  const patients = dbStore.getPatients(search, department);
  return ResponseHelper.success(res, patients);
};

export const getPatientById = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const patient = dbStore.getPatientById(id);
  if (!patient) {
    return ResponseHelper.notFound(res, 'المريض غير موجود في السجلات الطبية');
  }

  // Also include vitals and active medications in detailed view
  const vitals = dbStore.vitalSigns;
  const prescriptions = dbStore.getPrescriptions(patient.id);

  return ResponseHelper.success(res, {
    ...patient,
    vitalSigns: vitals,
    prescriptions
  });
};

export const createPatient = async (req: Request, res: Response) => {
  const { name, nationalId, gender, age, bloodType, phone, address, allergies, chronicConditions } = req.body || {};

  const newPatientUser = dbStore.createUser({
    name,
    fullName: name,
    email: req.body.email || `patient_${Date.now()}@gazacare.ps`,
    nationalId,
    phone,
    gender,
    age,
    bloodType,
    city: address || 'غزة',
    role: 'PATIENT'
  });

  const patientRecord = dbStore.getPatientById(newPatientUser.id);

  if (patientRecord) {
    if (allergies) patientRecord.allergies = Array.isArray(allergies) ? allergies : [allergies];
    if (chronicConditions) patientRecord.chronicConditions = Array.isArray(chronicConditions) ? chronicConditions : [chronicConditions];
  }

  return ResponseHelper.created(
    res,
    patientRecord || newPatientUser,
    'تم تسجيل المريض بنجاح وتوليد الرقم الطبي الموحد (MRN)'
  );
};

export const getPatientProfile = async (req: Request, res: Response) => {
  // If user is authenticated patient, find their profile
  const userId = req.user?.id;
  const userMrn = req.user?.mrn;

  if (userId) {
    const user = dbStore.findUserById(userId);
    if (user) {
      const { passwordHash: _, plainPassword: __, ...userSafe } = user;
      return ResponseHelper.success(res, {
        ...userSafe,
        vitalSigns: dbStore.vitalSigns
      });
    }
  }

  // Fallback to default patient mock
  const defaultPatient = dbStore.users.find((u) => u.role === 'PATIENT') || dbStore.users[1];
  const { passwordHash: _, plainPassword: __, ...userSafe } = defaultPatient;
  return ResponseHelper.success(res, {
    ...userSafe,
    vitalSigns: dbStore.vitalSigns
  });
};

export const updatePatientProfile = async (req: Request, res: Response) => {
  const id = (req.params.id || req.user?.id || 'P-10492') as string;
  const updates = req.body || {};

  const updated = dbStore.updatePatient(id, updates);
  if (!updated) {
    return ResponseHelper.notFound(res, 'لم يتم العثور على ملف المريض لتحديثه');
  }

  return ResponseHelper.success(res, updated, 'تم تحديث الملف الطبي للمريض بنجاح');
};

export const getVitals = async (req: Request, res: Response) => {
  const patientId = (req.query.patient_id || req.params.patient_id || req.user?.id) as string;
  const vitals = dbStore.vitalSigns;
  return ResponseHelper.success(res, vitals);
};

export const addVitals = async (req: Request, res: Response) => {
  const { patient_id, patientId, hr, bpSys, bpDia, temp, spo2, rr, weight, height } = req.body || {};
  const targetId = patientId || patient_id || req.user?.id || 'P-10492';

  // Compute calculated metrics
  const bmi = weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : undefined;

  const vitalRecord = {
    hr: Number(hr) || 75,
    bpSys: Number(bpSys) || 120,
    bpDia: Number(bpDia) || 80,
    temp: Number(temp) || 37.0,
    spo2: Number(spo2) || 98,
    rr: Number(rr) || 16,
    weight: Number(weight) || 70,
    bmi,
    recordedBy: req.user?.name || 'التمريض المناوب',
    hospital: req.user?.hospital || 'مجمع الشفاء الطبي',
    notes: req.body?.notes || 'تم القياس في العيادة'
  };

  const newVitals = dbStore.addVitals(targetId, vitalRecord);

  // Update current snapshot
  if (dbStore.vitalSigns && dbStore.vitalSigns.current) {
    dbStore.vitalSigns.current = {
      heartRate: {
        value: vitalRecord.hr,
        unit: 'نبضة/دقيقة',
        status: vitalRecord.hr > 100 ? 'high' : vitalRecord.hr < 55 ? 'low' : 'normal',
        label: 'معدل نبضات القلب'
      },
      bloodPressure: {
        systolic: vitalRecord.bpSys,
        diastolic: vitalRecord.bpDia,
        unit: 'ملم زئبق',
        status: vitalRecord.bpSys > 140 || vitalRecord.bpDia > 90 ? 'high' : 'normal',
        label: 'ضغط الدم الشرياني'
      },
      temperature: {
        value: vitalRecord.temp,
        unit: '°C',
        status: vitalRecord.temp > 37.8 ? 'high' : 'normal',
        label: 'درجة حرارة الجسم'
      },
      spO2: {
        value: vitalRecord.spo2,
        unit: '%',
        status: vitalRecord.spo2 < 94 ? 'low' : 'normal',
        label: 'تشبع الأكسجين في الدم'
      },
      respiratoryRate: {
        value: vitalRecord.rr,
        unit: 'تنفس/دقيقة',
        status: vitalRecord.rr > 22 ? 'high' : 'normal',
        label: 'معدل التنفس'
      },
      weight: {
        value: vitalRecord.weight,
        unit: 'كغم',
        status: 'normal',
        label: 'الوزن والكتلة',
        bmi
      }
    };
  }

  return ResponseHelper.created(res, newVitals, 'تم تسجيل المؤشرات الحيوية بنجاح واعتمادها في السجل الموحد');
};

export const getMedications = async (req: Request, res: Response) => {
  const patientId = (req.query.patient_id || req.user?.id) as string;
  const prescriptions = dbStore.getPrescriptions(patientId);

  // Extract all active medicines from prescriptions
  const medications: any[] = [];
  prescriptions.forEach((rx) => {
    if (rx.medicines && Array.isArray(rx.medicines)) {
      rx.medicines.forEach((med: any, idx: number) => {
        medications.push({
          id: `MED-${rx.id}-${idx}`,
          prescriptionId: rx.id,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration || 'علاج مستمر',
          instructions: med.instructions || rx.instructions || 'الالتزام بالجرعات',
          prescribedBy: rx.doctorName,
          hospital: rx.hospital,
          status: rx.status === 'نشطة' || rx.status === 'active' ? 'active' : 'completed',
          date: rx.date
        });
      });
    }
  });

  return ResponseHelper.success(res, medications);
};

export const getTimeline = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, dbStore.timeline);
};
