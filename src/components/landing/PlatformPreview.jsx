import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { User, Stethoscope, Building2, FlaskConical, ArrowLeft, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { Button, Badge } from '../ui/Badge';

import doctorImg from '../../assets/images/doctor_dashboard_ui_1788269466273.jpg';
import patientImg from '../../assets/images/patient_portal_ui_1788269504145.jpg';
import hospitalImg from '../../assets/images/hospital_capacity_ui_1788269484741.jpg';
import labImg from '../../assets/images/lab_system_ui_1788269519940.jpg';

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
      stats: '142 مريض نشط | 8 مواعيد اليوم',
      image: doctorImg,
      caption: 'لقطة شاشة حية من واجهة الطبيب: متابعة المؤشرات الحيوية والتشخيص السريري'
    },
    [ROLES.PATIENT]: {
      title: 'بوابة المريض والملف الصحي',
      description: 'مساحة خاصة للمريض للاطلاع على تاريخه الطبي، نتائج تحاليل المختبر، مواعيد المتابعة القادمة، والأدوية الحالية بكل شفافية ويسر.',
      features: ['استعراض السجل المرضي والتحاليل السابقة', 'تتبع المواعيد وتلقي إشعارات التذكير', 'الاطلاع على الوصفات الدوائية والجرعات المحددة', 'بطاقة طوارئ رقمية تتضمن فصيلة الدم والحساسية و QR Code'],
      badge: 'سهل الاستخدام وآمن',
      stats: 'ملف طبي إلكتروني موحد P-10492',
      image: patientImg,
      caption: 'لقطة شاشة حية من واجهة المريض: البطاقة الطبية الرقمية وجدول الأدوية والمواعيد'
    },
    [ROLES.HOSPITAL_MANAGER]: {
      title: 'بوابة إدارة المستشفى والموارد',
      description: 'لوحة قيادة استراتيجية لمدراء المرافق الطبية تتيح مراقبة إشغال الأسرّة، وتوزيع الكادر الطبي، ومعدل إدخال الطوارئ والتقارير الإحصائية.',
      features: ['مراقبة فورية لنسبة إشغال الأسرّة بالأقسام', 'مؤشرات الأكسجين ومخزون بنك الدم المركزي', 'إحصائيات ورسوم بيانية لأداء المستشفى', 'تتبع أسرّة العناية المركزة والطوارئ الحرجة'],
      badge: 'تحكم ورقابة شاملة',
      stats: '450 سرير إجمالي | نسبة إشغال 91.1%',
      image: hospitalImg,
      caption: 'لقطة شاشة حية من لوحة الإدارة: شبكة الأسرّة الحية ومستوى الأكسجين وبنك الدم'
    },
    [ROLES.LAB_ANALYST]: {
      title: 'بوابة المختبر والتحاليل الطبية',
      description: 'نظام إدارة معلومات المختبر (LIMS) لاستقبال عينات الدم والمسحات، إدخال قيم الفحوصات ومقارنتها بالمعدلات الطبيعية، وتصنيف الحالات الحرجة.',
      features: ['قائمة طلبات الفحوصات مرتبة حسب الأولوية', 'إدخال النتائج بدقة مع مقارنة النطاق المرجعي الطبيعي', 'تفعيل زر التنبيه الحرج الفوري للأطباء المعالجين', 'أرشيف رقمي معتمد لجميع تقارير الفحص المخبري'],
      badge: 'دقة وسرعة في النتائج',
      stats: '6 طلبات قيد الفحص | 1 تنبيه حرج',
      image: labImg,
      caption: 'لقطة شاشة حية من نظام المختبر: إدخال الفحوصات والتنبيه التلقائي بالقيم الحرجة'
    }
  };

  const currentRole = rolesData[activeTab];

  return (
    <section id="platform-preview" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>معاينة واجهات النظام كصور حية</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            واجهات نظام غزة كير (UI Gallery)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            تصفح تصميم واجهات النظام والشاشات التفاعلية المصممة خصيصاً لكل دور صحي.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
          {[
            { key: ROLES.DOCTOR, label: 'واجهة الطبيب', icon: Stethoscope },
            { key: ROLES.PATIENT, label: 'واجهة المريض', icon: User },
            { key: ROLES.HOSPITAL_MANAGER, label: 'إدارة المستشفى والأسرّة', icon: Building2 },
            { key: ROLES.LAB_ANALYST, label: 'واجهة المختبر والتحاليل', icon: FlaskConical }
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
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Card with Image Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Details Side */}
            <div className="lg:col-span-5 space-y-4">
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

              <div className="pt-4 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleLaunch(activeTab)}
                  className="px-6"
                >
                  <span>فتح الواجهة التفاعلية الحية</span>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </div>

            {/* Visual Image Preview Side */}
            <div className="lg:col-span-7">
              <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
                <img
                  src={currentRole.image}
                  alt={currentRole.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2 text-white text-xs font-semibold">
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>{currentRole.caption}</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {currentRole.caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
