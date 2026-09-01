import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

const app = express();
const PORT = 3000;

// Enable CORS and body parsers
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'GazaCare EMR Backend API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ------------------------------------------
// 1. AUTHENTICATION & SESSIONS
// ------------------------------------------
const handleLogin = (req: Request, res: Response) => {
  const { email, password, role } = req.body || {};
  if (!email) {
    return res.status(400).json({ success: false, message: 'البريد الإلكتروني أو رقم الهوية مطلوب' });
  }

  const user = db.findUserByEmail(email);

  if (user) {
    const token = 'gazacare_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const { password: _, ...userSafe } = user;
    return res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: userSafe,
        token
      }
    });
  }

  // Fallback login creation for valid test accounts
  const lowerEmail = email.toLowerCase();
  let assignedRole = 'PATIENT';
  if (lowerEmail.includes('doctor') || role === 'DOCTOR') assignedRole = 'DOCTOR';
  else if (lowerEmail.includes('manager') || role === 'HOSPITAL_MANAGER') assignedRole = 'HOSPITAL_MANAGER';
  else if (lowerEmail.includes('lab') || role === 'LAB_ANALYST') assignedRole = 'LAB_ANALYST';

  const newUser = db.addUser({
    name: email.split('@')[0],
    email: email,
    role: assignedRole,
    hospital: 'مجمع الشفاء الطبي'
  });

  const token = 'gazacare_token_' + Date.now();
  return res.json({
    success: true,
    message: 'تم تسجيل الدخول بنجاح',
    data: {
      user: newUser,
      token
    }
  });
};

app.post('/api/auth/login', handleLogin);
app.post('/api/auth/login.php', handleLogin);

const handleRegister = (req: Request, res: Response) => {
  const { name, fullName, email, phone, role, nationalId, password } = req.body || {};
  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'البريد الإلكتروني أو رقم الهاتف مطلوب' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً في النظام' });
  }

  const newUser = db.addUser({
    name: fullName || name || 'مستخدم جديد',
    email,
    phone,
    nationalId,
    role: role || 'PATIENT',
    hospital: 'مجمع الشفاء الطبي'
  });

  const token = 'gazacare_token_' + Date.now();
  return res.json({
    success: true,
    message: 'تم إنشاء الحساب بنجاح في منظومة غزة كير',
    data: {
      user: newUser,
      token
    }
  });
};

app.post('/api/auth/register', handleRegister);
app.post('/api/auth/register.php', handleRegister);

const handleForgotPassword = (req: Request, res: Response) => {
  const { email } = req.body || {};
  return res.json({
    success: true,
    message: 'تم إرسال رابط استعادة كلمة المرور ورمز التحقق إلى بريدك الإلكتروني.'
  });
};

app.post('/api/auth/forgot-password', handleForgotPassword);
app.post('/api/auth/forgot-password.php', handleForgotPassword);

const handleGetMe = (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: db.users.doctor
  });
};

app.get('/api/auth/me', handleGetMe);
app.get('/api/auth/me.php', handleGetMe);

// ------------------------------------------
// 2. PATIENTS MODULE
// ------------------------------------------
const handleGetPatients = (req: Request, res: Response) => {
  const { search, department } = req.query as { search?: string; department?: string };
  const patients = db.getPatients(search, department);
  return res.json({ success: true, data: patients });
};

app.get('/api/patients', handleGetPatients);
app.get('/api/patients/index.php', handleGetPatients);

const handleGetPatientById = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const patient = db.getPatientById(id);
  return res.json({ success: true, data: patient });
};

app.get('/api/patients/:id', handleGetPatientById);
app.get('/api/patients/show.php', handleGetPatientById);

const handleGetPatientProfile = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.users.patient });
};

app.get('/api/patient/profile', handleGetPatientProfile);
app.get('/api/patient/profile.php', handleGetPatientProfile);

const handleUpdatePatientProfile = (req: Request, res: Response) => {
  const updates = req.body || {};
  const updated = db.updatePatientProfile('P-10492', updates);
  return res.json({ success: true, message: 'تم تحديث الملف الطبي بنجاح', data: updated });
};

