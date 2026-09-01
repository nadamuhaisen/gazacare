import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { prescriptionService } from '../../services/prescriptionService';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { VitalSigns } from '../../components/common/VitalSigns';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar,
  Pill,
  FlaskConical,
  FileText,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  HeartPulse,
  PlusCircle,
  Download,
  Phone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [labResults, setLabResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, appRes, medRes, labRes] = await Promise.all([
        patientService.getProfile(),
        appointmentService.getAppointments(),
        patientService.getMedications(user?.id),
        laboratoryService.getLabResults()
      ]);

      if (profileRes.success) setPatientData(profileRes.data);
      if (appRes.success) setAppointments(appRes.data);
      if (medRes.success) setMedications(medRes.data);
      if (labRes.success) setLabResults(labRes.data);
    } catch (err) {
      console.error('Error loading patient dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVital = async (newVitalRecord) => {
    try {
      const res = await patientService.updateVitals(user?.id, newVitalRecord);
      if (res.success) {
        addToast({
          title: 'تم تسجيل المؤشرات الحيوية',
          message: 'تم حفظ القياسات وتحديث سجلك الصحي بنجاح',
          type: 'success'
        });
        setPatientData(prev => ({
          ...prev,
          vitalSigns: res.data
        }));
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل حفظ المؤشرات الحيوية', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const nextAppointment = appointments.find(a => a.status === 'confirmed' || a.status === 'scheduled');
  const activeMeds = medications.filter(m => m.status === 'active');
  const recentLabs = labResults.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={patientData?.avatar || user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
              alt={patientData?.name || user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  مرحباً، {patientData?.name || user?.fullName || user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  {patientData?.bloodType || 'O+'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-100 mt-1">
                رقم الملف الطبي الموحد (MRN): <span className="font-mono font-bold">{patientData?.mrn || 'P-10492'}</span> | {patientData?.age || 35} عاماً
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {patientData?.chronicConditions && patientData.chronicConditions.length > 0 ? (
                  patientData.chronicConditions.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/25 border border-amber-300/30 text-[11px] font-semibold text-amber-100">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-sky-200">سجل صحي نشط - بدون أمراض مزمنة</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="px-4 py-2.5 rounded-xl bg-white text-sky-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>حجز موعد عيادة</span>
            </button>
            <button
              onClick={() => navigate('/patient/profile')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
            >
              <span>الملف الطبي الكامل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Vital Signs Widget */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <span>المؤشرات والعلامات الحيوية</span>
          </h3>
          <span className="text-xs text-slate-400">
            {patientData?.vitalSigns?.history?.length > 0 ? 'متابعة المؤشرات في الوقت الفعلي' : 'مؤشرات مصفّرة - بانتظار تسجيل أول قراءة'}
          </span>
        </div>
        <VitalSigns
          vitals={patientData?.vitalSigns}
          showChart={true}
          onAddVital={handleSaveVital}
        />
      </div>

      {/* Middle Grid: Next Appointment, Active Meds, Recent Labs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Appointment Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">الموعد القادم</h4>
              </div>
              <Badge variant="primary" size="sm">مؤكد</Badge>
            </div>

            {nextAppointment ? (
              <div className="py-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {nextAppointment.doctorName}
                    </h5>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                      {nextAppointment.specialty}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextAppointment.date} - الساعة {nextAppointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextAppointment.hospital} - {nextAppointment.clinic}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                لا توجد مواعيد قادمة مجدولة حالياً.
              </div>
            )}
          </div>

          <Link
            to="/patient/appointments"
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 hover:text-sky-600 text-xs font-bold text-center flex items-center justify-center gap-1 transition-colors"
          >
            <span>إدارة المواعيد والحجوزات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </Card>

        {/* Active Medications Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">الأدوية الموصوفة</h4>
              </div>
              <Badge variant="success" size="sm">{activeMeds.length} أدوية نشطة</Badge>
            </div>

            <div className="py-3 space-y-2.5">
              {activeMeds.length > 0 ? (
                activeMeds.slice(0, 3).map((med) => (
                  <div
                    key={med.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {med.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {med.dosage} - {med.frequency}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                      {med.duration}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  لا توجد أدوية أو علاجات موصوفة حالياً.
                </div>
              )}
            </div>
          </div>

          <Link
            to="/patient/medications"
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-bold text-center flex items-center justify-center gap-1 transition-colors"
          >
            <span>عرض جدول الأدوية والوصفات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </Card>

        {/* Recent Lab Results Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">نتائج الفحوصات</h4>
              </div>
              <Badge variant="warning" size="sm">{recentLabs.length} فحوصات</Badge>
            </div>

            <div className="py-3 space-y-2.5">
              {recentLabs.length > 0 ? (
                recentLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {lab.testName}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lab.hospital} • {lab.completedDate}
                      </p>
                    </div>
                    <Badge variant="success" size="sm">معتمد</Badge>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  لا توجد نتائج فحوصات مسجلة في ملفك حتى الآن.
                </div>
              )}
            </div>
          </div>

          <Link
            to="/patient/labs"
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-700 dark:text-slate-300 hover:text-amber-600 text-xs font-bold text-center flex items-center justify-center gap-1 transition-colors"
          >
            <span>استعراض كافة التحاليل والتقارير</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </div>

      {/* Allergies & Emergency Contact Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200">
              الحساسيات المسجلة في السجل الطبي:
            </h5>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {patientData?.allergies && patientData.allergies.length > 0 ? (
                patientData.allergies.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 text-xs font-semibold">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">لا توجد حساسيات مسجلة (الملف سليم)</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                جهة الاتصال في حالات الطوارئ
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {patientData?.emergencyContact?.name || 'لم يُحدد بعد'} ({patientData?.emergencyContact?.relation || '---'})
              </p>
            </div>
          </div>
          {patientData?.emergencyContact?.phone && patientData.emergencyContact.phone !== '---' && (
            <a
              href={`tel:${patientData.emergencyContact.phone}`}
              className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
            >
              اتصال فوري
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
