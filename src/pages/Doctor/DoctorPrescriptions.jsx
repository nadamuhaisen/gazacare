import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { FileText, PlusCircle, QrCode, Printer, User, Calendar, Trash2, Save } from 'lucide-react';

export const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [form, setForm] = useState({
    patientName: 'أحمد يوسف خليل',
    patientMrn: 'P-10492',
    diagnosis: '',
    medicines: [
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]
  });

  const { addToast } = useNotification();

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await prescriptionService.getPrescriptions();
      if (res.success) setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicineRow = () => {
    setForm({
      ...form,
      medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const handleRemoveMedicineRow = (index) => {
    setForm({
      ...form,
      medicines: form.medicines.filter((_, i) => i !== index)
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...form.medicines];
    updated[index][field] = value;
    setForm({ ...form, medicines: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.diagnosis) {
      addToast({ title: 'تنبيه', message: 'يرجى كتابة التشخيص', type: 'warning' });
      return;
    }

    try {
      const payload = {
        ...form,
        doctorName: 'د. يحيى خليل الأغا',
        hospital: 'مجمع الشفاء الطبي',
        status: 'active'
      };
      const res = await prescriptionService.createPrescription(payload);
      if (res.success) {
        setPrescriptions([res.data, ...prescriptions]);
        setNewModalOpen(false);
        addToast({
          title: 'تم إصدار الوصفة بنجاح',
          message: `رقم الوصفة: ${res.data.prescriptionNumber}`,
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل إصدار الوصفة', type: 'error' });
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            الوصفات الطبية الإلكترونية الصادرة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            إصدار ومتابعة الوصفات الدوائية المشفرة برمز الاستجابة السريع للربط مع الصيدليات
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setNewModalOpen(true)}
        >
          تحرير وصفة جديدة
        </Button>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.map((rx) => (
          <Card key={rx.id} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-mono font-bold">
                  Rx
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rx.patientName}
                    </h4>
                    <span className="text-xs font-mono text-slate-400">({rx.patientMrn})</span>
                    <Badge variant={rx.status === 'active' ? 'success' : 'default'} size="sm">
                      {rx.status === 'active' ? 'نشطة وصالحة للصرف' : 'تم الصرف'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    التشخيص: {rx.diagnosis} • رقم الوصفة: <span className="font-mono font-bold text-sky-600">{rx.prescriptionNumber}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={QrCode}
                  onClick={() => setSelectedPrescription(rx)}
                >
                  معاينة وطباعة
                </Button>
              </div>
            </div>

            {/* Medicines in prescription */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {rx.medicines?.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{m.name}</span>
                    <span className="text-emerald-600">{m.dosage}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.frequency} • {m.duration}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* New Prescription Creator Modal */}
      {newModalOpen && (
        <Modal
          isOpen={newModalOpen}
          onClose={() => setNewModalOpen(false)}
          title="تحرير وصفة طبية جديدة"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المريض</label>
                <input
                  type="text"
                  required
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الملف (MRN)</label>
                <input
                  type="text"
                  required
                  value={form.patientMrn}
                  onChange={(e) => setForm({ ...form, patientMrn: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">التشخيص الطبي</label>
              <input
                type="text"
                required
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="التشخيص المقترن بهذه الوصفة"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Medicines Builder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">قائمة الأدوية الموصوفة</label>
                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  إضافة دواء آخر
                </button>
              </div>

              {form.medicines.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">الدواء #{idx + 1}</span>
                    {form.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(idx)}
                        className="text-rose-500 hover:text-rose-700 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="اسم الدواء"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الجرعة (مثال: 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="التكرار (مرتين يومياً)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="المدة (7 أيام)"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewModalOpen(false)}>إلغاء</Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>اعتماد وتوليد الرمز</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Preview Modal */}
      {selectedPrescription && (
        <Modal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          title="معاينة الوصفة المعتمدة"
        >
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4">
            <div className="flex justify-between border-b pb-2 text-xs">
              <div>
                <strong>دولة فلسطين - وزارة الصحة</strong>
                <p className="text-slate-400">{selectedPrescription.hospital}</p>
              </div>
              <div className="font-mono text-left">
                <strong>{selectedPrescription.prescriptionNumber}</strong>
                <p className="text-slate-400">{selectedPrescription.date}</p>
              </div>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <p><strong>المريض:</strong> {selectedPrescription.patientName} ({selectedPrescription.patientMrn})</p>
              <p><strong>التشخيص:</strong> {selectedPrescription.diagnosis}</p>
            </div>

            <div className="space-y-1.5">
              {selectedPrescription.medicines?.map((m, i) => (
                <div key={i} className="p-2 border rounded-lg text-xs flex justify-between">
                  <span>{i + 1}. {m.name} ({m.dosage})</span>
                  <span className="font-bold">{m.frequency} • {m.duration}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t text-xs">
              <QrCode className="w-8 h-8 text-slate-700" />
              <span>الطبيب: {selectedPrescription.doctorName} (ختم إلكتروني)</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(null)}>إغلاق</Button>
            <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>طباعة</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
