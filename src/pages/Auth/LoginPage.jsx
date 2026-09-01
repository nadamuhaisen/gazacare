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
  const [showSecretDemo, setShowSecretDemo] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  const { login, getDashboardPath } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSecretTrigger = () => {
    const nextCount = secretClickCount + 1;
    setSecretClickCount(nextCount);
    if (nextCount >= 3) {
      setShowSecretDemo(prev => !prev);
      setSecretClickCount(0);
      addToast({
        title: !showSecretDemo ? 'تم تفعيل الوضع السري' : 'تم إخفاء الوضع السري',
        message: !showSecretDemo ? 'تم فتح لوحة الدخول السريع التجريبية' : 'تم إغلاق اللوحة',
        type: 'info'
      });
    }
  };

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
        <h2 
          onClick={handleSecretTrigger}
          title="تسجيل الدخول"
          className="text-2xl font-black text-slate-900 dark:text-white cursor-default select-none transition-colors"
        >
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

      {/* Secret Quick Demo Access (Hidden by default) */}
      {showSecretDemo && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              🔒 لوحة الدخول السريع (الوضع السري - Secret Demo):
            </p>
            <button
              type="button"
              onClick={() => setShowSecretDemo(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              إخفاء ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                setEmail('patient@gazacare.ps');
                setPassword('password123');
                setLoading(true);
                const res = await login('patient@gazacare.ps', 'password123', 'PATIENT');
                setLoading(false);
                if (res.success) {
                  addToast({ title: 'مرحباً أحمد يوسف', message: 'تم الدخول لبوابة المريض', type: 'success' });
                  navigate('/patient/dashboard');
                }
              }}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span>🧑‍⚕️ مريض / مراجع</span>
              <span className="text-[10px] text-emerald-600 font-mono">patient@gazacare.ps</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setEmail('doctor@gazacare.ps');
                setPassword('password123');
                setLoading(true);
                const res = await login('doctor@gazacare.ps', 'password123', 'DOCTOR');
                setLoading(false);
                if (res.success) {
                  addToast({ title: 'مرحباً د. هالة النجار', message: 'تم الدخول لبوابة الطبيب', type: 'success' });
                  navigate('/doctor/dashboard');
                }
              }}
              className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span>🩺 طبيب معالج</span>
              <span className="text-[10px] text-sky-600 font-mono">doctor@gazacare.ps</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setEmail('manager@gazacare.ps');
                setPassword('password123');
                setLoading(true);
                const res = await login('manager@gazacare.ps', 'password123', 'HOSPITAL_MANAGER');
                setLoading(false);
                if (res.success) {
                  addToast({ title: 'مرحباً د. صبحي سكيك', message: 'تم الدخول لإدارة المستشفى', type: 'success' });
                  navigate('/hospital-manager/dashboard');
                }
              }}
              className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span>🏥 إدارة المستشفى</span>
              <span className="text-[10px] text-purple-600 font-mono">manager@gazacare.ps</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setEmail('lab@gazacare.ps');
                setPassword('password123');
                setLoading(true);
                const res = await login('lab@gazacare.ps', 'password123', 'LAB_ANALYST');
                setLoading(false);
                if (res.success) {
                  addToast({ title: 'مرحباً أ. خليل المصري', message: 'تم الدخول لبوابة المختبر', type: 'success' });
                  navigate('/lab-analyst/dashboard');
                }
              }}
              className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span>🔬 المختبر والتحاليل</span>
              <span className="text-[10px] text-amber-600 font-mono">lab@gazacare.ps</span>
            </button>
          </div>
        </div>
      )}

      <div className="text-center pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>ليس لديك حساب على المنظومة؟ </span>
        <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
};
