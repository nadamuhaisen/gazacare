import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationCenter } from '../components/common/NotificationCenter';
import { OfflineBanner } from '../components/common/OfflineBanner';
import {
  LayoutDashboard,
  Users,
  User,
  Calendar,
  FileText,
  FlaskConical,
  Activity,
  Pill,
  Bed,
  Building2,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronDown,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  ClipboardList
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define sidebar navigation items based on role
  const getNavLinks = () => {
    switch (role) {
      case ROLES.PATIENT:
        return [
          { name: 'الرئيسية', path: '/patient/dashboard', icon: LayoutDashboard },
          { name: 'ملفي الطبي', path: '/patient/profile', icon: User },
          { name: 'السجل المرضي', path: '/patient/medical-record', icon: ClipboardList },
          { name: 'الأدوية الحالية', path: '/patient/medications', icon: Pill },
          { name: 'الوصفات الطبية', path: '/patient/prescriptions', icon: FileText },
          { name: 'نتائج المختبر', path: '/patient/labs', icon: FlaskConical },
          { name: 'المواعيد والحجوزات', path: '/patient/appointments', icon: Calendar },
          { name: 'الإشعارات والتنبيهات', path: '/patient/notifications', icon: Bell },
          { name: 'الإعدادات', path: '/patient/settings', icon: Settings }
        ];

      case ROLES.DOCTOR:
        return [
          { name: 'الرئيسية', path: '/doctor/dashboard', icon: LayoutDashboard },
          { name: 'قائمة المرضى', path: '/doctor/patients', icon: Users },
          { name: 'مواعيدي', path: '/doctor/appointments', icon: Calendar },
          { name: 'الوصفات الطبية', path: '/doctor/prescriptions', icon: FileText },
          { name: 'طلبات المختبر', path: '/doctor/laboratory', icon: FlaskConical },
          { name: 'الأشعة والتصوير', path: '/doctor/radiology', icon: Activity },
          { name: 'الإشعارات', path: '/doctor/notifications', icon: Bell },
          { name: 'الإعدادات', path: '/doctor/settings', icon: Settings }
        ];

      case ROLES.HOSPITAL_MANAGER:
        return [
          { name: 'الرئيسية', path: '/hospital-manager/dashboard', icon: LayoutDashboard },
          { name: 'سجلات المرضى', path: '/hospital-manager/patients', icon: Users },
          { name: 'الكادر الطبي', path: '/hospital-manager/doctors', icon: Stethoscope },
          { name: 'الموظفون والتمريض', path: '/hospital-manager/staff', icon: User },
          { name: 'الأقسام الطبية', path: '/hospital-manager/departments', icon: Building2 },
          { name: 'إدارة الأسرّة', path: '/hospital-manager/beds', icon: Bed },
          { name: 'المواعيد والعيادات', path: '/hospital-manager/appointments', icon: Calendar },
          { name: 'التقارير السريرية', path: '/hospital-manager/reports', icon: FileText },
          { name: 'الإحصائيات والتحليلات', path: '/hospital-manager/statistics', icon: BarChart3 },
          { name: 'الإعدادات', path: '/hospital-manager/settings', icon: Settings }
        ];

      case ROLES.LAB_ANALYST:
        return [
          { name: 'الرئيسية', path: '/lab-analyst/dashboard', icon: LayoutDashboard },
          { name: 'طلبات التحاليل', path: '/lab-analyst/requests', icon: FlaskConical },
          { name: 'النتائج المعتمدة', path: '/lab-analyst/results', icon: ShieldCheck },
          { name: 'المرضى والمراجعين', path: '/lab-analyst/patients', icon: Users },
          { name: 'التقارير المخبرية', path: '/lab-analyst/reports', icon: BarChart3 },
          { name: 'الإشعارات', path: '/lab-analyst/notifications', icon: Bell },
          { name: 'الإعدادات', path: '/lab-analyst/settings', icon: Settings }
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getRoleLabel = () => {
    switch (role) {
      case ROLES.PATIENT: return 'بوابة المريض';
      case ROLES.DOCTOR: return 'بوابة الطبيب';
      case ROLES.HOSPITAL_MANAGER: return 'إدارة المستشفى';
      case ROLES.LAB_ANALYST: return 'المختبر والتحاليل';
      default: return 'GazaCare';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Offline/PWA Connection Status Banner */}
      <OfflineBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shrink-0 select-none">
          {/* Brand Logo */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  غزة كير | GazaCare
                </h1>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white font-semibold shadow-xs shadow-sky-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Info & Logout Card */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                  alt={user?.name || "User"}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {user?.name || 'مستخدم مسجل'}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.hospital || 'مجمع الشفاء الطبي'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col p-4 shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm">غزة كير | GazaCare</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-sky-500 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold text-sm hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Topbar */}
          <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile menu trigger + Search input */}
              <div className="flex items-center gap-3 flex-1 max-w-lg">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="relative w-full max-w-sm hidden sm:block">
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="بحث سريع عن مريض، ملف طبي، فحص..."
                    className="w-full pr-9 pl-4 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800/80 border border-transparent rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-sky-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Right Topbar Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                </button>

                {/* Notifications Center Bell Dropdown */}
                <NotificationCenter />

                {/* Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                      alt={user?.name || "User"}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-500/40"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">
                      {user?.name?.split(' ')[0] || 'حسابي'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full text-right px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>الملف الشخصي</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full text-right px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>إعدادات النظام</span>
                      </button>
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-right px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Routed Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
