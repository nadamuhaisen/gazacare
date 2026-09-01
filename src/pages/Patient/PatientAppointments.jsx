import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { Calendar, Clock, MapPin, User, PlusCircle, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: 'د. يحيى خليل الأغا',
    specialty: 'باطنة وجهاز هضمي',
    hospital: 'مجمع الشفاء الطبي',
    clinic: 'عيادة الباطنة التخصصية',
    date: '2026-03-20',
    time: '10:30 صباحاً',
    reason: 'متابعة دورية'
  });
  const { addToast } = useNotification();

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

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const newApp = {
        ...formData,
        patientName: 'أحمد يوسف خليل',
        patientMrn: 'P-10492',
        status: 'confirmed'
      };
      const res = await appointmentService.createAppointment(newApp);
      if (res.success) {
        setAppointments([res.data, ...appointments]);
        setBookModalOpen(false);
        addToast({
          title: 'تم حجز الموعد',
          message: 'تم تأكيد حجز الموعد بالعيادة بنجاح',
          type: 'success'
        });
      }
    } catch {
      addToast({
        title: 'خطأ',
        message: 'فشل حجز الموعد',
        type: 'error'
      });
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            المواعيد والحجوزات الطبية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            جدول زيارات العيادات الخارجية ومواعيد المتابعة والاستشارات
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setBookModalOpen(true)}
        >
          حجز موعد جديد
        </Button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((app) => (
          <Card key={app.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {app.doctorName}
                    </h4>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                      {app.specialty}
                    </p>
                  </div>
                </div>
                <Badge variant={app.status === 'confirmed' ? 'success' : 'default'} size="sm">
                  {app.status === 'confirmed' ? 'مؤكد' : 'مكتمل'}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>التاريخ والوقت:</strong> {app.date} في تمام {app.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>المكان:</strong> {app.hospital} - {app.clinic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>سبب الزيارة:</strong> {app.reason}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
              <span>رقم الحجز: <strong className="text-slate-700 dark:text-slate-300 font-mono">{app.id}</strong></span>
              {app.status === 'confirmed' && (
                <span className="text-emerald-600 font-bold">يرجى الحضور قبل الموعد بـ 15 دقيقة</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="حجز موعد جديد في العيادات الخارجية"
      >
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المستشفى والمركز</label>
            <select
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
            >
              <option value="مجمع الشفاء الطبي">مجمع الشفاء الطبي</option>
              <option value="مستشفى ناصر الطبي">مستشفى ناصر الطبي</option>
              <option value="مستشفى شهداء الأقصى">مستشفى شهداء الأقصى</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">التخصص</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الطبيب المطلوب</label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الموعد</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الوقت المفضل</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سبب الحجز / الشكوى</label>
            <textarea
              rows={2}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" type="button" onClick={() => setBookModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" size="sm" type="submit">تأكيد الحجز</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
