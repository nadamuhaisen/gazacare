import React from 'react';
import { HeartPulse, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white">غزة كير | GazaCare</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              منصة وطنية شاملة للسجلات الطبية الإلكترونية الموحدة (EMR) تهدف لربط المستشفيات والعيادات والمختبرات في قطاع غزة وتحسين جودة الرعاية الطبية.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>نظام مشفر وآمن يعمل في بيئات الطوارئ وضعف الشبكة</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">المميزات</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">كيف يعمل</a></li>
              <li><a href="#platform-preview" className="hover:text-white transition-colors">بوابات النظام</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Role Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">بوابات المنظومة</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/patient/dashboard" className="hover:text-white transition-colors">بوابة المريض</Link></li>
              <li><Link to="/doctor/dashboard" className="hover:text-white transition-colors">بوابة الطبيب</Link></li>
              <li><Link to="/hospital-manager/dashboard" className="hover:text-white transition-colors">إدارة المستشفى</Link></li>
              <li><Link to="/lab/dashboard" className="hover:text-white transition-colors">المختبر المركزي</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">تسجيل الدخول</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">تواصل معنا</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>غزة، مجمع الشفاء الطبي - وزارة الصحة</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+970 8 282 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>support@gazacare.ps</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 غزة كير | GazaCare EMR. جميع الحقوق محفوظة لوزارة الصحة الفلسطينية.</p>
          <div className="flex items-center gap-4">
            <span>سياسة الخصوصية</span>
            <span>شروط الاستخدام</span>
            <span>بروتوكولات الأمان الطبي</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
