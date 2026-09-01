import { Router } from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import prescriptionRoutes from './prescriptionRoutes.js';
import laboratoryRoutes from './laboratoryRoutes.js';
import hospitalRoutes from './hospitalRoutes.js';
import medicalRecordRoutes from './medicalRecordRoutes.js';
import radiologyRoutes from './radiologyRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import auditRoutes from './auditRoutes.js';

import * as authController from '../controllers/authController.js';
import * as patientController from '../controllers/patientController.js';
import * as doctorController from '../controllers/doctorController.js';
import * as appointmentController from '../controllers/appointmentController.js';
import * as prescriptionController from '../controllers/prescriptionController.js';
import * as labController from '../controllers/laboratoryController.js';
import * as hospitalController from '../controllers/hospitalController.js';
import * as mrController from '../controllers/medicalRecordController.js';
import * as radController from '../controllers/radiologyController.js';
import * as notifController from '../controllers/notificationController.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const apiRouter = Router();

// ==========================================
// 1. STANDARD RESTFUL MODULE ROUTERS
// ==========================================
apiRouter.use('/auth', authRoutes);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/patient', patientRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/doctor', doctorRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/prescriptions', prescriptionRoutes);
apiRouter.use('/lab', laboratoryRoutes);
apiRouter.use('/radiology', radiologyRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/', hospitalRoutes);
apiRouter.use('/', medicalRecordRoutes);
apiRouter.use('/', auditRoutes);

// Health check route
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'GazaCare EMR REST API Backend',
    architecture: 'Clean Architecture (Controllers, Models, Services, Middleware, Validators)',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// ==========================================
// 2. BACKWARD COMPATIBILITY PHP ROUTE ALIASES
// ==========================================
// Auth
apiRouter.post('/auth/login.php', authController.login);
apiRouter.post('/auth/register.php', authController.register);
apiRouter.post('/auth/forgot-password.php', authController.forgotPassword);
apiRouter.get('/auth/me.php', optionalAuth, authController.getMe);
apiRouter.post('/auth/logout.php', optionalAuth, authController.logout);

// Patients & Profiles
apiRouter.get('/patients/index.php', optionalAuth, auditAccess('Patients', 'READ_ALL'), patientController.getPatients);
apiRouter.get('/patients/show.php', optionalAuth, auditAccess('Patients', 'READ_ONE'), patientController.getPatientById);
apiRouter.get('/patient/profile.php', optionalAuth, patientController.getPatientProfile);
apiRouter.put('/patient/profile.php', optionalAuth, auditAccess('Patients', 'UPDATE_PROFILE'), patientController.updatePatientProfile);
apiRouter.get('/patient/vitals.php', optionalAuth, patientController.getVitals);
apiRouter.post('/patient/vitals.php', optionalAuth, auditAccess('Patients', 'ADD_VITALS'), patientController.addVitals);
apiRouter.get('/patient/medications.php', optionalAuth, patientController.getMedications);
apiRouter.get('/patient/timeline.php', optionalAuth, patientController.getTimeline);

// Doctor Operations
apiRouter.get('/doctors/index.php', optionalAuth, doctorController.getDoctors);
apiRouter.get('/doctors/show.php', optionalAuth, doctorController.getDoctorById);
apiRouter.get('/doctor/patients.php', optionalAuth, auditAccess('DoctorPatients', 'READ_ALL'), doctorController.getMyPatients);
apiRouter.get('/doctor/stats.php', optionalAuth, doctorController.getDoctorStats);
apiRouter.get('/doctor/dashboard.php', optionalAuth, doctorController.getDoctorDashboard);
apiRouter.post('/doctor/consultations.php', optionalAuth, auditAccess('Consultation', 'RECORD'), doctorController.recordConsultation);
apiRouter.post('/doctor/diagnoses.php', optionalAuth, auditAccess('Diagnosis', 'CREATE'), doctorController.addDiagnosis);
apiRouter.post('/doctor/notes.php', optionalAuth, auditAccess('ClinicalNotes', 'CREATE'), doctorController.addClinicalNote);

// Appointments
apiRouter.get('/appointments/index.php', optionalAuth, appointmentController.getAppointments);
apiRouter.get('/appointments/show.php', optionalAuth, appointmentController.getAppointmentById);
apiRouter.post('/appointments/create.php', optionalAuth, auditAccess('Appointments', 'CREATE'), appointmentController.createAppointment);
apiRouter.put('/appointments/status.php', optionalAuth, auditAccess('Appointments', 'UPDATE_STATUS'), appointmentController.updateAppointmentStatus);
apiRouter.post('/appointments/cancel.php', optionalAuth, auditAccess('Appointments', 'CANCEL'), appointmentController.cancelAppointment);

// Prescriptions
apiRouter.get('/prescriptions/index.php', optionalAuth, prescriptionController.getPrescriptions);
apiRouter.get('/prescriptions/show.php', optionalAuth, auditAccess('Prescriptions', 'READ_ONE'), prescriptionController.getPrescriptionById);
apiRouter.post('/prescriptions/create.php', optionalAuth, auditAccess('Prescriptions', 'CREATE'), prescriptionController.createPrescription);

// Laboratory
apiRouter.get('/lab/requests.php', optionalAuth, labController.getLabRequests);
apiRouter.get('/lab/requests/show.php', optionalAuth, labController.getLabRequestById);
apiRouter.post('/lab/requests/create.php', optionalAuth, auditAccess('Laboratory', 'CREATE_REQUEST'), labController.createLabRequest);
apiRouter.post('/lab/results/save.php', optionalAuth, auditAccess('Laboratory', 'SAVE_RESULT'), labController.saveLabResult);
apiRouter.post('/lab/requests/critical.php', optionalAuth, auditAccess('Laboratory', 'MARK_CRITICAL'), labController.markLabCritical);

// Hospital Management
apiRouter.get('/hospitals/index.php', optionalAuth, hospitalController.getHospitals);
apiRouter.get('/departments/index.php', optionalAuth, hospitalController.getDepartments);
apiRouter.get('/beds/index.php', optionalAuth, hospitalController.getBeds);
apiRouter.put('/beds/update.php', optionalAuth, auditAccess('Beds', 'UPDATE'), hospitalController.updateBed);
apiRouter.get('/staff/index.php', optionalAuth, hospitalController.getStaff);
apiRouter.get('/hospital-manager/analytics.php', optionalAuth, hospitalController.getHospitalAnalytics);

// Medical Records & Radiology
apiRouter.get('/medical-records/show.php', optionalAuth, auditAccess('MedicalRecords', 'READ_EHR'), mrController.getMedicalRecord);
apiRouter.get('/clinical-notes/index.php', optionalAuth, mrController.getClinicalNotes);
apiRouter.get('/radiology/index.php', optionalAuth, radController.getRadiology);
apiRouter.post('/radiology/request.php', optionalAuth, auditAccess('Radiology', 'REQUEST_SCAN'), radController.requestRadiology);

// Notifications
apiRouter.get('/notifications/index.php', optionalAuth, notifController.getNotifications);
apiRouter.put('/notifications/read.php', optionalAuth, notifController.markNotificationRead);
apiRouter.put('/notifications/read-all.php', optionalAuth, notifController.markAllNotificationsRead);

export default apiRouter;
