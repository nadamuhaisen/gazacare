import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { FlaskConical, PlusCircle, AlertTriangle, CheckCircle2, Clock, Search, Eye, Printer } from 'lucide-react';

export const DoctorLaboratory = () => {
  const [requests, setRequests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderModal, setNewOrderModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const [orderForm, setOrderForm] = useState({
    patientName: 'أحمد يوسف خليل',
    patientMrn: 'P-10492',
    testName: 'فحص وظائف الكبد (LFT)',
    priority: 'routine',
    notes: 'متابعة دورية للإنزيمات'
  });

  const { addToast } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqRes, resRes] = await Promise.all([
        laboratoryService.getLabRequests(),
        laboratoryService.getLabResults()
      ]);
      if (reqRes.success) setRequests(reqRes.data);
      if (resRes.success) setResults(resRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...orderForm,
        doctorName: 'د. يحيى خليل الأغا',
        hospital: 'مجمع الشفاء الطبي',
        status: 'pending'
      };
      const res = await laboratoryService.createLabRequest(payload);
      if (res.success) {
        setRequests([res.data, ...requests]);
        setNewOrderModal(false);
        addToast({
          title: 'تم إرسال الطلب للمختبر',
          message: `طلب الفحص (${orderForm.testName}) قيد المعالجة`,
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل إرسال طلب الفحص', type: 'error' });
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            طلبات ونتائج الفحوصات المخبرية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تتبع العينات المرسلة للمختبر واستعراض التقارير المخبرية المعتمدة فور صدورها
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setNewOrderModal(true)}
        >
          طلب فحص مخبري جديد
        </Button>
      </div>

      {/* Grid: Pending Orders & Approved Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests Column */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>الطلبات قيد الفحص بالمختبر ({requests.length})</span>
          </h3>

          <div className="space-y-3">
            {requests.map((req) => (
              <Card key={req.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {req.testName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      المريض: {req.patientName} ({req.patientMrn}) • {req.date}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={req.priority === 'urgent' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {req.priority === 'urgent' ? 'عاجل' : 'قيد الفحص'}
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Results Column */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>النتائج المعتمدة مؤخراً ({results.length})</span>
          </h3>

          <div className="space-y-3">
            {results.map((res) => {
              const hasAbnormal = res.parameters?.some(p => p.status !== 'normal');
              return (
                <Card key={res.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${hasAbnormal ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'}`}>
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {res.testName}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {res.patientName} • {res.completedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasAbnormal && (
                      <Badge variant="danger" size="sm">قيمة حرجة</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedResult(res)}
                    >
                      عرض
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Order Modal */}
      {newOrderModal && (
        <Modal
          isOpen={newOrderModal}
          onClose={() => setNewOrderModal(false)}
          title="إرسال طلب فحص مخبري"
        >
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المريض</label>
                <input
                  type="text"
                  required
                  value={orderForm.patientName}
                  onChange={(e) => setOrderForm({ ...orderForm, patientName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الملف (MRN)</label>
                <input
                  type="text"
                  required
                  value={orderForm.patientMrn}
                  onChange={(e) => setOrderForm({ ...orderForm, patientMrn: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">نوع الفحص المطلوب</label>
                <input
                  type="text"
                  required
                  value={orderForm.testName}
                  onChange={(e) => setOrderForm({ ...orderForm, testName: e.target.value })}
                  placeholder="مثال: فحص السكر التراكمي HbA1c"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">درجة الأولوية</label>
                <select
                  value={orderForm.priority}
                  onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="routine">عادي (Routine)</option>
                  <option value="urgent">عاجل (Urgent)</option>
                  <option value="emergency">طوارئ (Emergency)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ملاحظات سريرية للمحلل المخبري</label>
              <textarea
                rows={2}
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewOrderModal(false)}>إلغاء</Button>
              <Button variant="primary" size="sm" type="submit">إرسال الطلب</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Result Detail Modal */}
      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title={`تقرير المختبر المعتمد: ${selectedResult.testName}`}
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

            {selectedResult.notes && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200">
                <strong>ملاحظة المحلل:</strong> {selectedResult.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedResult(null)}>إغلاق</Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>طباعة التقرير</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
