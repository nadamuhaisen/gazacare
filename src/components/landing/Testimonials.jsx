import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Card } from '../ui/Badge';

export const Testimonials = () => {
  const reviews = [
    {
      name: 'د. هالة منير النجار',
      role: 'استشارية باطنة - مجمع الشفاء الطبي',
      comment: 'غزة كير اختصرت وقتاً ثميناً في الطوارئ والعيادات. إمكانية معرفة حساسية المريض وتاريخه الدوائي بضغطة زر تنقذ حياة المرضى يومياً.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: 'أ. خليل المصري',
      role: 'مسؤول المختبر المركزي',
      comment: 'أصبح إرسال نتائج تحاليل الدم الحرجة وتنبيه الأطباء فورياً وبدون أي أخطاء ورقية. النظام ممتاز وسلس للغاية.',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: 'أحمد يوسف خليل',
      role: 'مريض ومراجع بالعيادات',
      comment: 'أستطيع مراجعة كل وصفاتي الطبية وفحوصاتي السابقة من هاتفي دون الحاجة لحمل ملفات ورقية قد تتلف أو تضيع.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
            تجارب حقيقية
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            آراء الكادر الطبي والمستفيدين
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            قصص نجاح من داخل المستشفيات والمراكز الصحية العاملة في القطاع.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((item, idx) => (
            <Card key={idx} className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {item.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