app.put('/api/patient/profile', handleUpdatePatientProfile);
app.put('/api/patient/profile.php', handleUpdatePatientProfile);

const handleGetVitals = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.vitalSigns });
};

app.get('/api/patient/vitals', handleGetVitals);
app.get('/api/patient/vitals.php', handleGetVitals);

const handleAddVitals = (req: Request, res: Response) => {
  const { patient_id } = req.body;
  const newVitals = db.addVitals(patient_id, req.body);
  return res.json({ success: true, message: 'تم تسجيل المؤشرات الحيوية بنجاح', data: newVitals });
};

app.post('/api/patient/vitals', handleAddVitals);
app.post('/api/patient/vitals.php', handleAddVitals);

const handleGetTimeline = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.timeline });
};

app.get('/api/patient/timeline', handleGetTimeline);
app.get('/api/patient/timeline.php', handleGetTimeline);

// ------------------------------------------
// 3. DOCTORS MODULE
// ------------------------------------------
const handleGetDoctors = (req: Request, res: Response) => {
  const { department } = req.query as { department?: string };
  return res.json({ success: true, data: db.getDoctors(department) });
};

app.get('/api/doctors', handleGetDoctors);
app.get('/api/doctors/index.php', handleGetDoctors);

const handleGetDoctorById = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  return res.json({ success: true, data: db.getDoctorById(id) });
};

app.get('/api/doctors/:id', handleGetDoctorById);
app.get('/api/doctors/show.php', handleGetDoctorById);

const handleGetDoctorPatients = (req: Request, res: Response) => {
  const { search, department } = req.query as { search?: string; department?: string };
  return res.json({ success: true, data: db.getPatients(search, department) });
};

app.get('/api/doctor/patients', handleGetDoctorPatients);
app.get('/api/doctor/patients.php', handleGetDoctorPatients);

const handleGetDoctorStats = (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      totalPatients: db.patients.length,
      todayAppointments: db.appointments.filter(a => a.date === '2026-08-31' || a.date === '2026-09-01').length || 8,
      pendingLabs: db.labRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length || 6,
      criticalAlerts: db.labRequests.filter(r => r.priority === 'critical' || r.isCritical).length || 1
    }
  });
};

app.get('/api/doctor/stats', handleGetDoctorStats);
app.get('/api/doctor/stats.php', handleGetDoctorStats);

const handleAddDiagnosis = (req: Request, res: Response) => {
  const { patient_id, diagnosis, icd10, severity, notes } = req.body || {};
  return res.json({
    success: true,
    message: 'تمت إضافة التشخيص الطبي واعتماده في السجل الموحد',
    data: { patient_id, diagnosis, icd10, severity, notes, date: new Date().toISOString().split('T')[0] }
  });
};

app.post('/api/doctor/diagnoses', handleAddDiagnosis);
app.post('/api/doctor/diagnoses.php', handleAddDiagnosis);

const handleAddClinicalNote = (req: Request, res: Response) => {
  const { patient_id, note, doctorName, department, title, content } = req.body || {};
  const newNote = {
    id: 'NOTE-' + Date.now(),
    patientId: patient_id || 'P-10492',
    doctorName: doctorName || 'د. هالة النجار',
    specialty: department || 'أمراض باطنة',
    date: new Date().toISOString().split('T')[0],
    title: title || 'ملاحظة سريرية جديدة',
    content: content || note || ''
  };
  db.clinicalNotes.unshift(newNote);
  return res.json({ success: true, message: 'تم حفظ الملاحظة السريرية بنجاح', data: newNote });
};

app.post('/api/doctor/notes', handleAddClinicalNote);
app.post('/api/doctor/notes.php', handleAddClinicalNote);

// ------------------------------------------
// 4. APPOINTMENTS MODULE
// ------------------------------------------
const handleGetAppointments = (req: Request, res: Response) => {
  const { patient_id, doctor_id, status } = req.query as { patient_id?: string; doctor_id?: string; status?: string };
  return res.json({ success: true, data: db.getAppointments(patient_id, doctor_id, status) });
};

