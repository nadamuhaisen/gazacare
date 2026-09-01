import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { prescriptionService } from '../../services/prescriptionService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pill, Clock, Calendar, AlertCircle, CheckCircle2, User, Building2, HelpCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientMedications = () => {
  const [medications, setMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMed, setSelectedMed] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [medRes, prescRes] = await Promise.all([
          patientService.getMedications(),
          prescriptionService.getPrescriptions()
        ]);
        if (medRes.success) setMedications(medRes.data);
        if (prescRes.success) setPrescriptions(prescRes.data);
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
            الأدوية والجرعات العلاجية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            جدول الأدوية الحالية المعتمدة، مواعيد الجرعات، وتوجيهات الأطباء المعالجين
          </p>
        </div>
        <Link to="/patient/prescriptions">
          <Button variant="primary" size="sm" icon={FileText}>
            عرض الوصفات الطبية
          </Button>
        </Link>
      </div>

      {/* Active Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med) => (
          <Card key={med.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <Badge variant={med.status === 'active' ? 'success' : 'default'} size="sm">
                  {med.status === 'active' ? 'نشط ومستمر' : 'متوقف'}
                </Badge>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {med.name}
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  الجرعة: {med.dosage}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>التكرار:</strong> {med.frequency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>المدة:</strong> {med.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>الطبيب:</strong> {med.prescribedBy}</span>
                </div>
              </div>

              {med.instructions && (
                <div className="text-xs text-slate-500 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/60">
                  💡 <strong>تعليمات:</strong> {med.instructions}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedMed(med)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
            >
              تفاصيل الدواء والتحذيرات
            </button>
          </Card>
        ))}
      </div>

      {/* Medication Detail Modal */}
      {selectedMed && (
        <Modal
          isOpen={!!selectedMed}
          onClose={() => setSelectedMed(null)}
          title={`معلومات الدواء: ${selectedMed.name}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200">
              <p className="font-bold text-sm mb-1">{selectedMed.name} ({selectedMed.dosage})</p>
              <p>يتم تناوله: {selectedMed.frequency} لمدة {selectedMed.duration}</p>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">التعليمات الصيدلانية:</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedMed.instructions || 'يُؤخذ بعد الأكل مع كوب ماء كامل مع الالتزام بالمواعيد المحددة.'}
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">الموصوف بواسطة:</h5>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedMed.prescribedBy} - مجمع الشفاء الطبي
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="primary" size="sm" onClick={() => setSelectedMed(null)}>
                إغلاق النافذة
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
