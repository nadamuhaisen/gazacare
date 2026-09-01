import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Badge';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/2 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>المنظومة الوطنية الأولى الموحدة للسجلات الصحية في فلسطين</span>
          </div>

          {/* Main Display Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.25] tracking-tight">
            رعاية صحية رقمية متكاملة لخدمة قطاع غزة
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            منصة <strong className="text-sky-600 dark:text-sky-400">غزة كير (GazaCare)</strong> تربط بين المستشفيات، الأطباء، المرضى، والمختبرات في شبكة آمنة وسريعة تعمل بسلاسة حتى في حالات ضعف الاتصال.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 font-bold shadow-lg shadow-emerald-600/20"
            >
              <span>انضم للمنظومة الآن</span>
              <ArrowLeft className="w-5 h-5 mr-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 font-bold"
            >
              <span>تسجيل الدخول للنظام</span>
            </Button>
          </div>

          {/* Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>سجلات طبية مشفرة</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>دعم العمل بدون إنترنت</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>مختبر ونتائج فورية</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>تكامل 4 بوابات تخصصية</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
