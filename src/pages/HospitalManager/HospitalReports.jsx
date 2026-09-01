import React, { useState } from 'react';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { FileText, Download, Printer, Filter, Calendar, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const HospitalReports = () => {
  const { addToast } = useNotification();
  const [generating, setGenerating] = useState(false);

  const reports = [
    { title: 'تقرير الإشغال السريري الشامل', type: 'يومي', date: '2026-03-01', size: '1.4 MB', author: 'د. خالد النجار' },
    { title: 'إحصائية دخول الطوارئ والحوادث', type: 'أسبوعي', date: '2026-02-28', size: '2.8 MB', author: 'أ. حسام قاسم' },
    { title: 'تقرير استهلاك الأدوية والمستهلكات الطبية', type: 'شهري', date: '2026-02-20', size: '4.1 MB', author: 'د. صيدلي مروان علي' },
    { title: 'تقرير مؤشرات الأداء السريري ووفيات الأقسام', type: 'شهري', date: '2026-02-15', size: '980 KB', author: 'لجنة الجودة السريرية' }
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      addToast({
        title: 'تم توليد التقرير',
        message: 'تم استخراج وتجهيز ملف التقرير الطبي بنجاح بصيغة PDF',
        type: 'success'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            التقارير الإدارية والسريرية المعتمدة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            توليد واستخراج التقارير الإحصائية الرسمية لوزارة الصحة والجهات الدولية
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={FileText}
          loading={generating}
          onClick={handleGenerate}
        >
          توليد تقرير إشغال جديد
        </Button>
      </div>

      <div className="space-y-3">
        {reports.map((rep, idx) => (
          <Card key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rep.title}</h4>
                  <Badge variant="primary" size="sm">{rep.type}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  تم الإصدار بواسطة: {rep.author} • التاريخ: {rep.date} • الحجم: {rep.size}
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
                onClick={() => addToast({ title: 'تحميل التقرير', message: 'جاري بدء تحميل الملف...', type: 'info' })}
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
