import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { patientService } from '../../services/patientService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { FlaskConical, PlusCircle, AlertTriangle, CheckCircle2, Clock, Search, Eye, Printer, Save } from 'lucide-react';

export const DoctorLaboratory = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [results, setResults] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderModal, setNewOrderModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const [orderForm, setOrderForm] = useState({
    patientId: '',
    patientName: '',
    patientMrn: '',
    testName: 'فحص وظائف الكبد (LFT)',
    category: 'كيمياء سريرية',
    sampleType: 'مصل الدم',
    priority: 'عادي',
    notes: 'متابعة دورية للإنزيمات والوظائف الحيوية'
  });

  const { addToast } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqRes, resRes, patientsRes] = await Promise.all([
        laboratoryService.getRequests(),
        laboratoryService.getResults(),
        patientService.getAll()
      ]);

      if (reqRes.success) setRequests(reqRes.data);
      if (resRes.success) setResults(resRes.data);
      if (patientsRes.success && patientsRes.data.length > 0) {
        setPatients(patientsRes.data);
        const firstP = patientsRes.data[0];
        setOrderForm(prev => ({
          ...prev,
          patientId: firstP.id,
          patientName: firstP.name,
          patientMrn: firstP.mrn
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    const p = patients.find(pat => pat.id === patientId);
    if (p) {
      setOrderForm(prev => ({
        ...prev,
        patientId: p.id,
        patientName: p.name,
        patientMrn: p.mrn
      }));
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...orderForm,
        doctorName: user?.fullName || user?.name || 'د. هالة منير النجار',
        hospital: user?.hospital || 'مجمع الشفاء الطبي',
        status: 'pending'
      };

      const res = await laboratoryService.createRequest(payload);
      if (res.success) {
        setRequests([res.data, ...requests]);
        setNewOrderModal(false);
        addToast({
          title: 'تم إرسال الطلب للمختبر بنجاح',
          message: `طلب الفحص (${orderForm.testName}) تم تسجيله للمريض ${orderForm.patientName}`,
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل إرسال طلب الفحص المخبري', type: 'error' });
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
            تتبع العينات المرسلة للمختبر واستعراض تقارير التحاليل الطبية المعتمدة ومؤشرات التنبيه
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
            <span>الطلبات قيد الفحص والتجهيز بالمختبر ({requests.length})</span>
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
                      المريض: {req.patientName} ({req.patientMrn}) • {req.requestedDate || req.date}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={req.priority === 'عاجل' || req.priority === 'urgent' || req.priority === 'حرج' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {req.priority || 'قيد الفحص'}
                </Badge>
              </Card>
            ))}

            {requests.length === 0 && (
              <Card className="p-8 text-center text-slate-400 text-xs">
                لا توجد طلبات معلقة قيد الفحص حالياً.
              </Card>
            )}
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
                <Card
                  key={res.id}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-sky-300 transition-all ${
                    res.isCritical ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20' : ''
                  }`}
                  onClick={() => setSelectedResult(res)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      res.isCritical
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                    }`}>
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {res.testName}
                        </h4>
                        {res.isCritical && (
                          <Badge variant="danger" size="sm">تنبيه حرج</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {res.patientName} • {res.completedDate} • {res.hospital}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" icon={Eye}>
                    عرض التقرير
                  </Button>
                </Card>
              );
            })}

            {results.length === 0 && (
              <Card className="p-8 text-center text-slate-400 text-xs">
                لا توجد تقارير مخبرية مكتملة بعد.
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* New Lab Order Modal */}
      {newOrderModal && (
        <Modal
          isOpen={newOrderModal}
          onClose={() => setNewOrderModal(false)}
          title="طلب فحص مخبري جديد"
        >
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اختر المريض <span className="text-rose-500">*</span>
                </label>
                <select
                  value={orderForm.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم الفحص المخبري <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فحص وظائف الكلى والشوارد"
                  value={orderForm.testName}
                  onChange={(e) => setOrderForm({ ...orderForm, testName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  القسم المخبري
                </label>
                <select
                  value={orderForm.category}
                  onChange={(e) => setOrderForm({ ...orderForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="كيمياء سريرية">كيمياء سريرية (Clinical Chemistry)</option>
                  <option value="أمراض الدم">أمراض الدم (Hematology)</option>
                  <option value="مناعة وأمصال">مناعة وأمصال (Immunology)</option>
                  <option value="طوارئ وعناية مركزة">طوارئ وعناية مركزة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نوع العينة
                </label>
                <input
                  type="text"
                  value={orderForm.sampleType}
                  onChange={(e) => setOrderForm({ ...orderForm, sampleType: e.target.value })}
                  placeholder="مصل الدم (Serum)"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  درجة الأولوية
                </label>
                <select
                  value={orderForm.priority}
                  onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="عادي">عادي (Routine)</option>
                  <option value="عاجل">عاجل (Urgent)</option>
                  <option value="حرج">طوارئ قصوى (Emergency)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                دواعي الفحص والملاحظات الإكلينيكية
              </label>
              <textarea
                rows={2}
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                placeholder="سجل أي ملاحظات خاصة للمختبر..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewOrderModal(false)}>
                إلغاء
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>
                إرسال الطلب للمختبر
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Result Detail Modal */}
      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title={`تقرير التحليل المخبري: ${selectedResult.testName}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedResult.patientName}</h4>
                <p className="text-slate-400 font-mono">الباركود: {selectedResult.barcode || 'BC-901-8842'} • الملف: {selectedResult.patientMrn}</p>
                <p className="text-slate-500 mt-0.5">المستشفى: {selectedResult.hospital} • الفني: {selectedResult.analystName}</p>
              </div>
              <Badge variant={selectedResult.isCritical ? 'danger' : 'success'} size="md">
                {selectedResult.isCritical ? 'نتيجة حرجة' : 'معتمد'}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="py-2">المؤشر المخبري</th>
                    <th className="py-2">النتيجة</th>
                    <th className="py-2">الوحدة</th>
                    <th className="py-2">المعدل الطبيعي</th>
                    <th className="py-2">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedResult.parameters?.map((p, idx) => (
                    <tr key={idx} className={p.status === 'critical' ? 'bg-rose-50/50 dark:bg-rose-950/20 font-bold text-rose-600' : ''}>
                      <td className="py-2.5">{p.name}</td>
                      <td className="py-2.5 font-bold font-mono">{p.value}</td>
                      <td className="py-2.5 text-slate-400 font-mono">{p.unit}</td>
                      <td className="py-2.5 text-slate-400 font-mono">{p.normalRange}</td>
                      <td className="py-2.5">
                        <Badge
                          variant={p.status === 'critical' ? 'danger' : p.status === 'warning' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {p.status === 'critical' ? 'حرج' : p.status === 'warning' ? 'تنبيه' : 'طبيعي'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedResult.notes && (
              <div className="p-3 bg-sky-50/60 dark:bg-sky-950/30 rounded-xl text-xs text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40">
                <span className="font-bold">ملاحظات المختبر: </span>
                {selectedResult.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedResult(null)}>
                إغلاق
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                طباعة التقرير
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
