import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  PlusCircle,
  QrCode,
  Search,
  Eye,
  Activity
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const LabDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statRes, reqRes, resRes] = await Promise.all([
          laboratoryService.getLabStats(),
          laboratoryService.getLabRequests(),
          laboratoryService.getLabResults()
        ]);
        if (statRes.success) setStats(statRes.data);
        if (reqRes.success) setRequests(reqRes.data);
        if (resRes.success) setResults(resRes.data);
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
    { label: 'فحوصات تم إنجازها اليوم', value: stats?.todayTests || 64, sub: 'بنسبة دقة 99.8%', icon: FileCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'عينات قيد التحليل والمعالجة', value: stats?.pendingTests || 9, sub: 'في أجهزة التحليل الآلي', icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { label: 'عينات عاجلة وطارئة (STAT)', value: stats?.urgentRequests || 3, sub: 'تتطلب نتيجة خلال 30 دقيقة', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
    { label: 'مؤشرات حرجة تم الإبلاغ عنها', value: stats?.criticalAlerts || 2, sub: 'تم إخطار الطبيب المعالج', icon: Activity, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-white shrink-0">
              <FlaskConical className="w-9 h-9 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  مختبر التحاليل الطبية والباثولوجيا
                </h1>
                <Badge variant="success" size="sm">المحلل: د. إياد كمال البردويل</Badge>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                استقبال العينات، فحص المؤشرات الكيميائية والدموية، وإصدار التقارير المعتمدة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={() => navigate('/lab-analyst/requests')}
            >
              تسجيل نتيجة عينة
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

      {/* Grid: Pending Queue & Recent Issued Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent & Pending Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>عينات بانتظار الفحص وإدخال النتائج</span>
            </h3>
            <Link to="/lab-analyst/requests" className="text-xs font-bold text-sky-600 hover:underline">
              عرض كافة الطلبات
            </Link>
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <Card key={req.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {req.testName}
                      </h4>
                      <Badge variant={req.priority === 'urgent' ? 'danger' : 'warning'} size="sm">
                        {req.priority === 'urgent' ? 'طوارئ STAT' : 'عادي'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      المريض: {req.patientName} ({req.patientMrn}) • الطبيب: {req.doctorName}
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/lab-analyst/requests')}
                >
                  إدخال النتيجة
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Approved Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>آخر النتائج المعتمدة والمرحلة</span>
            </h3>
            <Link to="/lab-analyst/results" className="text-xs font-bold text-sky-600 hover:underline">
              الأرشيف الكامل
            </Link>
          </div>

          <div className="space-y-3">
            {results.map((res) => (
              <Card key={res.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {res.testName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {res.patientName} • {res.completedDate}
                    </p>
                  </div>
                  <Badge variant="success" size="sm">معتمد</Badge>
                </div>

                <div className="flex flex-wrap gap-1 text-[11px]">
                  {res.parameters?.slice(0, 2).map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {p.name}: {p.value} {p.unit}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
