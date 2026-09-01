import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  Building2,
  ShieldAlert,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Navbar } from '../../components/landing/Navbar';
import { Footer } from '../../components/landing/Footer';
import { contactService, fallbackHotlines } from '../../services/contactService';
import { useAuth } from '../../context/AuthContext';

export const ContactPage = () => {
  const { user } = useAuth();
  const [hotlines, setHotlines] = useState(fallbackHotlines);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nationalId: user?.nationalId || '',
    category: 'general_inquiry',
    priority: 'normal',
    hospital: user?.hospital || 'مجمع الشفاء الطبي',
    subject: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchHotlines = async () => {
      const data = await contactService.getHotlines();
      if (data && Array.isArray(data) && data.length > 0) {
        setHotlines(data);
      }
    };
    fetchHotlines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessData(null);

    try {
      const response = await contactService.submitMessage(formData);
      if (response?.success || response?.status === 'success' || response?.ticketNumber || response?.data?.ticketNumber) {
        const ticket = response.data?.ticket || response.ticket || {
          ticketNumber: response.ticketNumber || response.data?.ticketNumber || 'TKT-2026-8800',
          subject: formData.subject,
          priority: formData.priority,
          createdAt: new Date().toISOString()
        };
        setSuccessData({
          ticketNumber: ticket.ticketNumber,
          estimatedResponseTime: response.data?.estimatedResponseTime || (formData.priority === 'emergency' ? 'خلال ساعتين' : 'خلال 24 ساعة'),
          message: response.message || 'تم استلام رسالتكم بنجاح ومشاركتها مع فريق الدعم المختص.'
        });
      } else {
        setErrorMessage(response?.message || 'تعذر إرسال الرسالة، يرجى التحقق من المدخلات.');
      }
    } catch (err) {
      setErrorMessage('حدث خطأ أثناء التواصل مع الخادم، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setFormData({
      name: user?.name || user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      nationalId: user?.nationalId || '',
      category: 'general_inquiry',
      priority: 'normal',
      hospital: user?.hospital || 'مجمع الشفاء الطبي',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بوابة التواصل المباشر والدعم الفني الطبي</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            تواصل مع فريق منظومة غزة كير
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            نحن هنا لمساعدتكم في حل الاستفسارات الطبية والتقنية، وربط المستشفيات والعيادات بالسجل الصحي الإلكتروني الموحد في قطاع غزة.
          </p>
        </div>

        {/* Emergency Hotlines Strip */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">خطوط الطوارئ والاتصال السريع (فلسطين / غزة)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotlines.map((hotline, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                      {hotline.availability}
                    </span>
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{hotline.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{hotline.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">الرقم المباشر:</span>
                  <a
                    href={`tel:${hotline.number.replace(/\s+/g, '')}`}
                    className="text-base font-black text-emerald-600 dark:text-emerald-400 hover:underline tracking-wider dir-ltr font-mono"
                  >
                    {hotline.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Form + Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form (Left on RTL, Main Area) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            {successData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 px-4"
              >
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  تم استلام رسالتكم بنجاح!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 text-sm">
                  {successData.message}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 max-w-md mx-auto mb-6 text-right space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">رقم تذكرة المتابعة:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">{successData.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">الوقت المتوقع للرد:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{successData.estimatedResponseTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 dark:text-slate-400">الحالة الحالية:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                      قيد المراجعة الفنية
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
                  >
                    إرسال استفسار أو طلب آخر
                  </button>
                  <a
                    href="/"
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-all"
                  >
                    العودة للرئيسية
                  </a>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    نموذج إرسال الرسائل والتذاكر الفنية
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    يرجى تعبئة الحقول المطلوبة بدقة لتسريع توجيه طلبك إلى القسم والمهندس الطبي المعني.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="مثال: د. خليل عادل أو أحمد يوسف"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        البريد الإلكتروني <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dir-ltr text-right"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        رقم الهاتف / واتساب للتواصل
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="059xxxxxxx أو +970xxxxxxx"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dir-ltr text-right"
                      />
                    </div>

                    {/* National ID / MRN */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        رقم الهوية أو الرقم الطبي الموحد (MRN)
                      </label>
                      <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                        placeholder="اختياري - لتسريع البحث في السجل"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        نوع الاستفسار / الطلب <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="general_inquiry">استفسار عام</option>
                        <option value="technical_support">دعم فني ونظام EMR</option>
                        <option value="hospital_integration">ربط مستشفى / عيادة جديدة</option>
                        <option value="medical_consultation">تنسيق حالة طبية وسجل مريض</option>
                        <option value="complaints_feedback">شكاوى ومقترحات تطوير</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        درجة الأولوية <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="normal">عادي (خلال 24-48 ساعة)</option>
                        <option value="urgent">عاجل (خلال 6 ساعات)</option>
                        <option value="emergency">طارئ وسريع (خلال ساعتين)</option>
                      </select>
                    </div>

                    {/* Hospital / Facility */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        المستشفى أو المركز الصحي
                      </label>
                      <select
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="مجمع الشفاء الطبي">مجمع الشفاء الطبي (غزة)</option>
                        <option value="مستشفى ناصر المجمع الطبي">مستشفى ناصر الطبي (خان يونس)</option>
                        <option value="مستشفى الأقصى">مستشفى شهداء الأقصى (دير البلح)</option>
                        <option value="مستشفى غزة الأوروبي">مستشفى غزة الأوروبي</option>
                        <option value="مستشفى الإندونيسي">المستشفى الإندونيسي (شمال غزة)</option>
                        <option value="عيادة أخرى">مركز صحي / عيادة أخرى</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      عنوان الرسالة / موضوع التذكرة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="مثال: طلب مزامنة سجل طبي لحالة محولة من قسم الباطنة"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      تفاصيل الرسالة <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="اكتب تفاصيل الاستفسار، المشكلة التقنية، أو بيانات المريض والمستشفى المراد التنسيق بشأنها..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>جاري إرسال التذكرة للباك إند...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>إرسال الرسالة والحصول على تذكرة</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Info Cards (Sidebar on RTL) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Headquarters & Centers */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                المقر الرئيسي والمراكز المعتمدة
              </h3>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-900 dark:text-white">المقر التقني المركزي:</span>
                    <span>مجمع الشفاء الطبي - مبنى تكنولوجيا المعلومات الطبية، غزة</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-900 dark:text-white">ساعات العمل الإداري:</span>
                    <span>السبت - الخميس: 8:00 صباحاً – 4:00 مساءً</span>
                    <span className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">غرفة الطوارئ تعمل 24/7</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-900 dark:text-white">البريد الإلكتروني المباشر:</span>
                    <a href="mailto:support@gazacare.ps" className="text-emerald-600 dark:text-emerald-400 hover:underline dir-ltr block text-right font-mono">
                      support@gazacare.ps
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick System FAQ Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-emerald-800/40">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm">ميزة المزامنة الطبية الموحدة</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                تتيح منظومة غزة كير للأطباء والمستشفيات المسجلة الوصول الفوري لنتائج التحاليل، الأشعة، والتاريخ المرضي المحفوظ تحت الرقم الطبي الموحد (MRN).
              </p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10 text-emerald-300">
                <span>زمن استجابة المنظومة: &lt; 85ms</span>
                <span className="font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">SSL 256-bit</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
