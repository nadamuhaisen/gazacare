import React from 'react';
import { UserPlus, Stethoscope, FlaskConical, ShieldCheck, ArrowLeft } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'تسجيل الحساب وتحديد الدور',
      description: 'تسجيل المريض أو مقدم الرعاية الصحية في المنظومة واستكمال البيانات الشخصية والطبية الأساسية.',
      icon: UserPlus
    },
    {
      step: '02',
      title: 'الفحص السريري وتدوين المؤشرات',
      description: 'يقوم الطبيب بمعاينة المريض، فحص العلامات الحيوية، وتوثيق التشخيص بدقة متناهية.',
      icon: Stethoscope
    },
    {
      step: '03',
      title: 'طلب الفحوصات والتحاليل الفورية',
      description: 'إرسال طلبات المختبر والأشعة إلكترونياً واعتماد النتائج فور صدورها من المحلل المختبري.',
      icon: FlaskConical
    },
    {
      step: '04',
      title: 'إصدار الوصفة والمتابعة المستمرة',
      description: 'توليد الوصفة الدوائية ومتابعة الحالة الصحية عبر ملف المريض التراكمي في أي مستشفى بغزة.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            خطوات العمل السلس
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            كيف تعمل منظومة غزة كير؟
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            رحلة متكاملة للرعاية الصحية تربط بين جميع أطراف المنظومة الطبية في 4 خطوات بسيطة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-700">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
