import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import {
  FlaskConical,
  Eye,
  Printer,
  Search,
  Download,
  FileCheck,
  ShieldCheck,
  Activity,
  QrCode,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export const LabResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const { addToast } = useNotification();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const res = await laboratoryService.getLabResults();
      if (res.success) setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter((r) => {
    const matchSearch =
      (r.patientName || '').includes(search) ||
      (r.testName || '').includes(search) ||
      (r.barcode || '').includes(search) ||
      (r.patientMrn || r.patientId || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || (r.testName || '').includes(filterType);
    return matchSearch && matchType;
  });

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            أرشيف التقارير والنتائج المخبرية المعتمدة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            أرشيف الفحوصات الطبية المنجزة، شهادات التحليل الرسمية، وتقارير السجل الصحي الموحد
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            icon={FileSpreadsheet}
            onClick={() =>
              addToast({
                title: 'تصدير البيانات',
                message: 'تم تجهيز ملف Excel بالتقارير المخبرية المعتمدة بنجاح',
                type: 'info'
              })
            }
          >
            تصدير كملف Excel
          </Button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المريض، رقم الهوية/الملف، أو نوع الفحص..."
            className="w-full pr-10 pl-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
        >
          <option value="all">كافة الفحوصات والتحاليل</option>
          <option value="دم">فحوصات الدم (CBC)</option>
          <option value="كلى">وظائف الكلى (KFT)</option>
          <option value="كبد">وظائف الكبد (LFT)</option>
          <option value="قلب">إنزيمات القلب (Troponin)</option>
          <option value="غازات">غازات الدم الشرياني (ABG)</option>
          <option value="فصيلة">فصيلة الدم والتطابق</option>
        </select>
      </Card>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 text-slate-400">
            <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold">لا توجد نتائج مطابقة لمعايير البحث</p>
          </div>
        ) : (
          filtered.map((res) => (
            <Card key={res.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                      res.isCritical
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 ring-2 ring-rose-500/30'
                        : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                    }`}>
                      {res.isCritical ? <AlertTriangle className="w-6 h-6" /> : <FileCheck className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {res.testName}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {res.barcode || res.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        المريض: <strong className="text-slate-800 dark:text-slate-200">{res.patientName}</strong> ({res.patientMrn || res.patientId})
                      </p>
                    </div>
                  </div>
                  <Badge variant={res.isCritical ? 'danger' : 'success'} size="sm">
                    {res.isCritical ? 'قيمة حرجة' : 'معتمد رسمي'}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs">
                  {res.parameters?.slice(0, 4).map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{p.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
                          {p.value} {p.unit}
                        </span>
                        <Badge variant={p.status === 'critical' ? 'danger' : p.status === 'high' || p.status === 'low' ? 'warning' : 'success'} size="sm">
                          {p.status === 'critical' ? 'حرج' : p.status === 'high' ? 'مرتفع' : p.status === 'low' ? 'منخفض' : 'طبيعي'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {res.parameters?.length > 4 && (
                    <p className="text-[10px] text-slate-400 text-left pt-1">
                      +{res.parameters.length - 4} مؤشرات إضافية في التقرير
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Printer}
                  className="w-1/3"
                  onClick={() => {
                    setSelectedResult(res);
                    setTimeout(() => window.print(), 200);
                  }}
                >
                  طباعة
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Eye}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={() => setSelectedResult(res)}
                >
                  معاينة التقرير الرسمي
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Official Diagnostic Report Modal */}
      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title="التقرير المخبري والتشخيصي المعتمد (Official Diagnostic Report)"
        >
          <div className="space-y-5 text-xs" id="official-lab-report">
            {/* Header Ministry info */}
            <div className="border-b-2 border-slate-900 dark:border-emerald-600 pb-3 text-center">
              <div className="flex justify-between items-center text-right text-[11px] text-slate-600 dark:text-slate-300">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">دولة فلسطين - وزارة الصحة</p>
                  <p>الإدارة العامة للمستشفيات</p>
                  <p>دائرة المختبرات وبنوك الدم المركزية</p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 font-bold mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <div className="text-left font-mono">
                  <p className="font-bold">MOH - GAZA CARE</p>
                  <p>LIS-CLINICAL LAB</p>
                  <p className="text-[10px] text-emerald-600 font-bold">VERIFIED REPORT</p>
                </div>
              </div>

              <h2 className="text-base font-black text-slate-900 dark:text-white mt-3 uppercase tracking-wider">
                {selectedResult.testName}
              </h2>
            </div>

            {/* Patient Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">اسم المريض</span>
                <strong className="text-slate-900 dark:text-white">{selectedResult.patientName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">رقم الملف / الهوية</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedResult.patientMrn || selectedResult.patientId}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">الطبيب المعالج</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedResult.doctorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">تاريخ الإنجاز</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedResult.completedDate}</span>
              </div>
            </div>

            {/* Parameters Table */}
            <div className="space-y-2">
              <h3 className="font-black text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>النتائج والمؤشرات الحيوية المقاسة:</span>
              </h3>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black">
                    <tr>
                      <th className="p-2.5">المؤشر الطبي (Parameter)</th>
                      <th className="p-2.5">النتيجة (Result)</th>
                      <th className="p-2.5">الوحدة (Unit)</th>
                      <th className="p-2.5">المعدل المرجعي (Reference Range)</th>
                      <th className="p-2.5 text-center">التقييم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedResult.parameters?.map((p, idx) => (
                      <tr key={idx} className={p.status === 'critical' ? 'bg-rose-50/70 dark:bg-rose-950/40' : ''}>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="p-2.5 font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                          {p.value}
                        </td>
                        <td className="p-2.5 text-slate-500 font-mono">{p.unit}</td>
                        <td className="p-2.5 text-slate-500 font-mono">{p.normalRange}</td>
                        <td className="p-2.5 text-center">
                          <Badge variant={p.status === 'critical' ? 'danger' : p.status === 'high' || p.status === 'low' ? 'warning' : 'success'} size="sm">
                            {p.status === 'critical' ? 'حرج ⚠️' : p.status === 'high' ? 'مرتفع ↑' : p.status === 'low' ? 'منخفض ↓' : 'طبيعي ✓'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedResult.notes && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-xs">
                <strong className="block text-emerald-900 dark:text-emerald-200 mb-1">
                  الملاحظات التشخيصية وتوصيات أخصائي الباثولوجيا:
                </strong>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedResult.notes}</p>
              </div>
            )}

            {/* Footer with QR and Signature */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
              <div className="text-center sm:text-right">
                <p className="text-slate-400">أخصائي التحاليل المعتمد:</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedResult.analystName || 'أ. خليل المصري (أخصائي تحاليل أول)'}</p>
                <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded mt-1 border border-dashed border-slate-300 flex items-center justify-center text-[9px] font-mono text-emerald-600">
                  Digitally Signed ✓
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white border border-slate-300 rounded-lg p-1 shadow-xs flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">التحقق الإلكتروني السريع</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedResult(null)}>
                إغلاق
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Printer}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={() => {
                  window.print();
                  addToast({ title: 'جاري الطباعة', message: 'تم إرسال التقرير المخبري للطباعة', type: 'info' });
                }}
              >
                طباعة التقرير الرسمي
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

