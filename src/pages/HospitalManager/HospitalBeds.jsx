import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospitalService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { Bed, PlusCircle, Search, User, Building2, CheckCircle2, AlertTriangle, UserMinus, ArrowRightLeft } from 'lucide-react';

export const HospitalBeds = () => {
  const [beds, setBeds] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('all');
  const [selectedBed, setSelectedBed] = useState(null);
  const [allocateModal, setAllocateModal] = useState(false);
  const { addToast } = useNotification();

  const [allocateForm, setAllocateForm] = useState({
    patientName: 'أحمد يوسف خليل',
    patientMrn: 'P-10492',
    diagnosis: 'حالة جراحية مستقرة'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bedRes, deptRes] = await Promise.all([
        hospitalService.getBeds(),
        hospitalService.getDepartments()
      ]);
      if (bedRes.success) setBeds(bedRes.data);
      if (deptRes.success) setDepartments(deptRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async (bedId) => {
    try {
      const res = await hospitalService.updateBedStatus(bedId, 'available', null);
      if (res.success) {
        setBeds(beds.map(b => b.id === bedId ? { ...b, status: 'available', patient: null } : b));
        addToast({
          title: 'تم إخلاء السرير',
          message: 'أصبح السرير شاغراً ومتاحاً لاستقبال مريض جديد',
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل إخلاء السرير', type: 'error' });
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      const patientPayload = {
        name: allocateForm.patientName,
        mrn: allocateForm.patientMrn,
        admittedDate: new Date().toISOString().split('T')[0],
        diagnosis: allocateForm.diagnosis
      };

      const res = await hospitalService.updateBedStatus(selectedBed.id, 'occupied', patientPayload);
      if (res.success) {
        setBeds(beds.map(b => b.id === selectedBed.id ? { ...b, status: 'occupied', patient: patientPayload } : b));
        setAllocateModal(false);
        addToast({
          title: 'تم حجز وتسكين السرير',
          message: `تم تسكين المريض ${allocateForm.patientName} في السرير ${selectedBed.bedNumber}`,
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل تسكين السرير', type: 'error' });
    }
  };

  const filteredBeds = beds.filter(b => {
    if (filterDept === 'all') return true;
    return b.department === filterDept;
  });

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  const occupiedCount = beds.filter(b => b.status === 'occupied').length;
  const availableCount = beds.filter(b => b.status === 'available').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            إدارة وتوزيع الأسرّة والأجنحة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            مراقبة حية لشغور وإشغال الأسرّة في كافة أقسام المستشفى
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>مشغول: <strong>{occupiedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>شاغر: <strong>{availableCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Department */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterDept('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filterDept === 'all'
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          كافة الأقسام
        </button>
        {departments.map(d => (
          <button
            key={d.id}
            onClick={() => setFilterDept(d.name)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterDept === d.name
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Beds Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'occupied';
          return (
            <Card
              key={bed.id}
              className={`p-4 flex flex-col justify-between space-y-3 transition-all ${
                isOccupied
                  ? 'border-rose-200/80 dark:border-rose-950/60'
                  : 'border-emerald-200/80 dark:border-emerald-950/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bed className={`w-4 h-4 ${isOccupied ? 'text-rose-500' : 'text-emerald-500'}`} />
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {bed.bedNumber}
                    </span>
                  </div>
                  <Badge variant={isOccupied ? 'danger' : 'success'} size="sm">
                    {isOccupied ? 'مشغول' : 'شاغر'}
                  </Badge>
                </div>

                <div className="pt-2 text-xs">
                  <p className="text-slate-400">{bed.department} • {bed.room}</p>
                </div>

                {isOccupied && bed.patient ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {bed.patient.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      رقم الملف: {bed.patient.mrn}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      تاريخ الدخول: {bed.patient.admittedDate}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-center text-xs text-emerald-700 dark:text-emerald-300">
                    السرير جاهز ومعقم لاستقبال مريض
                  </div>
                )}
              </div>

              <div className="pt-2">
                {isOccupied ? (
                  <button
                    onClick={() => handleDischarge(bed.id)}
                    className="w-full py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    إخلاء السرير / خروج
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedBed(bed);
                      setAllocateModal(true);
                    }}
                    className="w-full py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    تسكين مريض
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Allocate Bed Modal */}
      {allocateModal && selectedBed && (
        <Modal
          isOpen={allocateModal}
          onClose={() => setAllocateModal(false)}
          title={`تسكين مريض في السرير: ${selectedBed.bedNumber} (${selectedBed.department})`}
        >
          <form onSubmit={handleAllocate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">اسم المريض</label>
              <input
                type="text"
                required
                value={allocateForm.patientName}
                onChange={(e) => setAllocateForm({ ...allocateForm, patientName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">رقم الملف (MRN)</label>
              <input
                type="text"
                required
                value={allocateForm.patientMrn}
                onChange={(e) => setAllocateForm({ ...allocateForm, patientMrn: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">التشخيص أو سبب التنويم</label>
              <textarea
                rows={2}
                value={allocateForm.diagnosis}
                onChange={(e) => setAllocateForm({ ...allocateForm, diagnosis: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setAllocateModal(false)}>إلغاء</Button>
              <Button variant="primary" size="sm" type="submit">تأكيد التسكين</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
