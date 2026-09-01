import React from 'react';
import { Building2, Users, Stethoscope, FlaskConical, ShieldCheck, Heart } from 'lucide-react';

export const Stats = () => {
  const stats = [
    { label: 'مستشفى ومركز طبي متصل', value: '+12', icon: Building2, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50' },
    { label: 'سجل طبي إلكتروني موحد', value: '+45,000', icon: Users, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'طبيب واستشاري معتمد', value: '+350', icon: Stethoscope, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' },
    { label: 'فحص مخبري منجز شهرياً', value: '+18,500', icon: FlaskConical, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' }
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
