import React from 'react';
import { ShieldCheck, Zap, Database, Globe2, Heart, Award } from 'lucide-react';
import { Card } from '../ui/Badge';

export const WhyGazaCare = () => {
  const reasons = [
    {
      icon: Heart,
      title: 'مُصمم لواقع وتحديات غزة',
      description: 'يراعي الانقطاع المتكرر للكهرباء وضعف سرعة الإنترنت عبر خوارزميات تخزين ومزامنة فائقة الخفة والأمان.'
    },
    {
      icon: Database,
      title: 'سجل طبي وطني موحد',
      description: 'يمنع تكرار التحاليل والأشعة، ويوفر التاريخ الدوائي الكامل للمريض لمنع التفاعلات الدوائية الخطرة.'
    },
    {
      icon: Zap,
      title: 'سرعة وكفاءة في الطوارئ',
      description: 'الوصول الفوري لفصيلة الدم والحساسية والأمراض المزمنة في ثوانٍ معدودة لإنقاذ أرواح المصابين والمرضى.'
    },
    {
      icon: Award,
      title: 'بنية برمجية معيارية قابلة للتوسع',
      description: 'واجهات برمجية RESTful مهيأة للربط السريع مع قواعد بيانات PHP/MySQL والأنظمة الصحية القائمة.'
    }
  ];

  return (
    <section id="why-gazacare" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            القيمة المضافة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            لماذا تختار المستشفيات غزة كير؟
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            أكثر من مجرد برنامج إدارة — إنها منظومة لإنقاذ الحياة وتنظيم الرعاية الصحية باحترافية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
