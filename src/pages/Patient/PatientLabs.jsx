import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { FlaskConical, AlertTriangle, CheckCircle2, Calendar, FileText, Printer, Download, Eye } from 'lucide-react';

export const PatientLabs = () => {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await laboratoryService.getLabResults();
        if (res.success) setLabResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            نتائج الفحوصات والتحاليل المخبرية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            أرشيف الفحوصات الصادرة مع المؤشرات الحيوية والقيم المرجعية الطبيعية
          </p>
        </div>
      </div>

      {/* Lab Results Table / Cards */}
      {labResults.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {labResults.map((lab) => {
            const hasAbnormal = lab.parameters?.some(p => p.status === 'high' || p.status === 'low');
            return (
              <Card key={lab.id} className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {lab.testName}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {lab.hospital} • {lab.completedDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant={hasAbnormal ? 'warning' : 'success'} size="sm">
                      {hasAbnormal ? 'يوجد قيم غير طبيعية' : 'سليم وطبيعي'}
                    </Badge>
                  </div>

                  {/* Parameters list preview */}
                  <div className="space-y-2">
                    {lab.parameters?.map((param, idx) => {
                      const isAbnormal = param.status !== 'normal';
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            isAbnormal
                              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{param.name}</span>
                            <span className="text-[10px] text-slate-400 block">
                              المعدل الطبيعي: {param.normalRange}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className={`font-mono font-bold ${isAbnormal ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                              {param.value} {param.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    className="w-full"
                    onClick={() => setSelectedLab(lab)}
                  >
                    معاينة التقرير المخبري الكامل
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">لا توجد تحاليل مخبرية مسجلة</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              حسابك الطبي جديد ولا يحتوي على فحوصات دم أو تحاليل سريرية مسجلة. ستظهر نتائج الفحوصات المخبرية هنا فور صدورها من المختبر المركزي.
            </p>
          </div>
        </Card>
      )}

      {/* Lab Report Detail Modal */}
      {selectedLab && (
        <Modal
          isOpen={!!selectedLab}
          onClose={() => setSelectedLab(null)}
          title={`تقرير فحص مخبري: ${selectedLab.testName}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <div className="flex justify-between">
                <span><strong>المريض:</strong> {selectedLab.patientName}</span>
                <span><strong>رقم الملف:</strong> {selectedLab.patientMrn}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>المختبر:</strong> {selectedLab.hospital}</span>
                <span><strong>تاريخ الفحص:</strong> {selectedLab.completedDate}</span>
              </div>
              <div><strong>المحلل المعتمد:</strong> {selectedLab.analystName}</div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5">المؤشر</th>
                    <th className="p-2.5">النتيجة</th>
                    <th className="p-2.5">المعدل الطبيعي</th>
                    <th className="p-2.5">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedLab.parameters?.map((p, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-bold">{p.name}</td>
                      <td className="p-2.5 font-mono font-bold text-sky-600">{p.value} {p.unit}</td>
                      <td className="p-2.5 text-slate-400">{p.normalRange}</td>
                      <td className="p-2.5">
                        <Badge variant={p.status === 'normal' ? 'success' : 'danger'} size="sm">
                          {p.status === 'normal' ? 'طبيعي' : (p.status === 'high' ? 'مرتفع' : 'منخفض')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedLab.notes && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs">
                <strong>ملاحظات المحلل السريري:</strong> {selectedLab.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedLab(null)}>إغلاق</Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>طباعة التقرير</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
