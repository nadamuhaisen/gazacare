import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Stethoscope, Building2, FlaskConical, Mail, Lock, Phone, IdCard, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Badge';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
    password: '',
    role: ROLES.PATIENT,
    agreeTerms: true
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, getDashboardPath } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const roleOptions = [
    { key: ROLES.PATIENT, label: 'مريض / مراجع', desc: 'للوصول للملف الطبي والوصفات', icon: User },
    { key: ROLES.DOCTOR, label: 'طبيب / استشاري', desc: 'لإدارة المرضى والتشخيص', icon: Stethoscope },
    { key: ROLES.HOSPITAL_MANAGER, label: 'إدارة المستشفى', desc: 'لإشراف الأسرّة والأقسام', icon: Building2 },
    { key: ROLES.LAB_ANALYST, label: 'محلل مختبر', desc: 'لفحص العينات واعتماد النتائج', icon: FlaskConical }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorMessage('يرجى تعبئة الحقول الأساسية المطلوبة.');
      return;
    }

    setLoading(true);
    try {
      const response = await register(formData);
      if (response.success) {
        addToast({
          title: 'تم إنشاء الحساب بنجاح',
          message: 'أهلاً بك في منظومة غزة كير EMR',
          type: 'success'
        });
        const path = getDashboardPath(response.data.user.role);
        navigate(path, { replace: true });
      } else {
        setErrorMessage(response.message || 'حدث خطأ أثناء التسجيل.');
      }
    } catch (err) {
      setErrorMessage('فشل الاتصال بالخادم، يرجى المحاولة مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          إنشاء حساب جديد
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          انضم إلى منظومة غزة كير الرقمية الموحدة
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            حدد نوع الحساب المطلوب:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = formData.role === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => setFormData({ ...formData, role: opt.key })}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/50 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            * الصلاحيات النهائية تخضع للتحقق والاعتماد من قبل وزارة الصحة.
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            الاسم الكامل (رباعي)
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="أحمد يوسف محمد خليل"
            className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white"
          />
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@gazacare.ps"
              className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم الجوال
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0599123456"
              className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            className="rounded text-sky-600 focus:ring-sky-500"
          />
          <label htmlFor="terms" className="text-slate-600 dark:text-slate-400 cursor-pointer">
            أوافق على سياسة الخصوصية والشروط الطبية المعتمدة
          </label>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          loading={loading}
          className="w-full mt-2"
        >
          <span>إنشاء الحساب</span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
      </form>

      <div className="text-center pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>لديك حساب بالفعل؟ </span>
        <Link to="/login" className="font-bold text-sky-600 dark:text-sky-400 hover:underline">
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
};
