import React from 'react';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { FileText, Download, Printer, Filter, Calendar } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const LabReports = () => {
  const { addToast } = useNotification();

  const reports = [
    { title: 'تقرير مراقبة الجودة وضبط المعايرة (QC Report)', date: '2026-03-01', size: '2.1 MB', status: 'معتمد' },
    { title: 'إحصائية الفحوصات المخبرية الشهرية والتكاليف', date: '2026-02-28', size: '3.4 MB', status: 'معتمد' },
    { title: 'سجل العينات الحرجة والإبلاغ الفوري (Panic Values)', date: '2026-02-25', size: '1.2 MB', status: 'معتمد' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            تقارير ومؤشرات أداء المختبر الطبي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تقارير الجودة، حجم العمل المخبري، واستهلاك الكواشف والمحاليل
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((rep, idx) => (
          <Card key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rep.title}</h4>
                  <Badge variant="success" size="sm">{rep.status}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  التاريخ: {rep.date} • الحجم: {rep.size}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                طباعة
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => addToast({ title: 'تحميل التقرير', message: 'جاري تنزيل ملف التقرير...', type: 'info' })}
              >
                تنزيل PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
