import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Badge';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('يرجى كتابة البريد الإلكتروني المسجل.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setErrorMessage('حدث خطأ، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          استعادة كلمة المرور
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          أدخل بريدك الإلكتروني لإرسال تعليمات إعادة التعيين
        </p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            تم إرسال رابط التعيين بنجاح
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى <strong>{email}</strong>. يرجى مراجعة صندوق الوارد.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-sm hover:bg-sky-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لصفحة تسجيل الدخول</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@gazacare.ps"
                className="w-full pr-10 pl-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            إرسال رابط الاستعادة
          </Button>

          <div className="text-center pt-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400"
            >
              تذكرت كلمة المرور؟ تسجيل الدخول
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
