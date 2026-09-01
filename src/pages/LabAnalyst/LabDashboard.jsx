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
  Activity,
  Cpu,
  TestTube2,
  Printer,
  BellRing,
  ArrowRight,
  Sparkles,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const LabDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [foundSample, setFoundSample] = useState(null);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const loadData = async () => {
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

  useEffect(() => {
    loadData();
  }, []);

  const handleScanSample = (e) => {
    e.preventDefault();
    if (!scannedBarcode.trim()) return;
    
    // search in requests or results
    const found = requests.find(r => 
      r.id.toLowerCase().includes(scannedBarcode.toLowerCase()) || 
      (r.barcode && r.barcode.toLowerCase().includes(scannedBarcode.toLowerCase())) ||
      r.patientName.includes(scannedBarcode) ||
      r.patientMrn.toLowerCase().includes(scannedBarcode.toLowerCase())
    );

    if (found) {
      setFoundSample(found);
      addToast({
        title: 'تم مسح وتحديد العينة',
        message: `العينة ${found.testName} للمريض ${found.patientName}`,
        type: 'success'
      });
    } else {
      addToast({
        title: 'رمز غير مسجل',
        message: 'لم يتم العثور على عينة مطابقة للرمز المدخل',
        type: 'warning'
      });
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  const statCards = [
    { label: 'فحوصات تم إنجازها اليوم', value: stats?.todayTests || 68, sub: 'بنسبة دقة 99.9%', icon: FileCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'عينات قيد التحليل والمعالجة', value: stats?.pendingTests || 8, sub: 'في أجهزة التحليل الآلي', icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { label: 'عينات عاجلة وطارئة (STAT)', value: stats?.urgentRequests || 3, sub: 'تتطلب نتيجة خلال 20 دقيقة', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
    { label: 'مؤشرات حرجة تم الإبلاغ عنها', value: stats?.criticalAlerts || 2, sub: 'تم إخطار الطبيب المعالج فوراً', icon: Activity, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' }
  ];

  const analyzers = [
    { name: 'Sysmex XN-1000', type: 'Hematology Analyzer (CBC)', status: 'يعمل بكفاءة', qc: 'معاير 100%', throughput: '45 عينة/ساعة', badge: 'success' },
    { name: 'Roche Cobas c311', type: 'Clinical Chemistry & Enzymes', status: 'يعمل بكفاءة', qc: 'معاير 100%', throughput: '32 عينة/ساعة', badge: 'success' },
    { name: 'Radiometer ABL90', type: 'Blood Gas & Critical ABG', status: 'جاهز للطوارئ', qc: 'معاير 98%', throughput: 'STAT جاهز', badge: 'primary' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-white shrink-0 shadow-inner">
              <FlaskConical className="w-9 h-9 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  مختبر التحاليل الطبية والباثولوجيا السريرية
                </h1>
                <Badge variant="success" size="sm">نظام التحليل الآلي LIS متصل</Badge>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
                استقبال العينات، فحص مؤشرات الدم والكيمياء الحيوية، وإصدار التقارير المعتمدة للسجل الموحد
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={QrCode}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => setScanModalOpen(true)}
            >
              مسح باركود العينة
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              className="bg-emerald-500 hover:bg-emerald-600 border-none text-white font-bold shadow-lg shadow-emerald-500/30"
              onClick={() => navigate('/lab-analyst/requests')}
            >
              إدخال نتيجة فحص
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="p-4.5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {card.value}
                </div>
                <div className="text-xs text-slate-500 font-bold">
                  {card.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {card.sub}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Critical Alert Bar if any */}
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900 dark:text-rose-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-bounce">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>تنبيه قيم حرجة (Panic Value Alert):</span>
              <span className="font-mono bg-rose-200 dark:bg-rose-900 px-2 py-0.5 rounded text-[11px] font-black">
                K+: 6.4 mmol/L | pH: 7.22
              </span>
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
              المريض زياد ناصر البطش (طوارئ) - تم إرسال إشعار فوري وتأكيد الاتصال بالدكتور إبراهيم القدوة
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          icon={PhoneCall}
          className="shrink-0 text-xs"
          onClick={() => addToast({ title: 'تم تأكيد الاتصال', message: 'تم إخطار طبيب الطوارئ المناوب بالنتيجة الحرجة', type: 'info' })}
        >
          تأكيد استلام الطبيب
        </Button>
      </div>

      {/* Analyzers Telemetry Section */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              حالة أجهزة التحليل المخبري الآلية وضبط الجودة (QC & Analyzers Telemetry)
            </h3>
          </div>
          <button 
            onClick={loadData}
            className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث القياسات</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyzers.map((an, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{an.name}</h4>
                  <p className="text-[11px] text-slate-400">{an.type}</p>
                </div>
                <Badge variant={an.badge} size="sm">{an.status}</Badge>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">معايرة الجودة: <strong className="text-emerald-600">{an.qc}</strong></span>
                <span className="text-slate-400 font-mono">{an.throughput}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Grid: Pending Queue & Recent Issued Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent & Pending Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>قائمة العينات بانتظار التحليل والإدخال ({requests.length})</span>
            </h3>
            <Link to="/lab-analyst/requests" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              <span>عرض الكل</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="space-y-3">
            {requests.slice(0, 4).map((req) => (
              <Card key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <TestTube2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {req.testName}
                      </h4>
                      <Badge variant={req.priority === 'عاجل' || req.priority === 'urgent' ? 'danger' : 'warning'} size="sm">
                        {req.priority === 'عاجل' || req.priority === 'urgent' ? 'طوارئ STAT' : 'روتيني'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      المريض: <strong className="text-slate-800 dark:text-slate-200">{req.patientName}</strong> ({req.patientId || req.patientMrn})
                    </p>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                      <span>الأنبوب: {req.sampleType || 'EDTA'}</span>
                      <span>•</span>
                      <span>الطبيب: {req.doctorName}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 font-bold"
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
              <span>آخر التقارير المخبرية المعتمدة</span>
            </h3>
            <Link to="/lab-analyst/results" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              <span>الأرشيف</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="space-y-3">
            {results.slice(0, 3).map((res) => (
              <Card key={res.id} className="p-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {res.testName}
                      </h4>
                      {res.isCritical && (
                        <Badge variant="danger" size="sm">قيمة حرجة</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {res.patientName} • {res.completedDate}
                    </p>
                  </div>
                  <Badge variant={res.isCritical ? 'danger' : 'success'} size="sm">
                    {res.isCritical ? 'حرج' : 'معتمد'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {res.parameters?.slice(0, 4).map((p, idx) => (
                    <div key={idx} className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex justify-between">
                      <span className="truncate text-slate-500">{p.name.split(' ')[0]}:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-mono">{res.barcode || res.id}</span>
                  <Link to="/lab-analyst/results" className="text-emerald-600 font-bold hover:underline">
                    معاينة التقرير
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {scanModalOpen && (
        <Modal
          isOpen={scanModalOpen}
          onClose={() => {
            setScanModalOpen(false);
            setFoundSample(null);
            setScannedBarcode('');
          }}
          title="محاكي ماسح باركود أنابيب العينات (Sample Tube Barcode Scanner)"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              قم بمسح أو إدخال رقم الباركود الخاص بأنبوبة التحليل أو رقم ملف المريض (مثال: BC-901-8842 أو P-10492 أو أحمد):
            </p>

            <form onSubmit={handleScanSample} className="flex gap-2">
              <input
                type="text"
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                placeholder="أدخل رمز الباركود أو رقم الملف..."
                className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-mono text-sm focus:border-emerald-500 focus:outline-none dark:text-white"
                autoFocus
              />
              <Button variant="primary" type="submit" icon={Search} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                فحص
              </Button>
            </form>

            {/* Presets to try */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-slate-400">أمثلة سريعة:</span>
              {['BC-901-8842', 'BC-903-7740', 'P-10492', 'P-10619'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setScannedBarcode(code)}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:bg-emerald-50 cursor-pointer"
                >
                  {code}
                </button>
              ))}
            </div>

            {foundSample && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">تم مطابقة العينة بنجاح</span>
                  </div>
                  <Badge variant="success" size="sm">جاهزة للتحليل</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>اسم الفحص:</strong> {foundSample.testName}</div>
                  <div><strong>المريض:</strong> {foundSample.patientName}</div>
                  <div><strong>رقم الملف:</strong> {foundSample.patientMrn || foundSample.patientId}</div>
                  <div><strong>الطبيب:</strong> {foundSample.doctorName}</div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    onClick={() => {
                      setScanModalOpen(false);
                      navigate('/lab-analyst/requests');
                    }}
                  >
                    الانتقال لإدخال النتائج
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

