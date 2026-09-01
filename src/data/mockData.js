// Realistic mock data for GazaCare Electronic Medical Records System
// Prepared for Gaza healthcare system context with Arabic terminology

export const mockHospitals = [
  { id: 1, name: "مجمع الشفاء الطبي", city: "غزة", type: "حكومي", emergency: true, bedCapacity: 450, occupiedBeds: 410 },
  { id: 2, name: "مستشفى شهداء الأقصى", city: "دير البلح", type: "حكومي", emergency: true, bedCapacity: 280, occupiedBeds: 245 },
  { id: 3, name: "مستشفى ناصر الطبي", city: "خان يونس", type: "حكومي", emergency: true, bedCapacity: 350, occupiedBeds: 315 },
  { id: 4, name: "المستشفى الإندونيسي", city: "شمال غزة", type: "تخصصي", emergency: true, bedCapacity: 160, occupiedBeds: 130 },
  { id: 5, name: "مستشفى القدس - الهلال الأحمر", city: "غزة - تل الهوى", type: "أهلي", emergency: true, bedCapacity: 120, occupiedBeds: 95 }
];

export const mockDepartments = [
  { id: "dept_1", name: "قسم الطوارئ والحوادث", code: "ER", head: "د. إبراهيم القدوة", doctorsCount: 14, nursesCount: 28, bedsCount: 60, occupiedBeds: 54, icon: "AlertTriangle" },
  { id: "dept_2", name: "قسم الباطنة العامة", code: "IM", head: "د. هالة النجار", doctorsCount: 10, nursesCount: 18, bedsCount: 45, occupiedBeds: 38, icon: "HeartPulse" },
  { id: "dept_3", name: "قسم الجراحة العامة والعمليات", code: "SURG", head: "د. محمود العشي", doctorsCount: 12, nursesCount: 22, bedsCount: 40, occupiedBeds: 35, icon: "Scissors" },
  { id: "dept_4", name: "قسم طب الأطفال وحديثي الولادة", code: "PED", head: "د. سارة عياش", doctorsCount: 8, nursesCount: 16, bedsCount: 35, occupiedBeds: 28, icon: "Baby" },
  { id: "dept_5", name: "قسم المختبرات والتحاليل الطبية", code: "LAB", head: "أ. خليل المصري", doctorsCount: 6, nursesCount: 12, bedsCount: 0, occupiedBeds: 0, icon: "FlaskConical" },
  { id: "dept_6", name: "قسم الأشعة والتصوير الطبي", code: "RAD", head: "د. طارق الغصين", doctorsCount: 5, nursesCount: 8, bedsCount: 0, occupiedBeds: 0, icon: "Activity" },
  { id: "dept_7", name: "الصيدلية المركزية ومستودع الأدوية", code: "PHARM", head: "د. ريم رضوان", doctorsCount: 7, nursesCount: 10, bedsCount: 0, occupiedBeds: 0, icon: "Pill" }
];

export const mockBeds = [
  { id: "B101", room: "101", department: "قسم الباطنة العامة", ward: "الجناح الشرقي - الطابق الأول", status: "occupied", patientName: "أحمد يوسف خليل", patientId: "P-10492", doctor: "د. هالة النجار", admittedDate: "2026-08-27" },
  { id: "B102", room: "101", department: "قسم الباطنة العامة", ward: "الجناح الشرقي - الطابق الأول", status: "occupied", patientName: "فاطمة محمد حامد", patientId: "P-10512", doctor: "د. هالة النجار", admittedDate: "2026-08-29" },
  { id: "B103", room: "102", department: "قسم الباطنة العامة", ward: "الجناح الشرقي - الطابق الأول", status: "available", patientName: null, patientId: null, doctor: null, admittedDate: null },
  { id: "B104", room: "102", department: "قسم الباطنة العامة", ward: "الجناح الشرقي - الطابق الأول", status: "reserved", patientName: "عمر كمال الشوا", patientId: "P-10580", doctor: "د. إبراهيم القدوة", admittedDate: "2026-08-31" },
  { id: "B105", room: "103", department: "قسم الجراحة العامة والعمليات", ward: "جناح الجراحة - الطابق الثاني", status: "occupied", patientName: "محمود حسن السويركي", patientId: "P-10332", doctor: "د. محمود العشي", admittedDate: "2026-08-25" },
  { id: "B106", room: "103", department: "قسم الجراحة العامة والعمليات", ward: "جناح الجراحة - الطابق الثاني", status: "maintenance", patientName: null, patientId: null, doctor: null, admittedDate: null },
  { id: "B107", room: "104", department: "قسم طب الأطفال وحديثي الولادة", ward: "جناح الأطفال - الطابق الثالث", status: "available", patientName: null, patientId: null, doctor: null, admittedDate: null },
  { id: "B108", room: "104", department: "قسم طب الأطفال وحديثي الولادة", ward: "جناح الأطفال - الطابق الثالث", status: "occupied", patientName: "يوسف رامي أبو شعبان", patientId: "P-10601", doctor: "د. سارة عياش", admittedDate: "2026-08-30" },
  { id: "B109", room: "طوارئ-1", department: "قسم الطوارئ والحوادث", ward: "مبنى الطوارئ", status: "occupied", patientName: "زياد ناصر البطش", patientId: "P-10619", doctor: "د. إبراهيم القدوة", admittedDate: "2026-08-31" },
  { id: "B110", room: "طوارئ-2", department: "قسم الطوارئ والحوادث", ward: "مبنى الطوارئ", status: "available", patientName: null, patientId: null, doctor: null, admittedDate: null },
  { id: "B111", room: "طوارئ-3", department: "قسم الطوارئ والحوادث", ward: "مبنى الطوارئ", status: "occupied", patientName: "مريم عبد الرحمن البورنو", patientId: "P-10625", doctor: "د. إبراهيم القدوة", admittedDate: "2026-08-31" },
  { id: "B112", room: "طوارئ-4", department: "قسم الطوارئ والحوادث", ward: "مبنى الطوارئ", status: "reserved", patientName: "طارق سليم المدهون", patientId: "P-10630", doctor: "د. محمود العشي", admittedDate: "2026-08-31" }
];

