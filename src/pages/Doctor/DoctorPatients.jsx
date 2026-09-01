import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { VitalSigns } from '../../components/common/VitalSigns';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  PlusCircle,
  Stethoscope,
  Heart,
  FileText,
  FlaskConical,
  Activity,
  AlertTriangle,
  ChevronLeft,
  User,
  Calendar,
  Save,
  CheckCircle2,
  X,
  Phone,
  MapPin,
  Clock,
  Pill
} from 'lucide-react';

export const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Modals
  const [newConsultationOpen, setNewConsultationOpen] = useState(false);
  const [newPatientModalOpen, setNewPatientModalOpen] = useState(false);
  const [addVitalModalOpen, setAddVitalModalOpen] = useState(false);

  // Consultation form state
  const [consultationForm, setConsultationForm] = useState({
    diagnosis: '',
    notes: '',
    chronicDisease: '',
    allergy: '',
    prescriptionName: '',
    prescriptionDosage: '',
    prescriptionFreq: '',
    prescriptionDuration: '7 أيام',
    labTestName: '',
    labCategory: 'كيمياء سريرية',
    labPriority: 'عادي',
    // Optional Vitals entered during consultation
    bpSys: '',
    bpDia: '',
    hr: '',
    temp: '',
    spo2: '',
    rr: '',
    weight: ''
  });

  // New Patient Form
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    nationalId: '',
    phone: '',
    age: '',
    gender: 'ذكر',
    bloodType: 'O+',
    address: 'قطاع غزة - فلسطين',
    chronicConditions: '',
    allergies: ''
  });

  const { addToast } = useNotification();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getMyPatients();
      if (res.success) {
        setPatients(res.data);
        if (res.data.length > 0) {
          // If we had a selected patient, re-fetch its updated version
          if (selectedPatient) {
            const updatedSelected = res.data.find(p => p.id === selectedPatient.id) || res.data[0];
            setSelectedPatient(updatedSelected);
          } else {
            setSelectedPatient(res.data[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.mrn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.nationalId || '').includes(searchQuery)
  );

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    // Fetch latest vitals for selected patient
    try {
      const vitalsRes = await patientService.getVitalSigns(patient.id);
      if (vitalsRes.success) {
        setSelectedPatient(prev => ({ ...prev, vitalSigns: vitalsRes.data }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPatientSubmit = async (e) => {
    e.preventDefault();
    if (!newPatientForm.name || !newPatientForm.nationalId) {
      addToast({ title: 'تنبيه', message: 'يرجى إدخال اسم المريض ورقم الهوية الوطنية', type: 'warning' });
      return;
    }

    try {
      const res = await doctorService.createPatient({
        ...newPatientForm,
        age: parseInt(newPatientForm.age, 10) || 30,
        chronicConditions: newPatientForm.chronicConditions ? newPatientForm.chronicConditions.split(',').map(s => s.trim()) : [],
        allergies: newPatientForm.allergies ? newPatientForm.allergies.split(',').map(s => s.trim()) : []
      });

      if (res.success) {
        addToast({
          title: 'تم تسجيل المريض بنجاح',
          message: `تم توليد الرقم الطبي الموحد: ${res.data.mrn}`,
          type: 'success'
        });
        setNewPatientModalOpen(false);
        setNewPatientForm({
          name: '',
          nationalId: '',
          phone: '',
          age: '',
          gender: 'ذكر',
          bloodType: 'O+',
          address: 'قطاع غزة - فلسطين',
          chronicConditions: '',
          allergies: ''
        });
        await loadPatients();
        setSelectedPatient(res.data);
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل إنشاء ملف المريض', type: 'error' });
    }
  };

  const handleSaveVitalForPatient = async (newVitalRecord) => {
    if (!selectedPatient) return;
    try {
      const res = await patientService.updateVitals(selectedPatient.id, newVitalRecord);
      if (res.success) {
        addToast({
          title: 'تم تسجيل العلامات الحيوية',
          message: 'تم حفظ القياسات وتحديث ملف المريض فورياً',
          type: 'success'
        });
        setSelectedPatient(prev => ({
          ...prev,
          vitalSigns: res.data
        }));
        await loadPatients();
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل تسجيل العلامات الحيوية', type: 'error' });
    }
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!consultationForm.diagnosis) {
      addToast({ title: 'تنبيه', message: 'يرجى كتابة التشخيص السريري', type: 'warning' });
      return;
    }

    try {
      // Build medicines array if entered
      const medicines = [];
      if (consultationForm.prescriptionName) {
        medicines.push({
          name: consultationForm.prescriptionName,
          dosage: consultationForm.prescriptionDosage || '500 mg',
          frequency: consultationForm.prescriptionFreq || 'مرتين يومياً',
          duration: consultationForm.prescriptionDuration || '7 أيام',
          instructions: 'تناول الدواء بعد الوجبات بانتظام'
        });
      }

      // Build vitals payload if entered
      let vitalsPayload = null;
      if (consultationForm.bpSys || consultationForm.hr) {
        const bpSysNum = parseInt(consultationForm.bpSys, 10) || 120;
        const bpDiaNum = parseInt(consultationForm.bpDia, 10) || 80;
        const hrNum = parseInt(consultationForm.hr, 10) || 75;
        const tempNum = parseFloat(consultationForm.temp) || 37.0;
        const spo2Num = parseInt(consultationForm.spo2, 10) || 98;
        const rrNum = parseInt(consultationForm.rr, 10) || 16;
        const weightNum = parseFloat(consultationForm.weight) || 70;

        vitalsPayload = {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          bpSys: bpSysNum,
          bpDia: bpDiaNum,
          hr: hrNum,
          temp: tempNum,
          spo2: spo2Num,
          rr: rrNum,
          weight: weightNum
        };
      }

      const payload = {
        patientName: selectedPatient.name,
        patientMrn: selectedPatient.mrn,
        diagnosis: consultationForm.diagnosis,
        notes: consultationForm.notes,
        chronicDisease: consultationForm.chronicDisease,
        allergy: consultationForm.allergy,
        medicines,
        vitals: vitalsPayload,
        labTest: consultationForm.labTestName ? {
          testName: consultationForm.labTestName,
          category: consultationForm.labCategory,
          priority: consultationForm.labPriority
        } : null
      };

      const res = await doctorService.savePatientConsultation(selectedPatient.id, payload);

      if (res.success) {
        addToast({
          title: 'تم حفظ الكشف الطبي بنجاح',
          message: 'تم تحديث السجل والوصفات الطبية والعلامات الحيوية لدى المريض مباشرة',
          type: 'success'
        });

        setNewConsultationOpen(false);
        setConsultationForm({
          diagnosis: '',
          notes: '',
          chronicDisease: '',
          allergy: '',
          prescriptionName: '',
          prescriptionDosage: '',
          prescriptionFreq: '',
          prescriptionDuration: '7 أيام',
          labTestName: '',
          labCategory: 'كيمياء سريرية',
          labPriority: 'عادي',
          bpSys: '',
          bpDia: '',
          hr: '',
          temp: '',
          spo2: '',
          rr: '',
          weight: ''
        });

        await loadPatients();
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل حفظ الكشف الطبي', type: 'error' });
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            السجلات الطبية للمرضى (EHR)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تدوين الكشوفات الطبية، تسجيل المؤشرات الحيوية، وإصدار الوصفات والفحوصات المخبرية للمرضى
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setNewPatientModalOpen(true)}
          >
            تسجيل مريض جديد
          </Button>
        </div>
      </div>

      {/* Main Split Grid: Patient Directory (4 cols) & Patient Record Detail (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، الهوية، أو رقم الملف (MRN)..."
              className="w-full pr-10 pl-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="text-xs text-slate-400 px-1">
            إجمالي المرضى: {filteredPatients.length}
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-0.5">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 shadow-xs ring-1 ring-sky-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={patient.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                        alt={patient.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-sky-500/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {patient.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {patient.mrn} • {patient.age || '30'} سنة • {patient.gender || 'ذكر'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={patient.status === 'urgent' ? 'danger' : 'primary'} size="sm">
                      {patient.bloodType || 'O+'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                      patient.chronicConditions.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400">لا توجد أمراض مزمنة</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Patient Full EHR Panel */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPatient ? (
            <Card className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPatient.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={selectedPatient.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/30 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedPatient.name}
                      </h3>
                      <Badge variant="primary" size="md">{selectedPatient.bloodType || 'O+'}</Badge>
                      <Badge variant="default" size="sm">{selectedPatient.gender || 'ذكر'}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      الهوية: {selectedPatient.nationalId} | الملف (MRN): {selectedPatient.mrn} | الهاتف: {selectedPatient.phone || '---'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {selectedPatient.address || 'قطاع غزة - فلسطين'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Stethoscope}
                    onClick={() => setNewConsultationOpen(true)}
                  >
                    تدوين كشف / وصفة
                  </Button>
                </div>
              </div>

              {/* Allergies and Warnings Bar */}
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    تنبيه الحساسية الدوائية والغذائية:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                      selectedPatient.allergies.map((a, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-semibold">
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">لا توجد حساسية مسجلة</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vitals Overview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    المؤشرات والعلامات الحيوية للمريض
                  </h4>
                </div>
                <VitalSigns
                  vitals={selectedPatient.vitalSigns}
                  showChart={true}
                  compact={false}
                  onAddVital={handleSaveVitalForPatient}
                  isDoctor={true}
                />
              </div>

              {/* Visits & Diagnoses History */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  سجل الزيارات والكشوفات الطبية السابقة
                </h4>
                {selectedPatient.visitsHistory && selectedPatient.visitsHistory.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedPatient.visitsHistory.map((visit, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{visit.diagnosis}</span>
                          <span className="text-slate-400 font-mono">{visit.date} {visit.time ? `• ${visit.time}` : ''}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{visit.clinicalNotes || visit.notes}</p>
                        <div className="text-[11px] text-sky-600 font-medium flex items-center gap-2">
                          <span>{visit.doctorName}</span>
                          <span>•</span>
                          <span>{visit.hospital}</span>
                          {visit.department && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400">{visit.department}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center text-xs text-slate-400 border border-dashed">
                    لا توجد كشوفات سابقة مسجلة لهذا المريض. يمكنك إضافة أول كشف عبر زر "تدوين كشف / وصفة".
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              اختر مريضاً من القائمة الجانبية لعرض سجله الطبي الموحد وإجراء الفحوصات.
            </div>
          )}
        </div>
      </div>

      {/* New Consultation & Prescription & Vitals Modal */}
      {newConsultationOpen && selectedPatient && (
        <Modal
          isOpen={newConsultationOpen}
          onClose={() => setNewConsultationOpen(false)}
          title={`تدوين كشف سريري للمريض: ${selectedPatient.name} (${selectedPatient.mrn})`}
        >
          <form onSubmit={handleSaveConsultation} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            {/* Diagnosis & Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                التشخيص السريري (Clinical Diagnosis) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={consultationForm.diagnosis}
                onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
                placeholder="مثال: ارتفاع ضغط الدم الشرياني الأولي (Stage 1 HTN)"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الملاحظات السريرية وخطة العلاج
              </label>
              <textarea
                rows={3}
                value={consultationForm.notes}
                onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })}
                placeholder="سجل نتائج المعاينة، الأعراض المشتكى منها، النصائح الغذائية، وموعد المراجعة..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Optional Chronic Condition / Allergy Update */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  إضافة تشخيص مرض مزمن للملف
                </label>
                <input
                  type="text"
                  placeholder="مثال: داء السكري من النوع الثاني"
                  value={consultationForm.chronicDisease}
                  onChange={(e) => setConsultationForm({ ...consultationForm, chronicDisease: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  إضافة حساسية دوائية مكتشفة
                </label>
                <input
                  type="text"
                  placeholder="مثال: البنسلين (Penicillin)"
                  value={consultationForm.allergy}
                  onChange={(e) => setConsultationForm({ ...consultationForm, allergy: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Quick Vitals Entry during consultation */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 space-y-2">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-600" />
                تسجيل العلامات الحيوية أثناء الكشف (اختياري)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">الضغط الانقباضي</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={consultationForm.bpSys}
                    onChange={(e) => setConsultationForm({ ...consultationForm, bpSys: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">الضغط الانبساطي</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={consultationForm.bpDia}
                    onChange={(e) => setConsultationForm({ ...consultationForm, bpDia: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">نبض القلب (bpm)</label>
                  <input
                    type="number"
                    placeholder="75"
                    value={consultationForm.hr}
                    onChange={(e) => setConsultationForm({ ...consultationForm, hr: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">حرارة الجسم (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    value={consultationForm.temp}
                    onChange={(e) => setConsultationForm({ ...consultationForm, temp: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Quick Prescription Section */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                تحرير وصفة دوائية إلكترونية (تظهر للمريض فورياً)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="اسم الدواء (مثل: Amlodipine)"
                  value={consultationForm.prescriptionName}
                  onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionName: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="الجرعة (مثل: 5 mg)"
                  value={consultationForm.prescriptionDosage}
                  onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionDosage: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="التكرار (مرة يومياً صباحاً)"
                  value={consultationForm.prescriptionFreq}
                  onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionFreq: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="المدة (علاج مستمر / شهر)"
                  value={consultationForm.prescriptionDuration}
                  onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionDuration: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Quick Lab Request */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 space-y-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                طلب فحص مخبري للمريض
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="اسم الفحص (مثل: صورة دم CBC، فحص وظائف الكلى)"
                  value={consultationForm.labTestName}
                  onChange={(e) => setConsultationForm({ ...consultationForm, labTestName: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
                <select
                  value={consultationForm.labCategory}
                  onChange={(e) => setConsultationForm({ ...consultationForm, labCategory: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="كيمياء سريرية">كيمياء سريرية (Clinical Chemistry)</option>
                  <option value="أمراض الدم">أمراض الدم (Hematology)</option>
                  <option value="مناعة وأمصال">مناعة وأمصال (Immunology)</option>
                  <option value="طوارئ وعناية">طوارئ وغازات دم (Critical Care)</option>
                </select>
                <select
                  value={consultationForm.labPriority}
                  onChange={(e) => setConsultationForm({ ...consultationForm, labPriority: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="عادي">عادي (Routine)</option>
                  <option value="عاجل">عاجل (Urgent)</option>
                  <option value="حرج">طوارئ قصوى (Emergency)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewConsultationOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>
                اعتماد وحفظ السجل للمريض
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add New Patient Modal */}
      {newPatientModalOpen && (
        <Modal
          isOpen={newPatientModalOpen}
          onClose={() => setNewPatientModalOpen(false)}
          title="تسجيل مريض جديد وتوليد رقم الملف الطبي (MRN)"
        >
          <form onSubmit={handleAddPatientSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المريض الرباعي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: يوسف إبراهيم النجار"
                  value={newPatientForm.name}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهوية الوطنية (9 أرقام) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="401234567"
                  value={newPatientForm.nationalId}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, nationalId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  العمر (بالسنوات)
                </label>
                <input
                  type="number"
                  placeholder="35"
                  value={newPatientForm.age}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الجنس
                </label>
                <select
                  value={newPatientForm.gender}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  فصيلة الدم
                </label>
                <select
                  value={newPatientForm.bloodType}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, bloodType: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف للتواصل
                </label>
                <input
                  type="tel"
                  placeholder="0599123456"
                  value={newPatientForm.phone}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  العنوان السكني
                </label>
                <input
                  type="text"
                  placeholder="غزة - الرمال"
                  value={newPatientForm.address}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الأمراض المزمنة (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  placeholder="مثال: الضغط، السكري"
                  value={newPatientForm.chronicConditions}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, chronicConditions: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الحساسية المعروفة (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  placeholder="مثال: البنسلين، السلفا"
                  value={newPatientForm.allergies}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, allergies: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewPatientModalOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>
                تسجيل وحفظ المريض
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
