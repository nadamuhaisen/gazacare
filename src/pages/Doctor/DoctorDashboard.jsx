import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Users,
  Calendar,
  FlaskConical,
  FileText,
  Clock,
  AlertTriangle,
  ChevronLeft,
  Search,
  PlusCircle,
  Stethoscope,
  Activity,
  HeartPulse,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [dashRes, appRes, labRes] = await Promise.all([
          doctorService.getDashboard(),
          appointmentService.getAppointments(),
          laboratoryService.getLabRequests()
        ]);
        if (dashRes.success) setDashboardData(dashRes.data);
        if (appRes.success) setTodayAppointments(appRes.data);
        if (labRes.success) {
          const critical = labRes.data.filter(l => l.priority === 'urgent' || l.priority === 'emergency');
          setCriticalAlerts(critical);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  const stats = dashboardData?.stats || {
    totalPatients: 142,
    todayAppointments: 8,
    pendingLabResults: 5,
    criticalCases: 2
  };

  const statCards = [
    { label: 'إجمالي المرضى المسجلين', value: stats.totalPatients, icon: Users, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50' },
    { label: 'مواعيد العيادة اليوم', value: stats.todayAppointments, icon: Calendar, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'فحوصات بانتظار الاعتماد', value: stats.pendingLabResults, icon: FlaskConical, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { label: 'حالات حرجة تتطلب متابعة', value: stats.criticalCases, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' }
  ];

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80"}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-sky-400/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  أهلاً بك، {user?.name || 'د. يحيى خليل الأغا'}
                </h1>
                <Badge variant="primary" size="sm">استشاري معتمد</Badge>
              </div>
              <p className="text-xs sm:text-sm text-sky-200 mt-1">
                {user?.specialty || 'استشاري أمراض الباطنة والجهاز الهضمي'} • {user?.hospital || 'مجمع الشفاء الطبي'}
              </p>
              <div className="flex items-center gap-3 text-xs text-sky-300 pt-2">
                <span>العيادة الخارجية رقم 4</span>
                <span>•</span>
                <span>المناوبة الحالية: الصباحية (08:00 - 15:00)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={() => navigate('/doctor/prescriptions')}
            >
              تحرير وصفة جديدة
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={FlaskConical}
              onClick={() => navigate('/doctor/laboratory')}
            >
              طلب فحص مخبري
            </Button>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner if any */}
      {criticalAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                تنبيه سريري حرج: نتائج مخبرية تتطلب التدخل الفوري
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                وصلت نتائج فحص عاجل للمريض <strong>{criticalAlerts[0]?.patientName}</strong> من قسم الطوارئ.
              </p>
            </div>
          </div>
          <Link
            to="/doctor/laboratory"
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shrink-0"
          >
            معاينة النتيجة
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-4 flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Split: Today's Waiting Queue & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>قائمة الانتظار والمواعيد اليوم</span>
            </h3>
            <Link to="/doctor/appointments" className="text-xs font-bold text-sky-600 hover:underline">
              عرض الجدول الكامل
            </Link>
          </div>

          <div className="space-y-3">
            {todayAppointments.map((app) => (
              <Card key={app.id} className="p-4 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                    {app.time.split(' ')[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {app.patientName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      رقم الملف: {app.patientMrn || 'P-10492'} • الشكوى: {app.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/doctor/patients?mrn=${app.patientMrn || 'P-10492'}`)}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>بدء المعاينة</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Diagnoses (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>إجراءات سريرية سريعة</span>
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/doctor/patients')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950 text-right text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-sky-600 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>البحث في السجلات الطبية الوطنية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/doctor/prescriptions')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-right text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>إصدار وصفة دوائية فورية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/doctor/laboratory')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950 text-right text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>متابعة نتائج المختبر والأشعة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              بروتوكولات الأمان السريري
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              يرجى التأكد دائماً من مراجعة حساسية المريض وتفاعلات الأدوية السابقة قبل اعتماد أي وصفة جديدة.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
