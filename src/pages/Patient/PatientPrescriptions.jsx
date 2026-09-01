import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { FileText, Printer, QrCode, Calendar, User, Building2, Pill, CheckCircle2, Download } from 'lucide-react';

export const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await prescriptionService.getPrescriptions();
        if (res.success) setPrescriptions(res.data);
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
            الوصفات الطبية الإلكترونية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            أرشيف الوصفات الصادرة مع رمز الاستجابة السريع (QR) للصرف المباشر من الصيدليات
          </p>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.map((rx) => (
          <Card key={rx.id} className="p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-mono font-bold text-sm">
                  Rx
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      وصفة رقم: <span className="font-mono">{rx.prescriptionNumber}</span>
                    </h4>
                    <Badge variant={rx.status === 'active' ? 'success' : 'default'} size="sm">
                      {rx.status === 'active' ? 'نشطة' : 'مصروفة'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    التشخيص: {rx.diagnosis}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={QrCode}
                  onClick={() => setSelectedPrescription(rx)}
                >
                  معاينة وطباعة الوصفة
                </Button>
              </div>
            </div>

            {/* Medicines in prescription */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rx.medicines?.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{m.name}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded font-semibold">{m.dosage}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{m.frequency} • {m.duration}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                الطبيب المعالج: {rx.doctorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                تاريخ الإصدار: {rx.date}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Prescription Preview Modal */}
      {selectedPrescription && (
        <Modal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          title={`معاينة الوصفة الطبية (${selectedPrescription.prescriptionNumber})`}
        >
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 bg-white dark:bg-slate-900 print:p-0">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">دولة فلسطين - وزارة الصحة</h3>
                <p className="text-xs text-slate-500">منظومة غزة كير EMR - {selectedPrescription.hospital}</p>
              </div>
              <div className="text-left font-mono text-xs">
                <p className="font-bold">{selectedPrescription.prescriptionNumber}</p>
                <p className="text-slate-400">{selectedPrescription.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <div><strong>اسم المريض:</strong> {selectedPrescription.patientName}</div>
              <div><strong>رقم الملف:</strong> {selectedPrescription.patientMrn}</div>
              <div><strong>الطبيب:</strong> {selectedPrescription.doctorName}</div>
              <div><strong>التشخيص:</strong> {selectedPrescription.diagnosis}</div>
            </div>

            <div>
              <h5 className="font-bold text-xs mb-2">الأدوية المقررة:</h5>
              <div className="space-y-2">
                {selectedPrescription.medicines?.map((m, i) => (
                  <div key={i} className="p-2 border rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold">{i + 1}. {m.name} ({m.dosage})</p>
                      <p className="text-slate-500 text-[11px]">{m.instructions}</p>
                    </div>
                    <span className="font-bold">{m.frequency}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-xs">
              <div className="flex items-center gap-2">
                <QrCode className="w-10 h-10 text-slate-700 dark:text-slate-300" />
                <span className="text-[10px] text-slate-400">امسح الكود لصرف الدواء</span>
              </div>
              <div className="text-left">
                <p className="font-bold">{selectedPrescription.doctorName}</p>
                <p className="text-[10px] text-slate-400">توقيع وختم إلكتروني معتمد</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(null)}>إغلاق</Button>
            <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>طباعة الوصفة</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
