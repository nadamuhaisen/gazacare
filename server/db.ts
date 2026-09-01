// Server-side Stateful In-Memory Database for GazaCare EMR Backend
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
} from '../src/data/mockData.js';

// Deep clone helper
const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

class GazaCareDatabase {
  users = clone(mockUsers);
  allUsers: any[] = [
    { ...mockUsers.doctor, password: 'password123' },
    { ...mockUsers.patient, password: 'password123' },
    { ...mockUsers.hospitalManager, password: 'password123' },
    { ...mockUsers.labAnalyst, password: 'password123' }
  ];
  hospitals = clone(mockHospitals);
  departments = clone(mockDepartments);
  beds = clone(mockBeds);
  patients = clone(mockPatients);
  doctors = clone(mockDoctors);
  appointments = clone(mockAppointments);
  prescriptions = clone(mockPrescriptions);
  labRequests = clone(mockLabRequests);
  radiology = clone(mockRadiology);
  vitalSigns = clone(mockVitalSigns);
  clinicalNotes = clone(mockClinicalNotes);
  staff = clone(mockStaff);
  notifications = clone(mockNotifications);
  timeline = clone(mockMedicalTimeline);
  stats = clone(mockHospitalStats);

  // Authentication
  findUserByEmail(email: string) {
    const cleanEmail = (email || '').trim().toLowerCase();
    return this.allUsers.find(
      (u) =>
        u.email?.toLowerCase() === cleanEmail ||
        u.nationalId === cleanEmail ||
        u.patientId === cleanEmail ||
        u.doctorId === cleanEmail
    );
  }

  addUser(userData: any) {
    const newUser = {
      id: 'usr_' + Date.now(),
      ...userData,
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    this.allUsers.push(newUser);
    return newUser;
  }

  // Patients
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
    return (
      this.patients.find((p) => p.id === id || p.mrn === id) ||
      this.patients[0]
    );
  }

  updatePatientProfile(id: string, updates: any) {
    const idx = this.patients.findIndex((p) => p.id === id || p.mrn === id);
    if (idx !== -1) {
      this.patients[idx] = { ...this.patients[idx], ...updates };
      return this.patients[idx];
    }
    return null;
  }

  // Doctors
  getDoctors(department?: string) {
    if (department && department !== 'الكل') {
      return this.doctors.filter((d) => d.department === department);
    }
    return this.doctors;
  }

  getDoctorById(id: string) {
    return this.doctors.find((d) => d.id === id) || this.doctors[0];
  }

  // Appointments
  getAppointments(patientId?: string, doctorId?: string, status?: string) {
    let list = [...this.appointments];
    if (patientId) list = list.filter((a) => a.patientId === patientId);
    if (doctorId) list = list.filter((a) => a.doctorId === doctorId);
    if (status && status !== 'الكل') list = list.filter((a) => a.status === status);
    return list;
  }

  createAppointment(data: any) {
    const newApt = {
      id: 'APT-' + Math.floor(8000 + Math.random() * 1000),
      status: 'في الانتظار',
      createdDate: new Date().toISOString().split('T')[0],
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
      return apt;
    }
    return null;
  }

  // Prescriptions
  getPrescriptions(patientId?: string) {
    if (patientId) {
      return this.prescriptions.filter((p) => p.patientId === patientId);
    }
    return this.prescriptions;
  }

  createPrescription(data: any) {
    const newRx = {
      id: 'RX-' + Math.floor(5500 + Math.random() * 1000),
      date: new Date().toISOString().split('T')[0],
      status: 'نشطة',
      qrCode: 'GAZA-EMR-RX-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      ...data
    };
    this.prescriptions.unshift(newRx);
    return newRx;
  }

  // Lab Requests & Results
  getLabRequests(status?: string, priority?: string) {
    let list = [...this.labRequests];
    if (status && status !== 'الكل') list = list.filter((r) => r.status === status);
    if (priority && priority !== 'الكل') list = list.filter((r) => r.priority === priority);
    return list;
  }

  getLabRequestById(id: string) {
    return this.labRequests.find((r) => r.id === id) || this.labRequests[0];
  }

  createLabRequest(data: any) {
    const newReq = {
      id: 'LAB-REQ-' + Math.floor(1000 + Math.random() * 9000),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
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

      // Also trigger urgent notification
      this.notifications.unshift({
        id: 'notif_' + Date.now(),
        type: 'critical',
        title: 'تنبيه فحص حرج: ' + req.patientName,
        message: `تم رصد مؤشرات حرجة في فحص (${req.testName}). يرجى التدخل الفوري. ${note || ''}`,
        date: 'الآن',
        timestamp: 'الآن',
        read: false,
        targetRole: 'DOCTOR',
        link: '/doctor/laboratory'
      });
      return req;
    }
    return null;
  }

  // Beds Management
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
        if (details.patientName) bed.patientName = details.patientName;
        if (details.patientId) bed.patientId = details.patientId;
        if (details.doctor) bed.doctor = details.doctor;
        if (details.admittedDate) bed.admittedDate = details.admittedDate;
      }
      return bed;
    }
    return null;
  }

  // Vitals
  addVitals(patientId: string, vitalsData: any) {
    const newVitals = {
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      ...vitalsData
    };
    this.vitalSigns.unshift(newVitals);
    return newVitals;
  }

  // Notifications
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

export const db = new GazaCareDatabase();
