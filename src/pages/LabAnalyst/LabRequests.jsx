import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { FlaskConical, CheckCircle2, Clock, PlusCircle, Search, Save, AlertTriangle, Printer } from 'lucide-react';

export const LabRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [entryModalOpen, setEntryModalOpen] = useState(false);

  const [parameters, setParameters] = useState([
    { name: 'Hemoglobin (Hb)', value: '14.2', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'normal' },
    { name: 'WBC (كريات الدم البيضاء)', value: '7.8', unit: 'x10^3/uL', normalRange: '4.0 - 11.0', status: 'normal' },
    { name: 'Platelets (الصفائح)', value: '250', unit: 'x10^3/uL', normalRange: '150 - 450', status: 'normal' }
  ]);

  const [notes, setNotes] = useState('النتائج ضمن الحدود السريرية الطبيعية.');
  const { addToast } = useNotification();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await laboratoryService.getLabRequests();
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEntry = (req) => {
    setSelectedReq(req);
    setEntryModalOpen(true);
  };

  const handleParamChange = (index, field, val) => {
    const updated = [...parameters];
    updated[index][field] = val;
    setParameters(updated);
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientName: selectedReq.patientName,
        patientMrn: selectedReq.patientMrn,
        testName: selectedReq.testName,
        doctorName: selectedReq.doctorName,
        analystName: 'د. إياد كمال البردويل',
        hospital: selectedReq.hospital,
        parameters: parameters,
        notes: notes
      };

      const res = await laboratoryService.submitLabResult(payload);
      if (res.success) {
        // remove from pending requests list
        setRequests(requests.filter(r => r.id !== selectedReq.id));
        setEntryModalOpen(false);
        addToast({
          title: 'تم اعتماد وإصدار النتيجة',
          message: 'تم ترحيل التقرير المخبري إلى السجل الطبي للمريض بنجاح',
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل حفظ نتيجة الفحص', type: 'error' });
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            طلبات الفحص المخبري الواردة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            استلام العينات، مطابقة الباركود، وإدخال النتائج البيوكيميائية والدموية
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((req) => (
          <Card key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-mono shrink-0">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {req.testName}
                  </h4>
                  <Badge variant={req.priority === 'urgent' ? 'danger' : 'warning'} size="sm">
                    {req.priority === 'urgent' ? 'عاجل STAT' : 'روتيني'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  المريض: <strong className="text-slate-700 dark:text-slate-300">{req.patientName}</strong> ({req.patientMrn}) • الطبيب الطالب: {req.doctorName}
                </p>
                <div className="text-[11px] text-slate-500 mt-1">
                  المستشفى: {req.hospital} • تاريخ الطلب: {req.date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={PlusCircle}
                onClick={() => handleOpenEntry(req)}
              >
                إدخال وقيد النتيجة
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Result Entry Modal */}
      {entryModalOpen && selectedReq && (
        <Modal
          isOpen={entryModalOpen}
          onClose={() => setEntryModalOpen(false)}
          title={`إدخال نتائج فحص: ${selectedReq.testName} للمريض ${selectedReq.patientName}`}
        >
          <form onSubmit={handleSaveResult} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <p><strong>المريض:</strong> {selectedReq.patientName} (ملف: {selectedReq.patientMrn})</p>
              <p><strong>الطبيب المعالج:</strong> {selectedReq.doctorName}</p>
            </div>

            {/* Parameters Table Inputs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                المؤشرات والنتائج (Parameters)
              </label>

              {parameters.map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">اسم المؤشر</span>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleParamChange(idx, 'name', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">النتيجة المقاسة</span>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => handleParamChange(idx, 'value', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-900 font-mono font-bold text-sky-600"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">الوحدة والمعدل</span>
                      <input
                        type="text"
                        value={p.unit}
                        onChange={(e) => handleParamChange(idx, 'unit', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">الحالة</span>
                      <select
                        value={p.status}
                        onChange={(e) => handleParamChange(idx, 'status', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-900"
                      >
                        <option value="normal">طبيعي (Normal)</option>
                        <option value="high">مرتفع (High)</option>
                        <option value="low">منخفض (Low)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">الملاحظات التشخيصية للمحلل</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setEntryModalOpen(false)}>إلغاء</Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>اعتماد وترحيل النتيجة</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
