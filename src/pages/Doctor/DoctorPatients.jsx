import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { prescriptionService } from '../../services/prescriptionService';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { VitalSigns } from '../../components/common/VitalSigns';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
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
  X
} from 'lucide-react';

export const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, vitals, history, newConsultation
  const [newConsultationOpen, setNewConsultationOpen] = useState(false);
  const [newPatientModalOpen, setNewPatientModalOpen] = useState(false);

  // Consultation form state
  const [consultationForm, setConsultationForm] = useState({
    diagnosis: '',
    notes: '',
    prescriptionName: '',
    prescriptionDosage: '',
    prescriptionFreq: '',
    labTestName: '',
    labPriority: 'routine'
  });

  const { addToast } = useNotification();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getPatients();
      if (res.success) {
        setPatients(res.data);
        if (res.data.length > 0 && !selectedPatient) {
          setSelectedPatient(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nationalId.includes(searchQuery)
  );

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!consultationForm.diagnosis) {
      addToast({ title: 'تنبيه', message: 'يرجى كتابة التشخيص السريري', type: 'warning' });
      return;
    }

    try {
      // Add consultation note to patient visits
      const newVisit = {
        id: `v-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        doctorName: 'د. يحيى خليل الأغا',
        department: 'عيادة الباطنة التخصصية',
        hospital: 'مجمع الشفاء الطبي',
        diagnosis: consultationForm.diagnosis,
        notes: consultationForm.notes
      };

      if (consultationForm.prescriptionName) {
        await prescriptionService.createPrescription({
          patientName: selectedPatient.name,
          patientMrn: selectedPatient.mrn,
          doctorName: 'د. يحيى خليل الأغا',
          hospital: 'مجمع الشفاء الطبي',
          diagnosis: consultationForm.diagnosis,
          medicines: [{
            name: consultationForm.prescriptionName,
            dosage: consultationForm.prescriptionDosage || '500mg',
            frequency: consultationForm.prescriptionFreq || 'مرتين يومياً',
            duration: '7 أيام',
            instructions: 'بعد الأكل'
          }]
        });
      }

      if (consultationForm.labTestName) {
        await laboratoryService.createLabRequest({
          patientName: selectedPatient.name,
          patientMrn: selectedPatient.mrn,
          doctorName: 'د. يحيى خليل الأغا',
          hospital: 'مجمع الشفاء الطبي',
          testName: consultationForm.labTestName,
          priority: consultationForm.labPriority
        });
      }

      addToast({
        title: 'تم حفظ الكشف الطبي',
        message: 'تم تحديث السجل الطبي وإصدار الأوامر بنجاح',
        type: 'success'
      });

      setNewConsultationOpen(false);
      setConsultationForm({
        diagnosis: '',
        notes: '',
        prescriptionName: '',
        prescriptionDosage: '',
        prescriptionFreq: '',
        labTestName: '',
        labPriority: 'routine'
      });
    } catch {
      addToast({ title: 'خطأ', message: 'فشل حفظ الكشف', type: 'error' });
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
            فحص وتدوين التاريخ الطبي والمؤشرات الحيوية وإصدار الوصفات والطلبات المخبرية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setNewPatientModalOpen(true)}
          >
            إضافة مريض جديد
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
              placeholder="بحث بالاسم، الهوية، أو رقم الملف..."
              className="w-full pr-10 pl-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-0.5">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 shadow-xs'
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
                          {patient.mrn} • {patient.age} سنة
                        </span>
                      </div>
                    </div>
                    <Badge variant={patient.status === 'urgent' ? 'danger' : 'primary'} size="sm">
                      {patient.bloodType}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.chronicConditions?.slice(0, 2).map((c, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {c}
                      </span>
                    ))}
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
                    src={selectedPatient.avatar}
                    alt={selectedPatient.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/30 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedPatient.name}
                      </h3>
                      <Badge variant="primary" size="md">{selectedPatient.bloodType}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      الهوية: {selectedPatient.nationalId} | الملف: {selectedPatient.mrn} | {selectedPatient.phone}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      العنوان: {selectedPatient.address}
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  icon={Stethoscope}
                  onClick={() => setNewConsultationOpen(true)}
                >
                  تدوين كشف / وصفة
                </Button>
              </div>

              {/* Allergies and Warnings Bar */}
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    تنبيه الحساسية:
                  </span>
                  <div className="flex gap-1.5">
                    {selectedPatient.allergies?.map((a, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-semibold">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">آخر فحص: اليوم</span>
              </div>

              {/* Vitals Overview */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  العلامات الحيوية الأخيرة
                </h4>
                <VitalSigns vitals={selectedPatient.vitalSigns} showChart={false} compact={true} />
              </div>

              {/* Visits & Diagnoses History */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  سجل الزيارات والتشخيصات السابقة
                </h4>
                <div className="space-y-2.5">
                  {selectedPatient.visitsHistory?.map((visit, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{visit.diagnosis}</span>
                        <span className="text-slate-400 font-mono">{visit.date}</span>
                      </div>
                      <p className="text-xs text-slate-500">{visit.notes}</p>
                      <div className="text-[11px] text-sky-600 font-medium">
                        {visit.doctorName} • {visit.hospital}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-12 text-center text-slate-400">اختر مريضاً لعرض سجله الطبي.</div>
          )}
        </div>
      </div>

      {/* New Consultation & Prescription Modal */}
      {newConsultationOpen && selectedPatient && (
        <Modal
          isOpen={newConsultationOpen}
          onClose={() => setNewConsultationOpen(false)}
          title={`تدوين كشف سريري للمريض: ${selectedPatient.name}`}
        >
          <form onSubmit={handleSaveConsultation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">التشخيص السريري (Diagnosis)</label>
              <input
                type="text"
                required
                value={consultationForm.diagnosis}
                onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
                placeholder="مثال: التهاب حاد في المعدة والأمعاء"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الملاحظات الطبية والتوصيات السريرية</label>
              <textarea
                rows={3}
                value={consultationForm.notes}
                onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })}
                placeholder="سجل ملاحظات الفحص السريري، الأعراض، وخطة العلاج..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Quick Prescription Section */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                إضافة وصفة دوائية فورية (اختياري)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="اسم الدواء (مثل: Amoxicillin)"
                  value={consultationForm.prescriptionName}
                  onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionName: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="الجرعة (500mg)"
                  value={consultationForm.prescriptionDosage}
                  onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionDosage: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="التكرار (3 مرات يومياً)"
                  value={consultationForm.prescriptionFreq}
                  onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionFreq: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Quick Lab Request */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5" />
                طلب فحص مخبري عاجل (اختياري)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="نوع الفحص (مثل: صورة دم كاملة CBC)"
                  value={consultationForm.labTestName}
                  onChange={(e) => setConsultationForm({ ...consultationForm, labTestName: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
                <select
                  value={consultationForm.labPriority}
                  onChange={(e) => setConsultationForm({ ...consultationForm, labPriority: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="routine">روتيني (Routine)</option>
                  <option value="urgent">عاجل (Urgent)</option>
                  <option value="emergency">طوارئ قصوى (Emergency)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewConsultationOpen(false)}>إلغاء</Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>اعتماد وحفظ السجل</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
