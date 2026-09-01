import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HeartPulse, Sun, Moon, Menu, X, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../ui/Badge';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role, getDashboardPath } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'الرئيسية', href: '#hero' },
    { name: 'المميزات', href: '#features' },
    { name: 'كيف يعمل', href: '#how-it-works' },
    { name: 'معاينة المنظومة', href: '#platform-preview' },
    { name: 'لماذا غزة كير', href: '#why-gazacare' },
    { name: 'الأسئلة الشائعة', href: '#faq' },
    { name: 'تواصل معنا', href: '#footer' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                غزة كير <span className="text-sky-600 dark:text-sky-400">|</span> GazaCare
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block -mt-1">
                السجلات الطبية الإلكترونية الموحدة
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="تغيير المظهر"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                icon={UserCheck}
                onClick={() => navigate(getDashboardPath(role))}
              >
                لوحة التحكم
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 px-4 py-2"
                >
                  تسجيل الدخول
                </Link>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/register')}
                >
                  ابدأ الآن
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
