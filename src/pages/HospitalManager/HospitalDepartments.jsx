import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospitalService';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Building2, Bed, Users, Activity, PlusCircle, ShieldCheck } from 'lucide-react';

export const HospitalDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getDepartments();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            الأقسام الطبية والسعة الاستيعابية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            متابعة إشغال الأجنحة والعيادات التخصصية وأسرّة العناية المكثفة
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const rate = Math.round((dept.occupiedBeds / dept.totalBeds) * 100);
          const isCritical = rate >= 90;
          return (
            <Card key={dept.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {dept.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        رئيس القسم: {dept.headDoctor}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isCritical ? 'danger' : 'success'} size="sm">
                    {rate}% إشغال
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>الأسرّة المشغولة</span>
                    <span>{dept.occupiedBeds} من {dept.totalBeds} سرير</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : rate > 75 ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block">الأطباء:</span>
                    <strong className="text-slate-900 dark:text-white">{dept.doctorsCount} أطباء</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">التمريض:</span>
                    <strong className="text-slate-900 dark:text-white">{dept.nursesCount} ممرضين</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <span>المبنى الرئيسي - الجناح الشرقي</span>
                <span className="font-mono">{dept.id}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
