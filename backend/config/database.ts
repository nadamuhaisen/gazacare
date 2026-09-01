import bcrypt from 'bcryptjs';
import {
  mockHospitals,
  mockDepartments,
  mockBeds,
  mockUsers,
  mockPatients,
  mockDoctors,
  mockAppointments,
  mockPrescriptions,
  mockLabRequests,
  mockRadiology,
  mockVitalSigns,
  mockClinicalNotes,
  mockStaff,
  mockNotifications,
  mockMedicalTimeline,
  mockHospitalStats
} from '../../src/data/mockData.js';
import { Logger } from '../utils/logger.js';

// Deep clone utility to isolate mutations
const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource: string;
  targetId?: string;
  patientId?: string;
  ipAddress?: string;
  details?: any;
}

export class DatabaseStore {
  private static instance: DatabaseStore;

  users: any[] = [];
  hospitals: any[] = [];
  departments: any[] = [];
  beds: any[] = [];
  patients: any[] = [];
  doctors: any[] = [];
  appointments: any[] = [];
  prescriptions: any[] = [];
  labRequests: any[] = [];
  radiology: any[] = [];
  vitalSigns: any = clone(mockVitalSigns);
  clinicalNotes: any[] = [];
  staff: any[] = [];
  notifications: any[] = [];
  timeline: any[] = [];
  stats: any = clone(mockHospitalStats);
  auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.seedInitialData();
  }

  static getInstance(): DatabaseStore {
    if (!DatabaseStore.instance) {
      DatabaseStore.instance = new DatabaseStore();
    }
    return DatabaseStore.instance;
  }

  private seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('password123', salt);

    this.users = [
      {
        ...mockUsers.doctor,
        passwordHash: defaultPasswordHash,
        plainPassword: 'password123'
      },
      {
        ...mockUsers.patient,
        passwordHash: defaultPasswordHash,
        plainPassword: 'password123'
      },
      {
        ...mockUsers.hospitalManager,
        passwordHash: defaultPasswordHash,
        plainPassword: 'password123'
      },
      {
        ...mockUsers.labAnalyst,
        passwordHash: defaultPasswordHash,
        plainPassword: 'password123'
      }
    ];

    this.hospitals = clone(mockHospitals);
    this.departments = clone(mockDepartments);
    this.beds = clone(mockBeds);
    this.patients = clone(mockPatients);
    this.doctors = clone(mockDoctors);
    this.appointments = clone(mockAppointments);
    this.prescriptions = clone(mockPrescriptions);
    this.labRequests = clone(mockLabRequests);
    this.radiology = clone(mockRadiology);
    this.clinicalNotes = clone(mockClinicalNotes);
    this.staff = clone(mockStaff);
    this.notifications = clone(mockNotifications);
    this.timeline = clone(mockMedicalTimeline);

    // Initial audit log
    this.auditLogs.push({
      id: 'AUDIT-' + Date.now(),
      timestamp: new Date().toISOString(),
      actorId: 'system',
      actorName: 'GazaCare Core Service',
      actorRole: 'SYSTEM',
      action: 'INITIALIZE_SYSTEM',
      resource: 'DatabaseStore',
      details: { status: 'seeded_successfully' }
    });

    Logger.info('GazaCare Database initialized with Palestinian healthcare seed data');
  }

  // ==========================================
  // AUDIT LOGGING
  // ==========================================
  logAudit(actor: { id: string; name: string; role: string }, action: string, resource: string, targetId?: string, patientId?: string, ip?: string, details?: any) {
    const entry: AuditLogEntry = {
      id: 'AUDIT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      resource,
      targetId,
      patientId,
      ipAddress: ip || '127.0.0.1',
      details
    };
    this.auditLogs.unshift(entry);
    Logger.audit(actor.id, action, resource, patientId, details);
    return entry;
  }

  getAuditLogs(limit = 50) {
    return this.auditLogs.slice(0, limit);
  }

  // ==========================================
  // USERS & AUTH
  // ==========================================
  findUserByEmailOrIdentifier(identifier: string) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return this.users.find(
      (u) =>
        u.email?.toLowerCase() === clean ||
        u.nationalId === clean ||
        u.patientId === clean ||
        u.doctorId === clean ||
        u.managerId === clean ||
        u.analystId === clean
    );
  }

  findUserById(id: string) {
    return this.users.find((u) => u.id === id || u.patientId === id || u.doctorId === id);
  }

  createUser(userData: any) {
    const salt = bcrypt.genSaltSync(10);
    const password = userData.password || 'password123';
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.fullName || userData.name || 'مستخدم جديد',
      fullName: userData.fullName || userData.name || 'مستخدم جديد',
      email: userData.email,
      phone: userData.phone || '',
      nationalId: userData.nationalId || ('40' + Math.floor(1000000 + Math.random() * 9000000)),
      role: userData.role || 'PATIENT',
      mrn: userData.role === 'PATIENT' ? 'P-' + Math.floor(10000 + Math.random() * 90000) : undefined,
      hospital: userData.hospital || 'مجمع الشفاء الطبي',
      department: userData.department || 'العيادات الخارجية',
      passwordHash,
      plainPassword: password,
      isNewUser: true,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    this.users.unshift(newUser);

    // If new user is a patient, also add to patients directory with zeroed record
    if (newUser.role === 'PATIENT') {
      this.patients.unshift({
        id: newUser.id,
        mrn: newUser.mrn,
        nationalId: newUser.nationalId,
        name: newUser.name,
        gender: userData.gender || 'غير محدد',
        age: userData.age || 30,
        bloodType: userData.bloodType || 'غير محدد',
        phone: newUser.phone,
        city: userData.city || 'غزة',
        allergies: [],
        chronicConditions: [],
        status: 'عيادات خارجية',
        lastVisit: 'لا توجد زيارات سابقة',
        assignedDoctor: 'لم يُحدد بعد'
      });
    }

    return newUser;
  }

  verifyUserPassword(user: any, candidatePassword: string): boolean {
    if (!user || !candidatePassword) return false;
    if (user.passwordHash && bcrypt.compareSync(candidatePassword, user.passwordHash)) {
      return true;
    }
    // Backward compatibility for demo plain passwords
    if (user.password === candidatePassword || user.plainPassword === candidatePassword) {
      return true;
    }
    return false;
  }

  // ==========================================
  // PATIENTS
  // ==========================================
  getPatients(search?: string, department?: string) {
    let result = [...this.patients];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.mrn?.toLowerCase().includes(q) ||
          p.nationalId?.includes(q)
      );
    }
    if (department && department !== 'الكل') {
      result = result.filter((p) => p.department === department);
    }
    return result;
  }

  getPatientById(id: string) {
    return this.patients.find((p) => p.id === id || p.mrn === id || p.nationalId === id) || null;
  }

  updatePatient(id: string, updates: any) {
    const idx = this.patients.findIndex((p) => p.id === id || p.mrn === id);
    if (idx !== -1) {
      this.patients[idx] = { ...this.patients[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.patients[idx];
    }
    return null;
  }

  // ==========================================
  // DOCTORS
  // ==========================================
  getDoctors(department?: string) {
    if (department && department !== 'الكل') {
      return this.doctors.filter((d) => d.department === department);
    }
    return this.doctors;
  }

  getDoctorById(id: string) {
    return this.doctors.find((d) => d.id === id || d.doctorId === id) || null;
  }

  // ==========================================
  // APPOINTMENTS
  // ==========================================
  getAppointments(patientId?: string, doctorId?: string, status?: string) {
    let list = [...this.appointments];
    if (patientId) list = list.filter((a) => a.patientId === patientId || a.patientMrn === patientId);
    if (doctorId) list = list.filter((a) => a.doctorId === doctorId);
    if (status && status !== 'الكل') list = list.filter((a) => a.status === status);
    return list;
  }

  getAppointmentById(id: string) {
    return this.appointments.find((a) => a.id === id) || null;
  }

  createAppointment(data: any) {
    const newApt = {
      id: 'APT-' + Math.floor(8000 + Math.random() * 1000),
      status: 'في الانتظار',
      createdDate: new Date().toISOString().split('T')[0],
      patientName: data.patientName || 'مريض غزة كير',
      patientMrn: data.patientMrn || 'P-10492',
      doctorName: data.doctorName || 'د. هالة منير النجار',
      department: data.department || 'قسم الباطنة العامة',
      hospital: data.hospital || 'مجمع الشفاء الطبي',
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || '10:00 ص',
      type: data.type || 'كشف استشاري',
      reason: data.reason || 'متابعة دورية',
      ...data
    };
    this.appointments.unshift(newApt);
    return newApt;
  }

  updateAppointmentStatus(id: string, status: string, notes?: string) {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = status;
      if (notes) apt.notes = notes;
      apt.updatedAt = new Date().toISOString();
      return apt;
    }
    return null;
  }

  // ==========================================
  // PRESCRIPTIONS
  // ==========================================
  getPrescriptions(patientId?: string) {
    if (patientId) {
      return this.prescriptions.filter((p) => p.patientId === patientId || p.patientMrn === patientId);
    }
    return this.prescriptions;
  }

  getPrescriptionById(id: string) {
    return this.prescriptions.find((p) => p.id === id || p.prescriptionNumber === id) || null;
  }

  createPrescription(data: any) {
    const rxId = 'RX-' + Math.floor(5500 + Math.random() * 1000);
    const newRx = {
      id: rxId,
      prescriptionNumber: 'RX-2026-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      status: 'نشطة',
      qrCode: 'GAZA-EMR-RX-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      patientName: data.patientName || 'أحمد يوسف خليل',
      patientMrn: data.patientMrn || 'P-10492',
      doctorName: data.doctorName || 'د. هالة منير النجار',
      hospital: data.hospital || 'مجمع الشفاء الطبي',
      department: data.department || 'قسم الباطنة العامة',
      diagnosis: data.diagnosis || 'فحص عام',
      medicines: data.medicines || [],
      instructions: data.instructions || 'الالتزام بمواعيد الجرعات الدوائية بدقة',
      ...data
    };
    this.prescriptions.unshift(newRx);
    return newRx;
  }

  // ==========================================
  // LABORATORY
  // ==========================================
  getLabRequests(status?: string, priority?: string) {
    let list = [...this.labRequests];
    if (status && status !== 'الكل') list = list.filter((r) => r.status === status);
    if (priority && priority !== 'الكل') list = list.filter((r) => r.priority === priority);
    return list;
  }

  getLabRequestById(id: string) {
    return this.labRequests.find((r) => r.id === id) || null;
  }

  createLabRequest(data: any) {
    const newReq = {
      id: 'LAB-REQ-' + Math.floor(1000 + Math.random() * 9000),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      patientName: data.patientName || 'أحمد يوسف خليل',
      patientMrn: data.patientMrn || 'P-10492',
      doctorName: data.doctorName || 'د. هالة منير النجار',
      testName: data.testName || 'فحص دم شامل (CBC)',
      category: data.category || 'كيمياء سريرية',
      priority: data.priority || 'عادي',
      sampleType: data.sampleType || 'مصل الدم',
      notes: data.notes || '',
      ...data
    };
    this.labRequests.unshift(newReq);
    return newReq;
  }

  saveLabResult(id: string, resultData: any) {
    const req = this.labRequests.find((r) => r.id === id);
    if (req) {
      req.status = 'completed';
      req.results = resultData.results || req.results;
      req.verifiedBy = resultData.verifiedBy || 'أخصائي التحاليل المناوب';
      req.completedDate = new Date().toISOString().split('T')[0];
      req.notes = resultData.notes || req.notes;
      return req;
    }
    return null;
  }

  markLabCritical(id: string, note?: string) {
    const req = this.labRequests.find((r) => r.id === id);
    if (req) {
      req.priority = 'critical';
      req.criticalNote = note;
      req.isCritical = true;

      // Auto trigger urgent alert
      this.notifications.unshift({
        id: 'notif_' + Date.now(),
        type: 'critical',
        title: 'تنبيه فحص حرج: ' + req.patientName,
        message: `تم رصد مؤشرات حرجة في فحص (${req.testName}). يرجى التدخل الفوري. ${note || ''}`,
        date: 'الآن',
        timestamp: new Date().toISOString(),
        read: false,
        targetRole: 'DOCTOR',
        link: '/doctor/laboratory'
      });
      return req;
    }
    return null;
  }

  // ==========================================
  // BEDS & HOSPITALS
  // ==========================================
  getBeds(department?: string, status?: string) {
    let list = [...this.beds];
    if (department && department !== 'الكل') {
      list = list.filter((b) => b.department === department);
    }
    if (status && status !== 'الكل') {
      list = list.filter((b) => b.status === status);
    }
    return list;
  }

  updateBed(id: string, status: string, details?: any) {
    const bed = this.beds.find((b) => b.id === id);
    if (bed) {
      bed.status = status;
      if (status === 'available') {
        bed.patientName = null;
        bed.patientId = null;
        bed.doctor = null;
        bed.admittedDate = null;
      } else if (details) {
        if (details.patientName !== undefined) bed.patientName = details.patientName;
        if (details.patientId !== undefined) bed.patientId = details.patientId;
        if (details.doctor !== undefined) bed.doctor = details.doctor;
        if (details.admittedDate !== undefined) bed.admittedDate = details.admittedDate;
      }
      return bed;
    }
    return null;
  }

  // ==========================================
  // VITALS
  // ==========================================
  addVitals(patientId: string, vitalsData: any) {
    const newVitals = {
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      patientId,
      ...vitalsData
    };
    if (this.vitalSigns && this.vitalSigns.history) {
      this.vitalSigns.history.unshift(newVitals);
    }
    return newVitals;
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  getNotifications(role?: string) {
    if (role) {
      return this.notifications.filter((n) => !n.targetRole || n.targetRole === role);
    }
    return this.notifications;
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return notif;
  }

  markAllNotificationsRead(role?: string) {
    this.notifications.forEach((n) => {
      if (!role || !n.targetRole || n.targetRole === role) {
        n.read = true;
      }
    });
    return true;
  }
}

export const dbStore = DatabaseStore.getInstance();