export const mockUsers = {
  patient: {
    id: "user_patient_1",
    patientId: "P-10492",
    nationalId: "401928374",
    name: "أحمد يوسف خليل",
    email: "patient@gazacare.ps",
    phone: "0599123456",
    role: "PATIENT",
    birthDate: "1988-06-14",
    age: 38,
    gender: "ذكر",
    bloodType: "O+",
    address: "غزة - الرمال الجنوبي",
    emergencyContact: "سميرة خليل (زوجة) - 0599765432",
    allergies: ["البنسلين (Penicillin)", "السلفا (Sulfa drugs)"],
    chronicConditions: ["ارتفاع ضغط الدم (Hypertension)", "داء السكري من النوع الثاني"],
    hospital: "مجمع الشفاء الطبي",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  doctor: {
    id: "user_doctor_1",
    doctorId: "DOC-382",
    name: "د. هالة منير النجار",
    email: "doctor@gazacare.ps",
    phone: "0599876543",
    role: "DOCTOR",
    specialty: "استشارية أمراض الباطنة والقلب",
    subSpecialty: "ضغط الدم وتصلب الشرايين",
    department: "قسم الباطنة العامة",
    hospital: "مجمع الشفاء الطبي",
    licenseNumber: "MOH-PS-8921",
    experienceYears: 14,
    patientsCount: 142,
    todayAppointmentsCount: 8,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  },
  hospitalManager: {
    id: "user_manager_1",
    managerId: "MGR-012",
    name: "د. صبحي عبد السلام سكيك",
    email: "manager@gazacare.ps",
    phone: "0599555123",
    role: "HOSPITAL_MANAGER",
    position: "المدير العام لمجمع الشفاء الطبي",
    hospital: "مجمع الشفاء الطبي",
    hospitalId: 1,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  labAnalyst: {
    id: "user_lab_1",
    analystId: "LAB-554",
    name: "أ. خليل عادل المصري",
    email: "lab@gazacare.ps",
    phone: "0599333888",
    role: "LAB_ANALYST",
    position: "أخصائي تحاليل طبية أول ومسؤول المختبر المركزي",
    department: "قسم المختبرات والتحاليل الطبية",
    hospital: "مجمع الشفاء الطبي",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
  }
};

export const mockPatients = [
  {
    id: "P-10492",
    nationalId: "401928374",
    name: "أحمد يوسف خليل",
    gender: "ذكر",
    age: 38,
    bloodType: "O+",
    phone: "0599123456",
    city: "غزة",
    allergies: ["البنسلين", "السلفا"],
    chronicConditions: ["ارتفاع ضغط الدم", "السكري النوع 2"],
    status: "منوم (جناح الباطنة)",
    bed: "B101",
    lastVisit: "2026-08-30",
    assignedDoctor: "د. هالة منير النجار"
  },
  {
    id: "P-10512",
    nationalId: "402839120",
    name: "فاطمة محمد حامد",
    gender: "أنثى",
    age: 52,
    bloodType: "A+",
    phone: "0599222333",
    city: "دير البلح",
    allergies: ["الأسبرين"],
    chronicConditions: ["قصور الشريان التاجي"],
    status: "منوم (جناح الباطنة)",
    bed: "B102",
    lastVisit: "2026-08-29",
    assignedDoctor: "د. هالة منير النجار"
  },
  {
    id: "P-10332",
    nationalId: "400192834",
    name: "محمود حسن السويركي",
    gender: "ذكر",
    age: 45,
    bloodType: "B+",
    phone: "0599444555",
    city: "غزة - الشجاعية",
    allergies: ["لا يوجد"],
    chronicConditions: ["قرحة المعدة"],
    status: "منوم (جراحة)",
    bed: "B105",
    lastVisit: "2026-08-28",
    assignedDoctor: "د. محمود العشي"
  },
  {
    id: "P-10580",
    nationalId: "403991823",
    name: "عمر كمال الشوا",
    gender: "ذكر",
    age: 29,
    bloodType: "AB+",
    phone: "0599666777",
    city: "غزة",
    allergies: ["الإيبوبروفين"],
    chronicConditions: ["الربو الشعبي"],
    status: "عيادات خارجية",
    bed: "-",
    lastVisit: "2026-08-27",
    assignedDoctor: "د. هالة منير النجار"
  },
  {
    id: "P-10601",
    nationalId: "405112233",
    name: "يوسف رامي أبو شعبان",
    gender: "ذكر",
    age: 8,
    bloodType: "O+",
    phone: "0599777888",
    city: "غزة - النصر",
    allergies: ["البيض", "الفول السوداني"],
    chronicConditions: ["الربو الحاد"],
    status: "منوم (أطفال)",
    bed: "B108",
    lastVisit: "2026-08-30",
    assignedDoctor: "د. سارة عياش"
  },
  {
    id: "P-10619",
    nationalId: "401554433",
    name: "زياد ناصر البطش",
    gender: "ذكر",
    age: 63,
    bloodType: "A-",
    phone: "0599999000",
    city: "شمال غزة - جباليا",
    allergies: ["المورفين"],
    chronicConditions: ["السكري", "الفشل الكلوي المزمن"],
    status: "طوارئ",
    bed: "B109",
    lastVisit: "2026-08-31",
    assignedDoctor: "د. إبراهيم القدوة"
  }
];

export const mockDoctors = [
  { id: "DOC-382", name: "د. هالة منير النجار", specialty: "أمراض الباطنة والقلب", department: "قسم الباطنة العامة", status: "متاح", activePatients: 24, room: "عيادة 204", rating: 4.9, email: "dr.hala@gazacare.ps", phone: "0599876543" },
  { id: "DOC-105", name: "د. محمود العشي", specialty: "جراحة عامة وأوعية دموية", department: "قسم الجراحة العامة والعمليات", status: "في غرفة العمليات", activePatients: 19, room: "عيادة 102", rating: 4.8, email: "dr.mahmoud@gazacare.ps", phone: "0599112233" },
  { id: "DOC-419", name: "د. إبراهيم القدوة", specialty: "طب الطوارئ والحالات الحرجة", department: "قسم الطوارئ والحوادث", status: "في المناوبة", activePatients: 35, room: "طوارئ A", rating: 4.9, email: "dr.ibrahim@gazacare.ps", phone: "0599334455" },
  { id: "DOC-221", name: "د. سارة عياش", specialty: "طب الأطفال وحديثي الولادة", department: "قسم طب الأطفال وحديثي الولادة", status: "متاح", activePatients: 28, room: "عيادة 301", rating: 4.7, email: "dr.sara@gazacare.ps", phone: "0599556677" },
  { id: "DOC-308", name: "د. طارق الغصين", specialty: "أشعة تشخيصية وتداخلية", department: "قسم الأشعة والتصوير الطبي", status: "متاح", activePatients: 15, room: "وحدة الرنين", rating: 4.8, email: "dr.tariq@gazacare.ps", phone: "0599778899" }
];

export const mockStaff = [
  { id: "ST-01", name: "أ. خليل عادل المصري", role: "أخصائي تحاليل طبية أول", department: "المختبر المركزي", phone: "0599333888", status: "على رأس العمل" },
  { id: "ST-02", name: "ن. مريم سعيد حلس", role: "رئيسة تمريض العناية المركزة", department: "العناية المركزة", phone: "0599444111", status: "على رأس العمل" },
  { id: "ST-03", name: "ص. ريم حسني رضوان", role: "مسؤولة الصيدلية السريرية", department: "الصيدلية", phone: "0599222888", status: "على رأس العمل" },
  { id: "ST-04", name: "ف. بلال طلال مشتهى", role: "فني تصوير شعاعي ورنين", department: "الأشعة", phone: "0599111999", status: "على رأس العمل" },
  { id: "ST-05", name: "م. إسلام زهير صيام", role: "مسجل بيانات وسجلات طبية", department: "السجلات الطبية", phone: "0599888444", status: "إجازة" }
];

export const mockAppointments = [
  {
    id: "APT-8091",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    specialty: "أمراض الباطنة والقلب",
    hospital: "مجمع الشفاء الطبي",
    department: "قسم الباطنة العامة",
    clinicRoom: "عيادة 204",
    date: "2026-09-02",
    time: "10:30 ص",
    type: "متابعة دورية لضغط الدم والسكري",
    status: "مؤكد", // مؤكد, في الانتظار, مكتمل, ملغي
    priority: "عادي",
    notes: "إحضار دفتر قياسات السكر الأسبوعي ونتائج فحص وظائف الكلى."
  },
  {
    id: "APT-8092",
    patientId: "P-10580",
    patientName: "عمر كمال الشوا",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    specialty: "أمراض الباطنة والقلب",
    hospital: "مجمع الشفاء الطبي",
    department: "قسم الباطنة العامة",
    clinicRoom: "عيادة 204",
    date: "2026-09-01",
    time: "09:00 ص",
    type: "استشارة طبية جديدة",
    status: "مؤكد",
    priority: "عاجل",
    notes: "فحص الصدر ووظائف التنفس بسبب نوبات الربو المتكررة."
  },
  {
    id: "APT-8093",
    patientId: "P-10512",
    patientName: "فاطمة محمد حامد",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    specialty: "أمراض الباطنة والقلب",
    hospital: "مجمع الشفاء الطبي",
    department: "قسم الباطنة العامة",
    clinicRoom: "عيادة 204",
    date: "2026-09-01",
    time: "11:15 ص",
    type: "مراجعة نتائج تخطيط القلب (ECG)",
    status: "في الانتظار",
    priority: "عادي",
    notes: "مراجعة تقرير هولتر 24 ساعة."
  },
  {
    id: "APT-8094",
    patientId: "P-10601",
    patientName: "يوسف رامي أبو شعبان",
    doctorId: "DOC-221",
    doctorName: "د. سارة عياش",
    specialty: "طب الأطفال",
    hospital: "مجمع الشفاء الطبي",
    department: "قسم طب الأطفال",
    clinicRoom: "عيادة 301",
    date: "2026-09-01",
    time: "01:00 م",
    type: "فحص دوري ونمو",
    status: "مؤكد",
    priority: "عادي",
    notes: "متابعة أدوية الحساسية والبخاخات."
  },
  {
    id: "APT-8088",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    doctorId: "DOC-105",
    doctorName: "د. محمود العشي",
    specialty: "جراحة عامة",
    hospital: "مجمع الشفاء الطبي",
    department: "قسم الجراحة",
    clinicRoom: "عيادة 102",
    date: "2026-08-20",
    time: "11:00 ص",
    type: "استشارة جراحية سابقة",
    status: "مكتمل",
    priority: "عادي",
    notes: "تمت المعاينة بنجاح وتحويل المريض للعلاج التحفظي."
  }
];

export const mockPrescriptions = [
  {
    id: "RX-5510",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    date: "2026-08-27",
    status: "نشطة", // نشطة, منتهية, معلقة
    diagnosis: "ارتفاع ضغط الدم الشرياني وداء السكري النوع 2",
    notes: "تناول العلاج بانتظام بعد الإفطار وتجنب الأطعمة الغنية بالصوديوم",
    medications: [
      {
        name: "أملوديبين (Amlodipine)",
        tradeName: "Norvasc 5mg",
        dosage: "5 ملغ",
        form: "أقراص فموية",
        frequency: "مرة واحدة يومياً صباحاً",
        duration: "30 يوماً",
        instructions: "تناول القرص مع كوب ماء بعد وجبة الإفطار مباشرة"
      },
      {
        name: "ميتفورمين (Metformin)",
        tradeName: "Glucophage 850mg",
        dosage: "850 ملغ",
        form: "أقراص فموية",
        frequency: "مرتان يومياً (صباحاً ومساءً)",
        duration: "30 يوماً",
        instructions: "تناول القرص وسط الوجبة لتقليل اضطرابات الجهاز الهضمي"
      },
      {
        name: "أتورفاستاتين (Atorvastatin)",
        tradeName: "Lipitor 20mg",
        dosage: "20 ملغ",
        form: "أقراص فموية",
        frequency: "مرة واحدة يومياً مساءً",
        duration: "30 يوماً",
        instructions: "يفضل تناوله قبل النوم"
      }
    ]
  },
  {
    id: "RX-5480",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    doctorId: "DOC-419",
    doctorName: "د. إبراهيم القدوة",
    date: "2026-07-15",
    status: "منتهية",
    diagnosis: "التهاب حاد في الحلق والجيوب الأنفية",
    notes: "إكمال كورس العلاج كاملاً والراحة التامة",
    medications: [
      {
        name: "أزيثروميسين (Azithromycin)",
        tradeName: "Zithromax 500mg",
        dosage: "500 ملغ",
        form: "كبسولات",
        frequency: "مرة واحدة يومياً",
        duration: "5 أيام",
        instructions: "تناول الحبة قبل الأكل بساعة أو بعده بساعتين"
      },
      {
        name: "باراسيتامول (Paracetamol)",
        tradeName: "Panadol 500mg",
        dosage: "500 ملغ",
        form: "أقراص",
        frequency: "عند اللزوم كل 6-8 ساعات",
        duration: "7 أيام",
        instructions: "لا تتجاوز 4 غرامات يومياً"
      }
    ]
  }
];

export const mockLabRequests = [
  {
    id: "LAB-REQ-901",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    testName: "فحص صورة الدم الكاملة (CBC)",
    category: "أمراض الدم (Hematology)",
    sampleType: "دم وريدي (EDTA)",
    priority: "عاجل", // عادي, عاجل, حرج
    requestedDate: "2026-08-30 08:30 ص",
    status: "مكتمل", // في الانتظار, قيد التنفيذ, مكتمل, حرج, ملغي
    analystName: "أ. خليل المصري",
    completedDate: "2026-08-30 11:15 ص",
    results: [
      { parameter: "الهيموجلوبين (Hemoglobin)", value: "14.2", unit: "g/dL", referenceRange: "13.5 - 17.5", status: "normal" },
      { parameter: "كريات الدم البيضاء (WBC)", value: "7.8", unit: "x10^3/uL", referenceRange: "4.0 - 11.0", status: "normal" },
      { parameter: "الصفائح الدموية (Platelets)", value: "245", unit: "x10^3/uL", referenceRange: "150 - 450", status: "normal" },
      { parameter: "كريات الدم الحمراء (RBC)", value: "4.8", unit: "x10^6/uL", referenceRange: "4.3 - 5.9", status: "normal" }
    ],
    notes: "جميع المؤشرات الحيوية لخلايا الدم ضمن الحدود الطبيعية."
  },
  {
    id: "LAB-REQ-902",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    testName: "فحص وظائف الكلى والشوارد (Kidney Panel & Electrolytes)",
    category: "كيمياء سريرية (Clinical Chemistry)",
    sampleType: "مصل الدم (Serum)",
    priority: "عادي",
    requestedDate: "2026-08-30 08:30 ص",
    status: "مكتمل",
    analystName: "أ. خليل المصري",
    completedDate: "2026-08-30 11:45 ص",
    results: [
      { parameter: "الكرياتينين في المصل (Creatinine)", value: "1.1", unit: "mg/dL", referenceRange: "0.7 - 1.3", status: "normal" },
      { parameter: "نيتروجين يوريا الدم (BUN)", value: "18", unit: "mg/dL", referenceRange: "7 - 20", status: "normal" },
      { parameter: "البوتاسيوم (Potassium - K+)", value: "4.3", unit: "mmol/L", referenceRange: "3.5 - 5.0", status: "normal" },
      { parameter: "الصوديوم (Sodium - Na+)", value: "139", unit: "mmol/L", referenceRange: "135 - 145", status: "normal" },
      { parameter: "السكر التراكمي (HbA1c)", value: "6.8", unit: "%", referenceRange: "< 5.7 (طبيعي) | < 7.0 (مسيطر عليه)", status: "warning" }
    ],
    notes: "وظائف الكلى سليمة، السكر التراكمي يظهر استقرار نسبي مع الحاجة للمتابعة الغذائية."
  },
  {
    id: "LAB-REQ-903",
    patientId: "P-10619",
    patientName: "زياد ناصر البطش",
    doctorId: "DOC-419",
    doctorName: "د. إبراهيم القدوة",
    testName: "فحص غازات الدم والشوارد (ABG & Critical Lytes)",
    category: "طوارئ وكيمياء (Critical Care)",
    sampleType: "دم شرياني (Arterial)",
    priority: "حرج",
    requestedDate: "2026-08-31 10:15 ص",
    status: "حرج",
    analystName: "أ. خليل المصري",
    completedDate: "2026-08-31 10:45 ص",
    results: [
      { parameter: "درجة حموضة الدم (pH)", value: "7.22", unit: "pH", referenceRange: "7.35 - 7.45", status: "critical" },
      { parameter: "البوتاسيوم (Potassium - K+)", value: "6.4", unit: "mmol/L", referenceRange: "3.5 - 5.0", status: "critical" },
      { parameter: "بيكربونات (HCO3-)", value: "15", unit: "mmol/L", referenceRange: "22 - 28", status: "critical" }
    ],
    notes: "تنبيه حرج فوري: حماض أيضي حاد وارتفاع خطير في البوتاسيوم يتطلب تدخلاً عاجلاً."
  },
  {
    id: "LAB-REQ-904",
    patientId: "P-10512",
    patientName: "فاطمة محمد حامد",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    testName: "فحص إنزيمات القلب (Cardiac Troponin I & CK-MB)",
    category: "كيمياء قلبية",
    sampleType: "مصل الدم",
    priority: "عاجل",
    requestedDate: "2026-08-31 11:00 ص",
    status: "قيد التنفيذ",
    analystName: "أ. خليل المصري",
    completedDate: null,
    results: [],
    notes: "عينة قيد الفحص بجهاز المناعة الكيميائية."
  },
  {
    id: "LAB-REQ-905",
    patientId: "P-10580",
    patientName: "عمر كمال الشوا",
    doctorId: "DOC-382",
    doctorName: "د. هالة منير النجار",
    testName: "فحص الحساسية العامة ونسبة IgE الكلية",
    category: "مناعة وأمصال (Immunology)",
    sampleType: "مصل الدم",
    priority: "عادي",
    requestedDate: "2026-08-31 11:30 ص",
    status: "في الانتظار",
    analystName: null,
    completedDate: null,
    results: [],
    notes: "العينة وصلت المختبر وبانتظار التجهيز."
  }
];

export const mockVitalSigns = {
  current: {
    heartRate: { value: 76, unit: "نبضة/دقيقة", status: "normal", label: "معدل نبضات القلب" },
    bloodPressure: { systolic: 124, diastolic: 82, unit: "ملم زئبق", status: "normal", label: "ضغط الدم الشرياني" },
    temperature: { value: 36.8, unit: "°C", status: "normal", label: "درجة حرارة الجسم" },
    spO2: { value: 98, unit: "%", status: "normal", label: "تشبع الأكسجين في الدم" },
    respiratoryRate: { value: 16, unit: "تنفس/دقيقة", status: "normal", label: "معدل التنفس" },
    weight: { value: 78.5, unit: "كغم", status: "normal", label: "الوزن", bmi: 25.4 }
  },
  history: [
    { date: "2026-08-25", time: "08:00 ص", bpSys: 138, bpDia: 88, hr: 84, temp: 37.1, spo2: 97, weight: 79.2 },
    { date: "2026-08-26", time: "08:00 ص", bpSys: 132, bpDia: 85, hr: 80, temp: 36.9, spo2: 98, weight: 79.0 },
    { date: "2026-08-27", time: "08:00 ص", bpSys: 128, bpDia: 84, hr: 78, temp: 36.8, spo2: 98, weight: 78.8 },
    { date: "2026-08-28", time: "08:00 ص", bpSys: 125, bpDia: 82, hr: 75, temp: 36.7, spo2: 99, weight: 78.6 },
    { date: "2026-08-29", time: "08:00 ص", bpSys: 126, bpDia: 83, hr: 77, temp: 36.8, spo2: 98, weight: 78.5 },
    { date: "2026-08-30", time: "08:00 ص", bpSys: 124, bpDia: 82, hr: 76, temp: 36.8, spo2: 98, weight: 78.5 }
  ]
};

export const mockMedicalTimeline = [
  {
    id: "TL-01",
    date: "2026-08-30",
    time: "11:45 ص",
    type: "lab_result",
    title: "صدور نتائج فحوصات المختبر",
    subtitle: "فحص صورة الدم الكاملة (CBC) ووظائف الكلى",
    doctor: "أ. خليل المصري (المختبر المركزي)",
    facility: "مجمع الشفاء الطبي",
    status: "مكتمل",
    badge: "نتائج مخبرية",
    badgeColor: "emerald"
  },
  {
    id: "TL-02",
    date: "2026-08-27",
    time: "10:15 ص",
    type: "prescription",
    title: "تجديد الوصفة الطبية وتعديل جرعة الضغط",
    subtitle: "صرف أملوديبين 5 ملغ وميتفورمين 850 ملغ",
    doctor: "د. هالة منير النجار",
    facility: "عيادة الباطنة - مجمع الشفاء",
    status: "نشطة",
    badge: "وصفة علاجية",
    badgeColor: "blue"
  },
  {
    id: "TL-03",
    date: "2026-08-27",
    time: "09:30 ص",
    type: "doctor_visit",
    title: "زيارة استشارية - فحص دوري",
    subtitle: "فحص العلامات الحيوية، استقرار الضغط عند 128/84 ملم زئبق",
    doctor: "د. هالة منير النجار",
    facility: "مجمع الشفاء الطبي",
    status: "مكتمل",
    badge: "معاينة طبية",
    badgeColor: "indigo"
  },
  {
    id: "TL-04",
    date: "2026-08-10",
    time: "02:00 م",
    type: "radiology",
    title: "صورة أشعة سينية للصدر (Chest X-Ray)",
    subtitle: "صورة عادية للصدر - سلامة الرئتين والقلب ضمن الحدود الطبيعية",
    doctor: "د. طارق الغصين",
    facility: "قسم الأشعة - الشفاء",
    status: "تقرير معتمد",
    badge: "أشعة وتصوير",
    badgeColor: "purple"
  },
  {
    id: "TL-05",
    date: "2026-07-15",
    time: "04:30 م",
    type: "emergency",
    title: "زيارة قسم الطوارئ",
    subtitle: "ارتفاع في درجة الحرارة والتهاب الجيوب الأنفية الحاد",
    doctor: "د. إبراهيم القدوة",
    facility: "طوارئ مجمع الشفاء",
    status: "مغادرة بعد العلاج",
    badge: "طوارئ",
    badgeColor: "amber"
  }
];

export const mockNotifications = [
  {
    id: "NOTIF-101",
    targetRole: "PATIENT",
    title: "نتائج تحاليل جديدة متاحة",
    message: "تم اعتماد نتائج فحص صورة الدم الكاملة (CBC) وفحص الكلى بواسطة المختبر المركزي.",
    date: "منذ ساعتين",
    timestamp: "2026-08-31 10:45:00",
    read: false,
    type: "lab",
    link: "/patient/labs"
  },
  {
    id: "NOTIF-102",
    targetRole: "PATIENT",
    title: "تذكير بموعد المتابعة القادم",
    message: "لديك موعد متابعة مجدول مع د. هالة النجار غداً الأربعاء الساعة 10:30 صباحاً في عيادة 204.",
    date: "منذ 5 ساعات",
    timestamp: "2026-08-31 07:30:00",
    read: false,
    type: "appointment",
    link: "/patient/appointments"
  },
  {
    id: "NOTIF-103",
    targetRole: "DOCTOR",
    title: "تنبيه طبي حرج ⚠️",
    message: "نتيجة فحص عاجلة للمريض زياد ناصر البطش (P-10619): بوتاسيوم 6.4 mmol/L مع حماض دموي.",
    date: "منذ 20 دقيقة",
    timestamp: "2026-08-31 12:20:00",
    read: false,
    type: "critical",
    link: "/doctor/patients/P-10619"
  },
  {
    id: "NOTIF-104",
    targetRole: "DOCTOR",
    title: "طلب موعد جديد في الانتظار",
    message: "طلب موعد جديد من المريض فاطمة محمد حامد لمراجعة نتائج تخطيط القلب.",
    date: "منذ 3 ساعات",
    timestamp: "2026-08-31 09:30:00",
    read: true,
    type: "appointment",
    link: "/doctor/appointments"
  },
  {
    id: "NOTIF-105",
    targetRole: "LAB_ANALYST",
    title: "طلب فحص عاجل جديد",
    message: "وصل طلب فحص إنزيمات قلب عاجل للمريض فاطمة محمد حامد من قسم الباطنة.",
    date: "منذ 45 دقيقة",
    timestamp: "2026-08-31 11:55:00",
    read: false,
    type: "lab_request",
    link: "/lab/requests/LAB-REQ-904"
  },
  {
    id: "NOTIF-106",
    targetRole: "HOSPITAL_MANAGER",
    title: "تنبيه إشغال أسرّة الطوارئ",
    message: "نسبة إشغال أسرّة قسم الطوارئ بلغت 90%، يرجى التنسيق لتحويل الحالات المستقرة للأقسام الداخلية.",
    date: "منذ ساعة",
    timestamp: "2026-08-31 11:30:00",
    read: false,
    type: "alert",
    link: "/hospital-manager/beds"
  }
];

export const mockRadiology = [
  {
    id: "RAD-701",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    studyName: "أشعة سينية عادية للصدر (Chest X-Ray PA/Lateral)",
    bodyPart: "الصدر والرئتين",
    modality: "X-Ray",
    doctorName: "د. طارق الغصين",
    requestedBy: "د. هالة النجار",
    date: "2026-08-10",
    status: "مكتمل ومعتمد",
    findings: "حجم القلب والظل المنصف طبيعي. حقول الرئة صافية خالية من الارتشاحات أو الكتل. الجيوب الضلعية الحجابية حادة وسليمة.",
    impression: "فحص الصدر الشعاعي سليم وضمن المعدل الطبيعي.",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "RAD-702",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    studyName: "تخطيط صدى القلب (Echocardiography)",
    bodyPart: "القلب والصمامات",
    modality: "Echo/Ultrasound",
    doctorName: "د. هالة النجار",
    requestedBy: "د. هالة النجار",
    date: "2026-05-18",
    status: "مكتمل ومعتمد",
    findings: "كسر قذف البطين الأيسر (LVEF) 62%، وظيفة انقباضية طبيعية. لا يوجد اعتلال حركي موضعي بالجدار. سماكة طفيفة متوافقة مع ارتفاع ضغط الدم الخفيف.",
    impression: "أداء وظيفي جيد لعضلة القلب وصماماته.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80"
  }
];

export const mockClinicalNotes = [
  {
    id: "NOTE-301",
    patientId: "P-10492",
    doctorName: "د. هالة منير النجار",
    specialty: "الباطنة والقلب",
    date: "2026-08-27 10:30 ص",
    title: "متابعة دورية وتعديل خطة العلاج",
    content: "المريض يشكو من صداع خفيف متقطع في الصباح. ضغط الدم المسجل اليوم 128/84. نسبة السكر الصائم 118 mg/dL. تم التأكيد على الالتزام بحمية قليلة الملح والنشويات، وممارسة المشي 30 دقيقة يومياً. تم طلب صورة دم ووظائف كلى للمتابعة بعد أسبوعين."
  },
  {
    id: "NOTE-302",
    patientId: "P-10492",
    doctorName: "د. إبراهيم القدوة",
    specialty: "طوارئ",
    date: "2026-07-15 05:00 م",
    title: "تقرير تقييم الطوارئ",
    content: "حضر المريض يعاني من احتقان شديد بالحلق وحرارة 38.5. الفحص أظهر احمرار اللوزتين والبلعوم دون صديد. أُعطي باراسيتامول وريدي ومحاليل ترطيبية، وتم صرف مضاد حيوي فموي وغادر بحالة مستقرة."
  }
];

export const mockHospitalStats = {
  totalPatients: 14820,
  admittedPatients: 184,
  totalDoctors: 86,
  totalNursesAndStaff: 240,
  totalBeds: 450,
  occupiedBeds: 410,
  availableBeds: 40,
  occupancyRate: 91.1,
  todayAppointments: 142,
  todayEmergencyAdmissions: 38,
  pendingLabTests: 45,
  pendingRadiology: 18,
  monthlyAdmissions: [
    { month: "يناير", admissions: 420, discharges: 395, emergency: 680 },
    { month: "فبراير", admissions: 450, discharges: 430, emergency: 710 },
    { month: "مارس", admissions: 490, discharges: 470, emergency: 760 },
    { month: "أبريل", admissions: 520, discharges: 490, emergency: 810 },
    { month: "مايو", admissions: 580, discharges: 550, emergency: 890 },
    { month: "يونيو", admissions: 610, discharges: 590, emergency: 940 },
    { month: "يوليو", admissions: 640, discharges: 610, emergency: 990 },
    { month: "أغسطس", admissions: 680, discharges: 650, emergency: 1050 }
  ],
  departmentOccupancy: [
    { name: "الطوارئ", occupied: 54, capacity: 60, percentage: 90 },
    { name: "الباطنة", occupied: 38, capacity: 45, percentage: 84 },
    { name: "الجراحة", occupied: 35, capacity: 40, percentage: 87 },
    { name: "الأطفال", occupied: 28, capacity: 35, percentage: 80 },
    { name: "العناية المركزة", occupied: 19, capacity: 20, percentage: 95 }
  ],
  labRequestsByType: [
    { name: "كيمياء سريرية", count: 480 },
    { name: "صورة الدم (CBC)", count: 520 },
    { name: "ميكروبيولوجي وزراعة", count: 180 },
    { name: "أمراض الدم والتخثر", count: 210 },
    { name: "مناعة وأمصال", count: 160 }
  ]
};
