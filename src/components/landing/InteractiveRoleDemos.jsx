import React, { useState } from 'react';
import { 
  Users, Stethoscope, HeartPulse, Activity, AlertTriangle, 
  Pill, FileText, CheckCircle2, Clock, Eye, Sparkles, 
  Search, Shield, Bed, Zap, RefreshCw, Send, Plus
} from 'lucide-react';
import { Badge, Button } from '../ui/Badge';

export const InteractiveDoctorPreview = () => {
  const [selectedPatient, setSelectedPatient] = useState('P-10492');
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [vitalHeartRate, setVitalHeartRate] = useState(78);
  const [prescriptions, setPrescriptions] = useState([
    { name: 'Paracetamol 500mg', dose: 'قرص كل 8 ساعات عند اللزوم', status: 'نشطة' },
    { name: 'Augmentin 625mg', dose: 'قرص مرتين يومياً بعد الأكل', status: 'نشطة' }
  ]);
  const [newMed, setNewMed] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const patients = [
    { id: 'P-10492', name: 'أحمد خليل المصري', age: 34, gender: 'ذكر', blood: 'O+', condition: 'متابعة بعد عملية جراحية', priority: 'stable' },
    { id: 'P-10493', name: 'مريم محمود النجار', age: 28, gender: 'أنثى', blood: 'A+', condition: 'اشتباه التهاب رئوي حاد', priority: 'urgent' },
    { id: 'P-10494', name: 'إبراهيم صبحي حلس', age: 52, gender: 'ذكر', blood: 'B+', condition: 'ارتفاع ضغط دم شرياني', priority: 'stable' },
  ];

  const currentPatient = patients.find(p => p.id === selectedPatient) || patients[0];

  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMed.trim()) return;
    setPrescriptions([...prescriptions, { name: newMed, dose: 'حسب إرشادات الطبيب المعالج', status: 'نشطة' }]);
    setNewMed('');
  };

  const handleSaveDiagnosis = () => {
    if (!diagnosisInput.trim()) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 shadow-2xl text-xs sm:text-sm">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">محاكي محطة الطبيب السريرية</div>
            <div className="text-slate-400 text-xs">د. يوسف النجار - استشاري جراحة عامة</div>
          </div>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>تفاعلي حي</span>
        </span>
      </div>

      {/* Grid: Patient selector + Clinical Record */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Patient List */}
        <div className="md:col-span-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2">
          <div className="text-xs font-bold text-slate-400 px-1">اختر مريضاً للفحص:</div>
          <div className="space-y-1.5">
            {patients.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p.id)}
                className={`w-full text-right p-2.5 rounded-lg transition-all cursor-pointer border flex flex-col gap-1 ${
                  selectedPatient === p.id 
                    ? 'bg-sky-950/60 border-sky-500/50 text-white' 
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{p.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'}`}>
                    {p.id}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{p.condition}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Interactive Card */}
        <div className="md:col-span-8 bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-4">
          {/* Patient Top Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-sm font-black text-white">{currentPatient.name}</span>
              <span className="text-slate-400 text-xs mr-2">({currentPatient.age} سنة - {currentPatient.gender})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded text-xs border border-rose-500/30">
                فصيلة: {currentPatient.blood}
              </span>
            </div>
          </div>

          {/* Vitals simulator */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">النبض (BPM)</div>
              <div className="text-base font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>{vitalHeartRate}</span>
              </div>
              <div className="flex justify-center gap-1 mt-1">
                <button onClick={() => setVitalHeartRate(v => v + 2)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] cursor-pointer">+</button>
                <button onClick={() => setVitalHeartRate(v => Math.max(50, v - 2))} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] cursor-pointer">-</button>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">ضغط الدم</div>
              <div className="text-base font-black text-sky-400 mt-0.5">120 / 80</div>
              <div className="text-[10px] text-emerald-400 mt-1">طبيعي</div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">الأكسجين SpO2</div>
              <div className="text-base font-black text-teal-400 mt-0.5">98%</div>
              <div className="text-[10px] text-emerald-400 mt-1">مستقر</div>
            </div>
          </div>

          {/* Interactive Diagnosis write */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">تسجيل تشخيص سريري جديد:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={diagnosisInput}
                onChange={(e) => setDiagnosisInput(e.target.value)}
                placeholder="مثال: تحسن في التئام الجرح واستمرار العلاج..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleSaveDiagnosis}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                حفظ
              </button>
            </div>
            {savedSuccess && (
              <div className="text-emerald-400 text-xs flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تم توثيق التشخيص في السجل الطبي بنجاح!</span>
              </div>
            )}
          </div>

          {/* Prescriptions */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">الوصفات الدوائية النشطة ({prescriptions.length}):</span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="bg-slate-900/70 p-1.5 px-2.5 rounded border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{rx.name} - <span className="text-slate-400 text-[11px]">{rx.dose}</span></span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded text-[10px]">{rx.status}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddMed} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                placeholder="إضافة دواء جديد للوصفة..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer">
                + إضافة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InteractivePatientPreview = () => {
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);
  const [activeQrTab, setActiveQrTab] = useState('card');

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 shadow-2xl text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">البطاقة الطبية الرقمية الموحدة</div>
            <div className="text-slate-400 text-xs">ملف المريض: أحمد خليل المصري (P-10492)</div>
          </div>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
          هوية موثقة
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Digital Card Preview */}
        <div className="md:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/60 p-4 rounded-xl border border-sky-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-sky-400 uppercase">GazaCare Emergency Card</span>
            <span className="bg-rose-500 text-white font-black px-2 py-0.5 rounded text-xs shadow-md">O+</span>
          </div>

          <div className="space-y-1">
            <div className="text-base font-black text-white">أحمد خليل المصري</div>
            <div className="text-xs text-slate-400">رقم الهوية: 401234567 | العمر: 34</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">الحساسية الدوائية:</span>
              <span className="text-rose-400 font-bold">البنسلين (Penicillin)</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">جهة الاتصال للطوارئ:</span>
              <span className="text-emerald-400 font-bold">0599-123456 (الأخ)</span>
            </div>
          </div>

          {/* QR Simulated */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[8px] text-white font-mono">
                  [ QR ]
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                امسح الرمز للطوارئ بدون إنترنت
              </div>
            </div>
          </div>
        </div>

        {/* Patient Actions & Active Meds */}
        <div className="md:col-span-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300">الأدوية المجدولة اليوم:</div>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-xs">Paracetamol 500mg</div>
                <div className="text-[11px] text-slate-400">الجرعة القادمة: 02:00 م</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold">تم التذكير</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-xs">Augmentin 625mg</div>
                <div className="text-[11px] text-slate-400">الجرعة القادمة: 08:00 م</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">نشط</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setEmergencyAlertSent(true);
                setTimeout(() => setEmergencyAlertSent(false), 3000);
              }}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>إرسال إشعار استغاثة طارئ للمستشفى</span>
            </button>
            {emergencyAlertSent && (
              <div className="mt-2 text-center text-xs text-rose-400 font-bold animate-pulse">
                تم إرسال إشعار الطوارئ وموقعك إلى أقرب طاقم طبي بنجاح!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InteractiveHospitalPreview = () => {
  const [beds, setBeds] = useState([
    { id: 'BED-101', dept: 'طوارئ', status: 'occupied', patient: 'أحمد المصري' },
    { id: 'BED-102', dept: 'طوارئ', status: 'available', patient: 'متاح' },
    { id: 'BED-201', dept: 'عناية مركزة ICU', status: 'occupied', patient: 'سالم حلس' },
    { id: 'BED-202', dept: 'عناية مركزة ICU', status: 'occupied', patient: 'مريم النجار' },
    { id: 'BED-301', dept: 'جراحة عامة', status: 'available', patient: 'متاح' },
    { id: 'BED-302', dept: 'جراحة عامة', status: 'maintenance', patient: 'صيانة' },
  ]);
  const [oxygenLevel, setOxygenLevel] = useState(88);
  const [bloodUnitsO, setBloodUnitsO] = useState(14);

  const toggleBed = (id) => {
    setBeds(beds.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'available' ? 'occupied' : 'available';
        return { ...b, status: nextStatus, patient: nextStatus === 'occupied' ? 'مريض جديد' : 'متاح' };
      }
      return b;
    }));
  };

  const occupiedCount = beds.filter(b => b.status === 'occupied').length;
  const occupancyPercent = Math.round((occupiedCount / beds.length) * 100);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 shadow-2xl text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Bed className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">لوحة إدارة السعة السريرية والموارد الحيوية</div>
            <div className="text-slate-400 text-xs">مجمع الشفاء الطبي - غرفة العمليات المركزية</div>
          </div>
        </div>
        <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
          تحديث مباشر
        </span>
      </div>

      {/* Critical metrics summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">إشغال الأسرّة اللحظي</div>
          <div className="text-lg font-black text-amber-400 mt-1">{occupancyPercent}%</div>
          <div className="text-[10px] text-slate-400">{occupiedCount} مشغول من أصل {beds.length}</div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">مخزون الأكسجين المركزي</div>
          <div className="text-lg font-black text-sky-400 mt-1">{oxygenLevel}%</div>
          <div className="flex gap-1 mt-1">
            <button onClick={() => setOxygenLevel(v => Math.min(100, v + 5))} className="px-1 py-0.5 bg-slate-800 rounded text-[9px] cursor-pointer">+ شحن</button>
            <button onClick={() => setOxygenLevel(v => Math.max(10, v - 5))} className="px-1 py-0.5 bg-slate-800 rounded text-[9px] cursor-pointer">- استهلاك</button>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">بنك الدم (فصيلة O-)</div>
          <div className="text-lg font-black text-rose-400 mt-1">{bloodUnitsO} وحدة</div>
          <div className="flex gap-1 mt-1">
            <button onClick={() => setBloodUnitsO(v => v + 1)} className="px-1 py-0.5 bg-slate-800 rounded text-[9px] cursor-pointer">+ تبرع</button>
            <button onClick={() => setBloodUnitsO(v => Math.max(0, v - 1))} className="px-1 py-0.5 bg-slate-800 rounded text-[9px] cursor-pointer">- صرف</button>
          </div>
        </div>
      </div>

      {/* Bed Grid - Click to toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300 text-xs">خريطة الأسرّة التفاعلية (اضغط على السرير لتغيير حالته):</span>
          <span className="text-[11px] text-slate-400">أخضر: متاح | أحمر: مشغول</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {beds.map(bed => (
            <button
              key={bed.id}
              onClick={() => toggleBed(bed.id)}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                bed.status === 'occupied'
                  ? 'bg-rose-950/40 border-rose-500/40 hover:bg-rose-900/50 text-white'
                  : bed.status === 'available'
                  ? 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/50 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{bed.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  bed.status === 'occupied' ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {bed.status === 'occupied' ? 'مشغول' : 'متاح'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">{bed.dept}</div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">{bed.patient}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const InteractiveLabPreview = () => {
  const [testValue, setTestValue] = useState(6.8);
  const [criticalSent, setCriticalSent] = useState(false);

  const isCritical = testValue < 7.0 || testValue > 18.0;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 shadow-2xl text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">نظام التحاليل المخبرية والتنبيه الحرج (LIMS)</div>
            <div className="text-slate-400 text-xs">فحص الهيموجلوبين (Hemoglobin - CBC)</div>
          </div>
        </div>
        <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
          معتمد طبياً
        </span>
      </div>

      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-sm">المريض: أحمد خليل المصري (P-10492)</div>
            <div className="text-slate-400 text-xs">طلب فحص رقم: #LAB-8812 - فحص دم شامل CBC</div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">النطاق الطبيعي: 13.0 - 17.5 g/dL</span>
        </div>

        {/* Input simulator */}
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-xs text-slate-300">أدخل نتيجة فحص الهيموجلوبين (Hb):</label>
            <span className={`text-xs font-black px-2 py-0.5 rounded ${
              isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isCritical ? '⚠️ قيمة حرجة (Panic Value)' : 'ضمن المعدل الطبيعي'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="4"
              max="20"
              step="0.1"
              value={testValue}
              onChange={(e) => setTestValue(parseFloat(e.target.value))}
              className="flex-1 accent-teal-500 cursor-pointer"
            />
            <div className="font-mono text-base font-black text-white bg-slate-950 px-3 py-1 rounded border border-slate-700">
              {testValue.toFixed(1)} <span className="text-xs text-slate-400">g/dL</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isCritical ? (
          <div className="space-y-2">
            <button
              onClick={() => {
                setCriticalSent(true);
                setTimeout(() => setCriticalSent(false), 3000);
              }}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>إرسال تنبيه حرج فوري (Critical Panic Alert) لهاتف الطبيب المعالج</span>
            </button>
            {criticalSent && (
              <div className="text-center text-xs text-rose-400 font-bold bg-rose-950/40 p-2 rounded border border-rose-800 animate-fade-in">
                🚨 تم إرسال إشعار فوري لطبيب المريض (د. يوسف النجار) بنجاح لتجهيز وحدة دم عاجلة!
              </div>
            )}
          </div>
        ) : (
          <button className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer">
            اعتماد التقرير وإرساله لسجل المريض الطبي
          </button>
        )}
      </div>
    </div>
  );
};
