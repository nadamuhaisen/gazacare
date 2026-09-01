import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Users, Search, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LabPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
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
            سجلات المرضى بالمختبر
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            البحث في ملفات المرضى وتاريخ الفحوصات والتحاليل السابقة
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
            placeholder="بحث برقم الملف أو الاسم..."
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
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20"
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

              <div className="space-y-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <div>فصيلة الدم: <Badge variant="primary" size="sm">{patient.bloodType}</Badge></div>
                <div>الهوية: {patient.nationalId}</div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={FlaskConical}
              className="w-full"
              onClick={() => navigate('/lab-analyst/results')}
            >
              عرض سجل الفحوصات
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