app.get('/api/appointments', handleGetAppointments);
app.get('/api/appointments/index.php', handleGetAppointments);

const handleCreateAppointment = (req: Request, res: Response) => {
  const newApt = db.createAppointment(req.body);
  return res.json({ success: true, message: 'تم حجز الموعد بنجاح وهو قيد التأكيد', data: newApt });
};

app.post('/api/appointments', handleCreateAppointment);
app.post('/api/appointments/create.php', handleCreateAppointment);

const handleUpdateAppointmentStatus = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const { status, notes } = req.body || {};
  const updated = db.updateAppointmentStatus(id, status, notes);
  return res.json({ success: true, message: `تم تحديث حالة الموعد إلى (${status})`, data: updated });
};

app.put('/api/appointments/:id', handleUpdateAppointmentStatus);
app.put('/api/appointments/status.php', handleUpdateAppointmentStatus);

const handleCancelAppointment = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const updated = db.updateAppointmentStatus(id, 'ملغي', req.body?.reason);
  return res.json({ success: true, message: 'تم إلغاء الموعد بنجاح', data: updated });
};

app.post('/api/appointments/cancel.php', handleCancelAppointment);
app.post('/api/appointments/:id/cancel', handleCancelAppointment);

// ------------------------------------------
// 5. PRESCRIPTIONS MODULE
// ------------------------------------------
const handleGetPrescriptions = (req: Request, res: Response) => {
  const { patient_id } = req.query as { patient_id?: string };
  return res.json({ success: true, data: db.getPrescriptions(patient_id) });
};

app.get('/api/prescriptions', handleGetPrescriptions);
app.get('/api/prescriptions/index.php', handleGetPrescriptions);

const handleCreatePrescription = (req: Request, res: Response) => {
  const newRx = db.createPrescription(req.body);
  return res.json({ success: true, message: 'تم إصدار الوصفة الطبية الإلكترونية وتوليد رمز الصرف', data: newRx });
};

app.post('/api/prescriptions', handleCreatePrescription);
app.post('/api/prescriptions/create.php', handleCreatePrescription);

// ------------------------------------------
// 6. LABORATORY MODULE
// ------------------------------------------
const handleGetLabRequests = (req: Request, res: Response) => {
  const { status, priority } = req.query as { status?: string; priority?: string };
  return res.json({ success: true, data: db.getLabRequests(status, priority) });
};

app.get('/api/lab/requests', handleGetLabRequests);
app.get('/api/lab/requests.php', handleGetLabRequests);

const handleGetLabRequestById = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  return res.json({ success: true, data: db.getLabRequestById(id) });
};

app.get('/api/lab/requests/show.php', handleGetLabRequestById);
app.get('/api/lab/requests/:id', handleGetLabRequestById);

const handleSaveLabResult = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const updated = db.saveLabResult(id, req.body);
  return res.json({ success: true, message: 'تم اعتماد نتائج التحليل وتحديث السجل الطبي للمريض', data: updated });
};

app.post('/api/lab/results/save.php', handleSaveLabResult);
app.post('/api/lab/results', handleSaveLabResult);

const handleMarkLabCritical = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const updated = db.markLabCritical(id, req.body?.note);
  return res.json({ success: true, message: 'تم تصنيف الفحص كحالة حرجة وإرسال إشعار فوري للطبيب المعالج', data: updated });
};

app.post('/api/lab/requests/critical.php', handleMarkLabCritical);
app.post('/api/lab/requests/:id/critical', handleMarkLabCritical);

const handleCreateLabRequest = (req: Request, res: Response) => {
  const newReq = db.createLabRequest(req.body);
  return res.json({ success: true, message: 'تم إرسال طلب الفحص المخبري بنجاح', data: newReq });
};

app.post('/api/lab/requests/create.php', handleCreateLabRequest);
app.post('/api/lab/requests', handleCreateLabRequest);

// ------------------------------------------
// 7. HOSPITAL MANAGEMENT MODULE
// ------------------------------------------
const handleGetHospitals = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.hospitals });
};

