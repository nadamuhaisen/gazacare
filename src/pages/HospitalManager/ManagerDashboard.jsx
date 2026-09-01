import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospitalService';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Building2,
  Users,
  Bed,
  Stethoscope,
  Activity,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useNavigate, Link } from 'react-router-dom';

export const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statRes, deptRes, docRes] = await Promise.all([
          hospitalService.getHospitalStats(),
          hospitalService.getDepartments(),
          hospitalService.getDoctors()
        ]);
        if (statRes.success) setStats(statRes.data);
        if (deptRes.success) setDepartments(deptRes.data);
        if (docRes.success) setDoctors(docRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  const statCards = [
    { label: 'إجمالي الأسرّة المتاحة', value: stats?.beds?.total || 450, sub: `المشغول: ${stats?.beds?.occupied || 410} سرير`, icon: Bed, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50' },
    { label: 'نسبة الإشغال الإجمالية', value: `${stats?.beds?.occupancyRate || 91.1}%`, sub: 'إشغال حرج في الطوارئ والعناية', icon: TrendingUp, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
    { label: 'الكادر الطبي والمناوبين', value: stats?.staff?.doctors || 68, sub: `ممرضون: ${stats?.staff?.nurses || 140}`, icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'دخول الطوارئ اليوم', value: stats?.emergencyIntakeToday || 84, sub: 'منذ الساعة 00:00', icon: Activity, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' }
  ];

  const occupancyTrend = [
    { day: 'السبت', rate: 88, intake: 72 },
    { day: 'الأحد', rate: 92, intake: 85 },
    { day: 'الإثنين', rate: 95, intake: 98 },
    { day: 'الثلاثاء', rate: 89, intake: 65 },
    { day: 'الأربعاء', rate: 91, intake: 79 },
    { day: 'الخميس', rate: 94, intake: 91 },
    { day: 'الجمعة', rate: 90, intake: 80 }
  ];

  const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Hospital Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-600/30 border border-sky-400/40 flex items-center justify-center text-white shrink-0">
              <Building2 className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  مجمع الشفاء الطبي - لوحة القيادة الإدارية
                </h1>
                <Badge variant="success" size="sm">النظام متصل</Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                الإشراف على السعة السريرية، الأقسام الطبية، وحركة المرضى في قطاع غزة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={Bed}
              onClick={() => navigate('/hospital-manager/beds')}
            >
              توزيع الأسرّة
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={TrendingUp}
              onClick={() => navigate('/hospital-manager/statistics')}
            >
              التحليلات الشاملة
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="p-4 flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {card.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {card.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {card.sub}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid: Occupancy Trend & Departments Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Occupancy Trend (8 cols) */}
        <Card className="lg:col-span-8 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                معدل إشغال الأسرّة وحالات الطوارئ الأسبوعي
              </h3>
              <p className="text-xs text-slate-400">متابعة الضغط السريري على مدار الـ 7 أيام الماضية</p>
            </div>
            <Badge variant="primary" size="sm">تحديث حي</Badge>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="rate" name="نسبة الإشغال %" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="intake" name="دخول الطوارئ" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Status Summary (4 cols) */}
        <Card className="lg:col-span-4 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              إشغال الأقسام الطبية
            </h3>
            <Link to="/hospital-manager/departments" className="text-xs font-bold text-sky-600 hover:underline">
              التفاصيل
            </Link>
          </div>

          <div className="space-y-3">
            {departments.map((dept) => {
              const percentage = Math.round((dept.occupiedBeds / dept.totalBeds) * 100);
              const isHigh = percentage > 90;
              return (
                <div key={dept.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{dept.name}</span>
                    <span className={isHigh ? 'text-rose-600' : 'text-slate-500'}>
                      {dept.occupiedBeds}/{dept.totalBeds} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isHigh ? 'bg-rose-500' : percentage > 75 ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* On-duty Doctors & Medical Staff Quick Look */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>الأطباء على رأس العمل والمناوبات الحالية</span>
          </h3>
          <Link to="/hospital-manager/doctors" className="text-xs font-bold text-sky-600 hover:underline">
            إدارة الكادر الطبي
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {doctors.slice(0, 3).map((doc) => (
            <div key={doc.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-sky-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                  <p className="text-[11px] text-slate-400">{doc.specialty}</p>
                </div>
              </div>
              <Badge variant={doc.status === 'on-duty' ? 'success' : 'default'} size="sm">
                {doc.status === 'on-duty' ? 'على رأس العمل' : 'في استراحة'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
