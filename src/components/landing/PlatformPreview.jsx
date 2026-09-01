import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { User, Stethoscope, Building2, FlaskConical, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { Button, Badge } from '../ui/Badge';

export const PlatformPreview = () => {
  const [activeTab, setActiveTab] = useState(ROLES.DOCTOR);
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLaunch = (role) => {
    switchRole(role);
    if (role === ROLES.PATIENT) navigate('/patient/dashboard');
    else if (role === ROLES.DOCTOR) navigate('/doctor/dashboard');
    else if (role === ROLES.HOSPITAL_MANAGER) navigate('/hospital-manager/dashboard');
    else if (role === ROLES.LAB_ANALYST) navigate('/lab/dashboard');
  };

  const rolesData = {
    [ROLES.DOCTOR]: {
      title: 'بوابة الطبيب والاستشاري',
      description: 'لوحة متقدمة تمكن الطبيب من استعراض قائمة مرضاه، تدوين التشخيصات، الاطلاع على العلامات الحيوية، طلب التحاليل، وإصدار الوصفات الطبية بدقة وسرعة.',
      features: ['عرض السجل الطبي والمؤشرات الحيوية للمريض', 'إصدار الوصفات الدوائية الإلكترونية وطباعتها', 'إرسال طلبات المختبر والأشعة بضغطة زر', 'إشعارات فورية بالنتائج المخبرية الحرجة'],
      badge: 'الاستخدام الأكثر شيوعاً',
      stats: '142 مريض نشط | 8 مواعيد اليوم'
    },
    [ROLES.PATIENT]: {
      title: 'بوابة المريض والملف الصحي',
      description: 'مساحة خاصة للمريض للاطلاع على تاريخه الطبي، نتائج تحاليل المختبر، مواعيد المتابعة القادمة، والأدوية الحالية بكل شفافية ويسر.',
      features: ['استعراض السجل المرضي والتحاليل السابقة', 'تتبع المواعيد وتلقي إشعارات التذكير', 'الاطلاع على الوصفات الدوائية والجرعات المحددة', 'ملف طوارئ رقمي يتضمن فصيلة الدم والحساسية'],
      badge: 'سهل الاستخدام وآمن',
      stats: 'ملف طبي إلكتروني موحد P-10492'
    },
    [ROLES.HOSPITAL_MANAGER]: {
      title: 'بوابة إدارة المستشفى والموارد',
      description: 'لوحة قيادة استراتيجية لمدراء المرافق الطبية تتيح مراقبة إشغال الأسرّة، وتوزيع الكادر الطبي، ومعدل إدخال الطوارئ والتقارير الإحصائية.',
      features: ['مراقبة فورية لنسبة إشغال الأسرّة بالأقسام', 'إدارة جداول الأطباء والممرضين والمناوبات', 'إحصائيات ورسوم بيانية لأداء المستشفى', 'تتبع أسرّة العناية والطوارئ الحرجة'],
      badge: 'تحكم ورقابة شاملة',
      stats: '450 سرير إجمالي | نسبة إشغال 91.1%'
    },
    [ROLES.LAB_ANALYST]: {
      title: 'بوابة المختبر والتحاليل الطبية',
      description: 'نظام إدارة معلومات المختبر (LIMS) لاستقبال عينات الدم والمسحات، إدخال قيم الفحوصات ومقارنتها بالمعدلات الطبيعية، وتصنيف الحالات الحرجة.',
      features: ['قائمة طلبات الفحوصات مرتبة حسب الأولوية', 'إدخال النتائج بدقة مع وحدات القياس القياسية', 'زر التنبيه الحرج الفوري للأطباء المعالجين', 'أرشيف رقمي معتمد لجميع تقارير الفحص'],
      badge: 'دقة وسرعة في النتائج',
      stats: '6 طلبات قيد الفحص | 1 تنبيه حرج'
    }
  };

  const currentRole = rolesData[activeTab];

  return (
    <section id="platform-preview" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
            تعدد الأدوار والصلاحيات
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            معاينة تجربة المستخدم حسب الدور
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            توفر منصة غزة كير واجهات مخصصة تلبي طبيعة عمل كل عضو في المنظومة الصحية.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
          {[
            { key: ROLES.DOCTOR, label: 'الطبيب', icon: Stethoscope },
            { key: ROLES.PATIENT, label: 'المريض', icon: User },
            { key: ROLES.HOSPITAL_MANAGER, label: 'مدير المستشفى', icon: Building2 },
            { key: ROLES.LAB_ANALYST, label: 'محلل المختبر', icon: FlaskConical }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="primary">{currentRole.badge}</Badge>
                <span className="text-xs text-slate-400 font-medium">{currentRole.stats}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentRole.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentRole.description}
              </p>

              <div className="space-y-2 pt-2">
                {currentRole.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleLaunch(activeTab)}
                  className="px-6"
                >
                  <span>الدخول المباشر إلى هذه اللوحة</span>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </div>

            <div className="md:col-span-5 bg-gradient-to-br from-slate-100 to-sky-50 dark:from-slate-800 dark:to-sky-950/40 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-sky-600/30">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  أمان وصلاحيات دقيقة (RBAC)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  حماية كاملة ومصادقة مستمرة مبنية للتوافق مع معايير REST API لوزارة الصحة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