app.get('/api/hospitals', handleGetHospitals);
app.get('/api/hospitals/index.php', handleGetHospitals);

const handleGetDepartments = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.departments });
};

app.get('/api/departments', handleGetDepartments);
app.get('/api/departments/index.php', handleGetDepartments);

const handleGetBeds = (req: Request, res: Response) => {
  const { department, status } = req.query as { department?: string; status?: string };
  return res.json({ success: true, data: db.getBeds(department, status) });
};

app.get('/api/beds', handleGetBeds);
app.get('/api/beds/index.php', handleGetBeds);

const handleUpdateBed = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const { status, ...details } = req.body || {};
  const updated = db.updateBed(id, status, details);
  return res.json({ success: true, message: 'تم تحديث حالة السرير السريري بنجاح', data: updated });
};

app.put('/api/beds/update.php', handleUpdateBed);
app.put('/api/beds/:id', handleUpdateBed);

const handleGetStaff = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.staff });
};

app.get('/api/staff', handleGetStaff);
app.get('/api/staff/index.php', handleGetStaff);

const handleGetHospitalAnalytics = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.stats });
};

app.get('/api/hospital-manager/analytics', handleGetHospitalAnalytics);
app.get('/api/hospital-manager/analytics.php', handleGetHospitalAnalytics);

// ------------------------------------------
// 8. RADIOLOGY & MEDICAL RECORDS
// ------------------------------------------
const handleGetMedicalRecord = (req: Request, res: Response) => {
  const patientId = (req.query.patient_id || 'P-10492') as string;
  return res.json({
    success: true,
    data: {
      patient: db.getPatientById(patientId),
      vitals: db.vitalSigns,
      radiology: db.radiology,
      clinicalNotes: db.clinicalNotes,
      labs: db.labRequests
    }
  });
};

app.get('/api/medical-records/show.php', handleGetMedicalRecord);
app.get('/api/medical-records/:id', handleGetMedicalRecord);

const handleGetRadiology = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.radiology });
};

app.get('/api/radiology', handleGetRadiology);
app.get('/api/radiology/index.php', handleGetRadiology);

const handleRequestRadiology = (req: Request, res: Response) => {
  const newRad = {
    id: 'RAD-REQ-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    status: 'مجدول',
    ...req.body
  };
  db.radiology.unshift(newRad);
  return res.json({ success: true, message: 'تم إرسال طلب الأشعة والتصوير الطبي بنجاح', data: newRad });
};

app.post('/api/radiology/request.php', handleRequestRadiology);
app.post('/api/radiology/request', handleRequestRadiology);

const handleGetClinicalNotes = (req: Request, res: Response) => {
  return res.json({ success: true, data: db.clinicalNotes });
};

app.get('/api/clinical-notes', handleGetClinicalNotes);
app.get('/api/clinical-notes/index.php', handleGetClinicalNotes);

// ------------------------------------------
// 9. NOTIFICATIONS MODULE
// ------------------------------------------
const handleGetNotifications = (req: Request, res: Response) => {
  const { role } = req.query as { role?: string };
  return res.json({ success: true, data: db.getNotifications(role) });
};

app.get('/api/notifications', handleGetNotifications);
app.get('/api/notifications/index.php', handleGetNotifications);

const handleMarkNotificationRead = (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const updated = db.markNotificationRead(id);
  return res.json({ success: true, message: 'تم تحديث حالة الإشعار', data: updated });
};

app.put('/api/notifications/read.php', handleMarkNotificationRead);
app.put('/api/notifications/:id/read', handleMarkNotificationRead);

const handleMarkAllNotificationsRead = (req: Request, res: Response) => {
  const { role } = req.body || {};
  db.markAllNotificationsRead(role);
  return res.json({ success: true, message: 'تم تعيين جميع الإشعارات كمقروءة' });
};

app.put('/api/notifications/read-all.php', handleMarkAllNotificationsRead);
app.put('/api/notifications/read-all', handleMarkAllNotificationsRead);

// ==========================================
// VITE & STATIC SERVING SETUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GazaCare Backend] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
