import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Badge';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'هل يمكن للمنظومة العمل عند انقطاع الإنترنت أو بطئه؟',
      a: 'نعم بالتأكيد. تم تصميم غزة كير وفق تقنيات Progressive Web Apps (PWA) مع تخزين محلي ذكي، مما يتيح للأطباء إدخال البيانات ومزامنتها تلقائياً عند عودة الاتصال دون فقدان أي سجل.'
    },
    {
      q: 'كيف يتم حماية سرية السجلات والبيانات الطبية؟',
      a: 'تتبع المنظومة تشفيراً شاملاً (End-to-End Encryption) مع تطبيق نظام صلاحيات محكم (Role-Based Access Control) يضمن عدم اطلاع أي شخص على السجلات باستثناء الكادر الطبي المصرح له والمريض نفسه.'
    },
    {
      q: 'كيف تتكامل المنظومة مع خوادم الـ Backend المعتمدة لدى وزارة الصحة؟',
      a: 'تعتمد المنظومة على واجهات برمجية RESTful قياسية موحدة (JSON over HTTP) تدعم الاتصال بخوادم PHP و MySQL أو أي بنية برمجية قائمة بسهولة تامة.'
    },
    {
      q: 'هل يدعم النظام طباعة الوصفات الطبية والتقارير؟',
      a: 'نعم، يوفر النظام قوالب طباعة مخصصة ومحسنة للوصفات والتقارير المخبرية وتصوير الأشعة تتوافق مع الترويسات الرسمية للمستشفيات.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
            إجابات مباشرة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            الأسئلة الشائعة
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            كل ما تود معرفته حول استخدام وأمان منصة غزة كير.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-sky-600 shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-sky-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
