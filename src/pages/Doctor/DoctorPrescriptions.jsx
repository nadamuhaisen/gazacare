import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import { patientService } from '../../services/patientService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { FileText, PlusCircle, QrCode, Printer, User, Calendar, Trash2, Save, CheckCircle2 } from 'lucide-react';

export const DoctorPrescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    patientMrn: '',
    diagnosis: '',
    medicines: [
      { name: '', dosage: '', frequency: 'مرتين يومياً', duration: '7 أيام', instructions: 'بعد الأكل' }
    ]
  });

  const { addToast } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rxRes, patientsRes] = await Promise.all([
        prescriptionService.getPrescriptions(),
        patientService.getAll()
      ]);

      if (rxRes.success) setPrescriptions(rxRes.data);
      if (patientsRes.success && patientsRes.data.length > 0) {
        setPatients(patientsRes.data);
        const firstP = patientsRes.data[0];
        setForm(prev => ({
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
      setForm(prev => ({
        ...prev,
        patientId: p.id,
        patientName: p.name,
        patientMrn: p.mrn
      }));
    }
  };

  const handleAddMedicineRow = () => {
    setForm({
      ...form,
      medicines: [...form.medicines, { name: '', dosage: '', frequency: 'مرة واحدة يومياً', duration: '7 أيام', instructions: 'بعد الأكل' }]
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
      addToast({ title: 'تنبيه', message: 'يرجى كتابة التشخيص الطبي', type: 'warning' });
      return;
    }

    if (!form.medicines || form.medicines.length === 0 || !form.medicines[0].name) {
      addToast({ title: 'تنبيه', message: 'يرجى إضافة دواء واحد على الأقل', type: 'warning' });
      return;
    }

    try {
      const payload = {
        ...form,
        doctorName: user?.fullName || user?.name || 'د. هالة منير النجار',
        hospital: user?.hospital || 'مجمع الشفاء الطبي',
        status: 'active'
      };

      const res = await prescriptionService.create(payload);
      if (res.success) {
        setPrescriptions([res.data, ...prescriptions]);
        setNewModalOpen(false);
        addToast({
          title: 'تم إصدار الوصفة الطبية بنجاح',
          message: `رقم الوصفة: ${res.data.prescriptionNumber} - تم التحديث في ملف المريض فورياً`,
          type: 'success'
        });
        setForm({
          patientId: patients[0]?.id || '',
          patientName: patients[0]?.name || '',
          patientMrn: patients[0]?.mrn || '',
          diagnosis: '',
          medicines: [
            { name: '', dosage: '', frequency: 'مرتين يومياً', duration: '7 أيام', instructions: 'بعد الأكل' }
          ]
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل إصدار الوصفة الطبية', type: 'error' });
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
            إصدار ومتابعة الوصفات الدوائية المشفرة برمز QR للربط مع الصيدليات وملفات المرضى
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
                    التشخيص: {rx.diagnosis} • رقم الوصفة: <span className="font-mono font-bold text-sky-600">{rx.prescriptionNumber}</span> • التاريخ: {rx.date}
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
                  معاينة الوصفة ورمز QR
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

        {prescriptions.length === 0 && (
          <Card className="p-12 text-center text-slate-400 space-y-2">
            <p>لا توجد وصفات طبية صادرة بعد.</p>
            <Button variant="primary" size="sm" icon={PlusCircle} onClick={() => setNewModalOpen(true)}>
              تحرير أول وصفة طبية
            </Button>
          </Card>
        )}
      </div>

      {/* New Prescription Modal */}
      {newModalOpen && (
        <Modal
          isOpen={newModalOpen}
          onClose={() => setNewModalOpen(false)}
          title="تحرير وصفة طبية إلكترونية جديدة"
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            {/* Patient Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اختر المريض <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn}) - {p.nationalId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  التشخيص الطبي (Diagnosis) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: التهاب حاد في القصبات الهوائية"
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Medicines dynamic rows */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الأدوية الموصوفة والجرعات
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  icon={PlusCircle}
                  onClick={handleAddMedicineRow}
                >
                  إضافة دواء آخر
                </Button>
              </div>

              {form.medicines.map((med, index) => (
                <div
                  key={index}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      دواء #{index + 1}
                    </span>
                    {form.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(index)}
                        className="text-rose-500 hover:text-rose-700 text-xs p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="اسم الدواء العلمي أو التجاري"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="الجرعة (مثال: 500mg أو 5ml)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="التكرار (مثال: مرتين يومياً)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="المدة (مثال: 7 أيام)"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="إرشادات الاستخدام"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewModalOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>
                إصدار الوصفة وإرسالها لملف المريض
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Selected Prescription Details & QR View Modal */}
      {selectedPrescription && (
        <Modal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          title={`الوصفة الطبية: ${selectedPrescription.prescriptionNumber}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedPrescription.patientName}</h4>
                <p className="text-xs text-slate-500 font-mono">الملف الطبي: {selectedPrescription.patientMrn}</p>
                <p className="text-xs text-slate-500 mt-1">التشخيص: {selectedPrescription.diagnosis}</p>
              </div>
              <div className="p-2 bg-white rounded-xl shadow-xs border">
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">قائمة الأدوية الموصوفة:</h5>
              {selectedPrescription.medicines?.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{m.name}</span>
                    <span className="text-slate-400">{m.frequency} • {m.duration} • {m.instructions}</span>
                  </div>
                  <Badge variant="primary" size="sm">{m.dosage}</Badge>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-2">
              الوصفة صادرة ومعتمدة إلكترونياً من {selectedPrescription.doctorName || 'الطبيب المعالج'} - {selectedPrescription.hospital || 'مجمع الشفاء الطبي'}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(null)}>
                إغلاق
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                طباعة الوصفة
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
