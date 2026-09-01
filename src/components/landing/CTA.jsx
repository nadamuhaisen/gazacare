import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Badge';
import { HeartPulse, ArrowLeft, ShieldCheck } from 'lucide-react';

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-sky-600 to-emerald-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto ring-1 ring-white/20">
          <HeartPulse className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          معاً نحو منظومة صحية رقمية موحدة لقطاع غزة
        </h2>

        <p className="text-sm sm:text-base text-sky-100 max-w-2xl mx-auto leading-relaxed">
          سواء كنت مريضاً تبحث عن متابعة ملفك الصحي، أو طبيباً أو مديراً لمستشفى أو أخصائي مختبر، غزة كير تمنحك الأدوات الأحدث لإنجاز عملك بكفاءة.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
          >
            <span>إنشاء حساب جديد الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 font-bold text-sm text-white transition-all cursor-pointer"
          >
            <span>تسجيل الدخول للمنظومة</span>
          </button>
        </div>

        <div className="pt-6 flex items-center justify-center gap-2 text-xs text-sky-100/80">
          <ShieldCheck className="w-4 h-4" />
          <span>منظومة متوافقة مع معايير الأمان الطبية وبروتوكولات الخصوصية</span>
        </div>
      </div>
    </section>
  );
};
