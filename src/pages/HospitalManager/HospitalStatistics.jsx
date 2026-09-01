import React from 'react';
import { Card, Badge } from '../../components/ui/Badge';
import { TrendingUp, Users, Activity, Bed, Clock, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const HospitalStatistics = () => {
  const departmentPatientsData = [
    { name: 'الطوارئ', patients: 320 },
    { name: 'الباطنة', patients: 140 },
    { name: 'الجراحة', patients: 110 },
    { name: 'الأطفال', patients: 180 },
    { name: 'العناية المركزة', patients: 45 },
    { name: 'النساء والولادة', patients: 95 }
  ];

  const diseaseDistribution = [
    { name: 'أمراض تنفسية حادة', value: 35, color: '#0284c7' },
    { name: 'حوادث وإصابات رضية', value: 25, color: '#ef4444' },
    { name: 'أمراض قلب وجهاز دوري', value: 18, color: '#f59e0b' },
    { name: 'أمراض باطنة وسكري', value: 14, color: '#10b981' },
    { name: 'حالات أخرى', value: 8, color: '#8b5cf6' }
  ];

  const monthlyAdmissionTrends = [
    { month: 'أكتوبر', admissions: 1200, discharges: 1150 },
    { month: 'نوفمبر', admissions: 1450, discharges: 1380 },
    { month: 'ديسمبر', admissions: 1600, discharges: 1510 },
    { month: 'يناير', admissions: 1750, discharges: 1690 },
    { month: 'فبراير', admissions: 1900, discharges: 1820 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          الإحصائيات السريرية والتحليلات البيانية
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          مؤشرات جودة الرعاية، معدلات التنويم والخروج، وتوزيع الحالات المرضية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume */}
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            توزيع المرضى حسب الأقسام الطبية (هذا الشهر)
          </h3>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPatientsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="patients" name="عدد المرضى" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Diagnosis Distribution Pie */}
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            النسب المئوية للأمراض والحالات السريرية
          </h3>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Admissions vs Discharges (Full width) */}
        <Card className="lg:col-span-2 p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            مقارنة حركة الدخول والخروج الشهري للمستشفى
          </h3>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAdmissionTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="admissions" name="حالات الدخول والتنويم" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="discharges" name="حالات الشفاء والخروج" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
