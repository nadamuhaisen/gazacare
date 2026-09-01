import React from 'react';
import { FileText, Stethoscope, Building2, FlaskConical, WifiOff, Lock, HeartPulse, Clock, Sparkles } from 'lucide-react';
import { Card } from '../ui/Badge';

export const Features = () => {
  const features = [
    {
      icon: FileText,
      title: 'السجل الطبي الإلكتروني الموحد',
      description: 'ملف صحي شامل لكل مريض يضم التشخيصات، العمليات الجراحية، الحساسية، والأدوية السابقة في مكان آمن واحد.',
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50'
    },
    {
      icon: Stethoscope,
      title: 'منظومة الأطباء والوصفات الرقمية',
      description: 'إصدار الوصفات الدوائية الإلكترونية المشفرة، تتبع المؤشرات الحيوية، وتسجيل الملاحظات السريرية فوراً.',
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
    },
    {
      icon: FlaskConical,
      title: 'أتمتة الفحوصات والتحاليل المخبرية',
      description: 'ربط مباشر بين عيادات الأطباء والمختبر المركزي لإرسال العينات واعتماد النتائج مع إشعارات بالحالات الحرجة.',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50'
    },
    {
      icon: Building2,
      title: 'إدارة المستشفيات والأسرّة',
      description: 'متابعة حية للطاقة الاستيعابية، توزيع المرضى على الأجنحة، جداول المناوبات، ومؤشرات الأداء السريري.',
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50'
    },
    {
      icon: WifiOff,
      title: 'جاهزية العمل عند انقطاع الشبكة',
      description: 'بنية تقنية متطورة تتيح تدوين السجلات محلياً والمزامنة التلقائية فور عودة الاتصال بشبكة الإنترنت.',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
    },
    {
      icon: Lock,
      title: 'أعلى معايير الأمان والخصوصية',
      description: 'تشفير بيانات المرضى وحمايتها وفق معايير HIPAA الطبية العالمية مع صلاحيات دخول صارمة حسب الأدوار.',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50'
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حلول رقمية متكاملة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            المميزات الأساسية لمنظومة غزة كير
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            صُممت المنظومة خصيصاً لتلبي احتياجات المرافق الصحية في قطاع غزة وتضمن استمرارية الرعاية بكفاءة ودقة عالية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} hover className="p-6 transition-all duration-200 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
