import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { FlaskConical, Eye, Printer, Search, Download } from 'lucide-react';

export const LabResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);

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

  const filtered = results.filter(r =>
    r.patientName.includes(search) || r.testName.includes(search) || r.patientMrn.includes(search)
  );

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            أرشيف النتائج والتقارير المخبرية المعتمدة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            استعراض وطباعة التقارير الصادرة عن مختبر التحاليل الطبية
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المريض أو الفحص أو الملف..."
            className="w-full pr-10 pl-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((res) => (
          <Card key={res.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {res.testName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      المريض: {res.patientName} ({res.patientMrn})
                    </p>
                  </div>
                </div>
                <Badge variant="success" size="sm">معتمد</Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                {res.parameters?.map((p, idx) => (
                  <div key={idx} className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-bold">{p.name}</span>
                    <span className="font-mono text-sky-600 font-bold">{p.value} {p.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              className="w-full"
              onClick={() => setSelectedResult(res)}
            >
              معاينة التقرير والطباعة
            </Button>
          </Card>
        ))}
      </div>

      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title={`تقرير فحص مخبري: ${selectedResult.testName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between">
              <div><strong>المريض:</strong> {selectedResult.patientName} ({selectedResult.patientMrn})</div>
              <div><strong>التاريخ:</strong> {selectedResult.completedDate}</div>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="p-2">المؤشر</th>
                    <th className="p-2">النتيجة</th>
                    <th className="p-2">المعدل الطبيعي</th>
                    <th className="p-2">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedResult.parameters?.map((p, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold">{p.name}</td>
                      <td className="p-2 font-mono font-bold text-sky-600">{p.value} {p.unit}</td>
                      <td className="p-2 text-slate-400">{p.normalRange}</td>
                      <td className="p-2">
                        <Badge variant={p.status === 'normal' ? 'success' : 'danger'} size="sm">
                          {p.status === 'normal' ? 'طبيعي' : 'غير طبيعي'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedResult(null)}>إغلاق</Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>طباعة</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
