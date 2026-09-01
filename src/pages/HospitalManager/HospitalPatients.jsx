import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Users, Search, PlusCircle, UserCheck, Activity, MapPin, Calendar, Heart, Shield } from 'lucide-react';

export const HospitalPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getPatients();
      if (res.success) setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter(p =>
    p.name.includes(search) || p.mrn.includes(search) || p.nationalId.includes(search)
  );

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            سجلات وبيانات المرضى بالمستشفى
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            أرشيف المرضى الداخليين والمراجعين المسجلين في مجمع الشفاء الطبي
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الملف، الاسم، أو الهوية..."
            className="w-full pr-10 pl-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((patient) => (
          <Card key={patient.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {patient.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {patient.mrn} • {patient.age} عاماً
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <div><strong>الهوية:</strong> {patient.nationalId}</div>
                <div><strong>فصيلة الدم:</strong> <Badge variant="primary" size="sm">{patient.bloodType}</Badge></div>
                <div><strong>العنوان:</strong> {patient.address}</div>
                <div><strong>الجوال:</strong> {patient.phone}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {patient.chronicConditions?.map((c, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedPatient(patient)}
            >
              عرض التفاصيل والملف الكامل
            </Button>
          </Card>
        ))}
      </div>

      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`بيانات المريض: ${selectedPatient.name}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <img src={selectedPatient.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedPatient.name} ({selectedPatient.bloodType})</p>
                <p className="text-xs text-slate-400">{selectedPatient.mrn} - الهوية: {selectedPatient.nationalId}</p>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-1">جهة الاتصال في الطوارئ:</h5>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedPatient.emergencyContact?.name} ({selectedPatient.emergencyContact?.relation}) - {selectedPatient.emergencyContact?.phone}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="primary" size="sm" onClick={() => setSelectedPatient(null)}>إغلاق</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
