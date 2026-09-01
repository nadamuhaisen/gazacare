import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Badge';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login, getDashboardPath } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        setSuccessMessage('تم تسجيل الدخول بنجاح، جاري التحويل...');
        addToast({
          title: 'مرحباً بك في غزة كير',
          message: `تم تسجيل الدخول بنجاح`,
          type: 'success'
        });

        setTimeout(() => {
          const userRole = response.data?.user?.role;
          const destination = from || getDashboardPath(userRole);
          navigate(destination, { replace: true });
        }, 500);
      } else {
        setErrorMessage(response.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية.');
      }
    } catch (err) {
      setErrorMessage('حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          تسجيل الدخول
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          أدخل بيانات حسابك المعتمد للوصول إلى لوحة التحكم
        </p>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            البريد الإلكتروني أو رقم الهوية
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gazacare.ps"
              className="w-full pr-10 pl-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            كلمة المرور
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full pr-10 pl-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span>تذكر بيانات دخولي</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-2"
        >
          <span>تسجيل الدخول</span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
      </form>

      <div className="text-center pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>ليس لديك حساب على المنظومة؟ </span>
        <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
};
