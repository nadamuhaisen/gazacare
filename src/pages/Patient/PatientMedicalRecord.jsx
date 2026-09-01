import React, { useState, useEffect } from 'react';
import { medicalRecordService } from '../../services/medicalRecordService';
import { patientService } from '../../services/patientService';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { MedicalTimeline } from '../../components/common/MedicalTimeline';
import { VitalSigns } from '../../components/common/VitalSigns';
import { Skeleton } from '../../components/ui/Skeleton';
import { FileText, Heart, Activity, Scissors, AlertTriangle, ShieldCheck, Printer, Download } from 'lucide-react';

export const PatientMedicalRecord = () => {
  const [record, setRecord] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, patRes] = await Promise.all([
          medicalRecordService.getRecordByPatientId('P-10492'),
          patientService.getProfile()
        ]);
        if (recRes.success) setRecord(recRes.data);
        if (patRes.success) setPatient(patRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  const timelineItems = (record?.visitsHistory || []).map(v => ({
    id: v.id,
    type: 'doctor_visit',
    title: `زيارة طبية - ${v.doctorName}`,
    subtitle: `${v.diagnosis} • ${v.notes || ''}`,
    date: v.date,
    doctor: v.doctorName,
    facility: v.hospital,
    status: 'مكتملة',
    badge: v.department,
    badgeColor: 'primary'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            السجل الصحي والتاريخ المرضي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            سجل إلكتروني تراكمي يوثق جميع الزيارات، التشخيصات السريرية، والعمليات الجراحية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Printer} onClick={() => window.print()}>
            طباعة التقرير الشامل
          </Button>
        </div>
      </div>

      {/* Surgeries & Medical History Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Scissors className="w-4 h-4 text-sky-600" />
              <span>العمليات الجراحية السابقة</span>
            </h4>
            <Badge variant="primary" size="sm">
              {record?.surgeries?.length || 0} عمليات
            </Badge>
          </div>
          <div className="space-y-2.5">
            {record?.surgeries && record.surgeries.length > 0 ? (
              record.surgeries.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</h5>
                    <p className="text-[11px] text-slate-400">{s.hospital}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                    {s.year}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                لا توجد عمليات جراحية مسجلة في التاريخ المرضي.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>الأمراض المزمنة والعوامل الوراثية</span>
            </h4>
            <Badge variant="success" size="sm">
              {record?.chronicDiseases?.length > 0 ? 'مستقر' : 'سليم'}
            </Badge>
          </div>
          <div className="space-y-2.5">
            {record?.chronicDiseases && record.chronicDiseases.length > 0 ? (
              record.chronicDiseases.map((d, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{d.name}</h5>
                    <p className="text-[11px] text-slate-400">تاريخ التشخيص: {d.since}</p>
                  </div>
                  <Badge variant={d.status === 'تحت السيطرة' ? 'success' : 'warning'} size="sm">
                    {d.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                لا توجد أمراض مزمنة مسجلة - الحالة الصحية العامة ممتازة.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Vital signs trends */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          مخطط متابعة العلامات الحيوية
        </h3>
        <VitalSigns vitals={patient?.vitalSigns} showChart={true} />
      </div>

      {/* Timeline Section */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
          السجل الزمني للزيارات السريرية والتشخيصات
        </h3>
        <MedicalTimeline items={timelineItems} />
      </Card>
    </div>
  );
};
