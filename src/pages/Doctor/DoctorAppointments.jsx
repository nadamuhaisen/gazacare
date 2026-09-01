import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { Calendar, Clock, MapPin, User, PlusCircle, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAppointments();
      if (res.success) setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await appointmentService.updateAppointmentStatus(id, newStatus);
      if (res.success) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
        addToast({
          title: 'تم تحديث الموعد',
          message: `تم تغيير حالة الموعد إلى ${newStatus}`,
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل تحديث الموعد', type: 'error' });
    }
  };

  const filtered = appointments.filter(a => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            جدول مواعيد العيادة والاستشارات
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            متابعة قائمة الانتظار، مواعيد اليوم، وإدارة حالات الحضور
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'confirmed', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === f
                  ? 'bg-sky-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f === 'all' ? 'جميع المواعيد' : f === 'confirmed' ? 'المؤكدة' : 'المكتملة'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filtered.map((app) => (
          <Card key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex flex-col items-center justify-center font-mono shrink-0">
                <span className="text-xs font-bold">{app.time.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-400">{app.time.split(' ')[1]}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {app.patientName}
                  </h4>
                  <Badge variant={app.status === 'confirmed' ? 'success' : 'default'} size="sm">
                    {app.status === 'confirmed' ? 'في الانتظار' : 'تمت المعاينة'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  رقم الملف: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{app.patientMrn || 'P-10492'}</span> • الشكوى: {app.reason}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>{app.hospital}</span>
                  <span>•</span>
                  <span>{app.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              {app.status === 'confirmed' && (
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={() => handleStatusChange(app.id, 'completed')}
                >
                  إتمام المعاينة
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/doctor/patients')}
              >
                فتح السجل الطبي
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
