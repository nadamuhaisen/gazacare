import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Calendar, Clock, MapPin, Search, CheckCircle2 } from 'lucide-react';

export const HospitalAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filtered = appointments.filter(a =>
    a.patientName.includes(search) || a.doctorName.includes(search) || a.clinic.includes(search)
  );

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            حجوزات ومواعيد العيادات الخارجية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            متابعة تدفق المراجعين والضغط على مختلف العيادات التخصصية
          </p>
        </div>
      </div>

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
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{app.patientName}</h4>
                  <Badge variant={app.status === 'confirmed' ? 'success' : 'default'} size="sm">
                    {app.status === 'confirmed' ? 'مؤكد' : 'مكتمل'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  الطبيب: <strong className="text-slate-700 dark:text-slate-300">{app.doctorName}</strong> ({app.specialty}) • {app.clinic}
                </p>
                <div className="text-[11px] text-slate-400 mt-1">الشكوى: {app.reason}</div>
              </div>
            </div>

            <div className="text-left text-xs font-mono text-slate-400">
              {app.date}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
