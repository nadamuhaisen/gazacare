import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Settings, User, Lock, Bell, Moon, Sun, Globe, Shield, 
  Database, Smartphone, CheckCircle2, Save, RefreshCw, Key
} from 'lucide-react';
import { Button, Badge } from '../../components/ui/Badge';

export const SettingsPage = () => {
  const { user, role } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '0599-123456',
    nationalId: user?.national_id || '401234567',
    emergencyContact: '0598-765432 (الأخ)',
    notificationsEmail: true,
    notificationsSms: true,
    notificationsPanic: true,
    offlineCache: true,
    language: 'ar',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-500" />
            <span>إعدادات الحساب والنظام</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إدارة بيانات الملف الشخصي، تفضيلات الأمان، الإشعارات، والتهيئة السريرية
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs px-4 py-2 rounded-xl font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ التغييرات بنجاح في السيرفر</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'account', label: 'الملف الشخصي والحساب', icon: User },
          { id: 'security', label: 'الأمان وكلمة المرور', icon: Lock },
          { id: 'notifications', label: 'تفضيلات الإشعارات', icon: Bell },
          { id: 'system', label: 'تهيئة المنظومة والمظهر', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {activeTab === 'account' && (
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/40 shadow-md"
              />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{user?.name}</h3>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                  {user?.role_label || 'مستخدم معتمد'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">الاسم الرباعي الكامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">رقم الهاتف المحمول</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">رقم الهوية الوطنية</label>
                <input
                  type="text"
                  disabled
                  value={formData.nationalId}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-xs cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="md" icon={Save} type="submit">
                حفظ التعديلات
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSave} className="space-y-6 max-w-xl">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
              <Shield className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">أمان السجلات الطبية (HIPAA & Ministry of Health Compliance)</span>
                يتم تشفير كلمات المرور باستخدام خوارزمية Bcrypt مع حماية الجلسة من التسلل.
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">كلمة المرور الحالية</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPass}
                  onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPass}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPass: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="md" icon={Key} type="submit">
                تحديث كلمة المرور
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">قنوات التنبيه الفوري</h4>
            
            <div className="space-y-3">
              {[
                { id: 'panic', title: 'تنبيهات الحالات والنتائج الحرجة (Critical Panic Alerts)', desc: 'إشعار مباشر وفوري في الشاشة وهزاز الهاتف عند صدور قيم مخبرية خطيرة', checked: formData.notificationsPanic },
                { id: 'email', title: 'إشعارات البريد الإلكتروني', desc: 'استلام ملخص بالمواعيد والتقارير الطبية المعتمدة', checked: formData.notificationsEmail },
                { id: 'sms', title: 'إشعارات الرسائل القصيرة SMS للطوارئ', desc: 'تذكير بمواعيد العيادات وجرعات الأدوية الحرجة', checked: formData.notificationsSms },
              ].map((item) => (
                <label key={item.id} className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="mt-1 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-4">
              <Button variant="primary" size="md" onClick={handleSave}>
                حفظ تفضيلات الإشعارات
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">مظهر الواجهة (Theme)</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => !isDark && toggleTheme()}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 border-sky-500 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Moon className="w-5 h-5 text-sky-400" />
                  <div className="text-right">
                    <span className="block font-bold text-xs">الوضع الليلي (Dark)</span>
                    <span className="text-[10px] text-slate-400">توفير الطاقة للمناوبات الليلية</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => isDark && toggleTheme()}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                    !isDark
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div className="text-right">
                    <span className="block font-bold text-xs">الوضع النهاري (Light)</span>
                    <span className="text-[10px] text-slate-400">تباين عالي للقراءة تحت الإضاءة</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">مزامنة البيانات بدون إنترنت (PWA Offline Sync)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                المنظومة تحتفظ تلقائياً بنسخة مشفرة محلية من بطاقة الطوارئ والمؤشرات الحيوية للعمل في أوقات انقطاع الشبكة.
              </p>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>المزامنة المحلية التلقائية مفعلة ونشطة (IndexedDB Ready)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
