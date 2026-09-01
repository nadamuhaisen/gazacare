import React, { useState, useEffect } from 'react';
import { laboratoryService } from '../../services/laboratoryService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  Save,
  AlertTriangle,
  Printer,
  Sparkles,
  TestTube2,
  FileCheck,
  ShieldAlert,
  Send,
  SlidersHorizontal,
  QrCode
} from 'lucide-react';

const TEST_TEMPLATES = {
  cbc: {
    name: 'صورة الدم الكاملة (CBC)',
    category: 'أمراض الدم (Hematology)',
    sampleType: 'دم وريدي (EDTA Tube - بنفسجي)',
    params: [
      { name: 'الهيموجلوبين (Hb)', value: '13.8', unit: 'g/dL', normalRange: '13.5 - 17.5', min: 13.5, max: 17.5, panicMin: 7.0, panicMax: 20.0 },
      { name: 'كريات الدم البيضاء (WBC)', value: '6.5', unit: 'x10^3/uL', normalRange: '4.0 - 11.0', min: 4.0, max: 11.0, panicMin: 2.0, panicMax: 30.0 },
      { name: 'الصفائح الدموية (Platelets)', value: '230', unit: 'x10^3/uL', normalRange: '150 - 450', min: 150, max: 450, panicMin: 50, panicMax: 1000 },
      { name: 'كريات الدم الحمراء (RBC)', value: '4.7', unit: 'x10^6/uL', normalRange: '4.3 - 5.9', min: 4.3, max: 5.9, panicMin: 2.5, panicMax: 7.0 },
      { name: 'حجم الخلايا المكدسة (HCT)', value: '41.2', unit: '%', normalRange: '40.0 - 52.0', min: 40.0, max: 52.0, panicMin: 20.0, panicMax: 60.0 }
    ],
    defaultNote: 'نتائج خلايا الدم ومؤشرات كريات الدم الحمراء والبيضاء والصفائح طبيعية.'
  },
  kft: {
    name: 'وظائف الكلى والشوارد (KFT & Electrolytes)',
    category: 'كيمياء سريرية (Clinical Chemistry)',
    sampleType: 'مصل الدم (Serum Tube - أحمر/ذهبي)',
    params: [
      { name: 'الكرياتينين (Creatinine)', value: '1.0', unit: 'mg/dL', normalRange: '0.7 - 1.3', min: 0.7, max: 1.3, panicMin: 0.2, panicMax: 4.0 },
      { name: 'اليوريا في الدم (BUN)', value: '16', unit: 'mg/dL', normalRange: '7 - 20', min: 7, max: 20, panicMin: 3, panicMax: 80 },
      { name: 'البوتاسيوم (Potassium - K+)', value: '4.2', unit: 'mmol/L', normalRange: '3.5 - 5.0', min: 3.5, max: 5.0, panicMin: 2.8, panicMax: 6.0 },
      { name: 'الصوديوم (Sodium - Na+)', value: '140', unit: 'mmol/L', normalRange: '135 - 145', min: 135, max: 145, panicMin: 120, panicMax: 160 }
    ],
    defaultNote: 'وظائف الكلى وتوازن الأملاح والشوارد ضمن النطاق الفسيولوجي الطبيعي.'
  },
  lft: {
    name: 'وظائف الكبد والإنزيمات (LFT Panel)',
    category: 'كيمياء سريرية (Clinical Chemistry)',
    sampleType: 'مصل الدم (Serum Tube - أحمر/ذهبي)',
    params: [
      { name: 'إنزيم الكبد (ALT/GPT)', value: '28', unit: 'U/L', normalRange: '10 - 40', min: 10, max: 40, panicMin: 0, panicMax: 300 },
      { name: 'إنزيم الكبد (AST/GOT)', value: '24', unit: 'U/L', normalRange: '10 - 38', min: 10, max: 38, panicMin: 0, panicMax: 300 },
      { name: 'البيليروبين الكلي (Total Bilirubin)', value: '0.8', unit: 'mg/dL', normalRange: '0.2 - 1.2', min: 0.2, max: 1.2, panicMin: 0, panicMax: 10.0 },
      { name: 'الألبومين (Serum Albumin)', value: '4.2', unit: 'g/dL', normalRange: '3.5 - 5.2', min: 3.5, max: 5.2, panicMin: 2.0, panicMax: 6.5 }
    ],
    defaultNote: 'إنزيمات وخلايا الكبد والبروتينات الكلية سليمة.'
  },
  cardiac: {
    name: 'إنزيمات القلب الحادة (Cardiac Troponin I & CK-MB)',
    category: 'طوارئ وعناية قلبية (Cardiology STAT)',
    sampleType: 'مصل الدم أو بلازما (Lithium Heparin)',
    params: [
      { name: 'التروبونين عالي الحساسية (hs-cTnI)', value: '0.01', unit: 'ng/mL', normalRange: '< 0.04 (سلبي)', min: 0, max: 0.04, panicMin: 0, panicMax: 0.1 },
      { name: 'إنزيم عضلة القلب (CK-MB)', value: '14', unit: 'U/L', normalRange: '5 - 25', min: 5, max: 25, panicMin: 0, panicMax: 80 }
    ],
    defaultNote: 'المؤشرات الحيوية لنقص تروية عضلة القلب سلبية (Negative for Myocardial Infarction).'
  },
  abg: {
    name: 'غازات الدم الشرياني (Arterial Blood Gas - ABG)',
    category: 'طوارئ وعناية مركزة (Critical Care)',
    sampleType: 'دم شرياني (Heparinized Syringe)',
    params: [
      { name: 'درجة حموضة الدم (pH)', value: '7.38', unit: 'pH', normalRange: '7.35 - 7.45', min: 7.35, max: 7.45, panicMin: 7.20, panicMax: 7.60 },
      { name: 'ضغط ثاني أكسيد الكربون (pCO2)', value: '40', unit: 'mmHg', normalRange: '35 - 45', min: 35, max: 45, panicMin: 20, panicMax: 65 },
      { name: 'ضغط الأكسجين الشرياني (pO2)', value: '92', unit: 'mmHg', normalRange: '80 - 100', min: 80, max: 100, panicMin: 55, panicMax: 150 },
      { name: 'البيكربونات (HCO3-)', value: '24', unit: 'mmol/L', normalRange: '22 - 28', min: 22, max: 28, panicMin: 15, panicMax: 35 },
      { name: 'تشبع الأكسجين الشرياني (SaO2)', value: '98', unit: '%', normalRange: '95 - 100', min: 95, max: 100, panicMin: 85, panicMax: 100 }
    ],
    defaultNote: 'التبادل الغازي الرئوي والتوازن الحمضي القاعدي معتدل وسليم.'
  },
  blood_typing: {
    name: 'فصيلة الدم والتطابق (Blood Group & Rh Typing)',
    category: 'بنك الدم (Blood Bank)',
    sampleType: 'دم وريدي (EDTA Tube - بنفسجي)',
    params: [
      { name: 'فصيلة الدم (ABO Group)', value: 'O (أو)', unit: 'Group', normalRange: 'A / B / AB / O', min: 0, max: 999 },
      { name: 'العامل الرايزيسي (Rh Factor)', value: 'موجب (Rh+ Positive)', unit: 'D-Antigen', normalRange: 'Positive / Negative', min: 0, max: 999 },
      { name: 'الأجسام المضادة غير المنتظمة', value: 'سلبي (Negative)', unit: 'Screen', normalRange: 'Negative', min: 0, max: 999 }
    ],
    defaultNote: 'تم فحص التطابق المباشر والمصلي مع توثيق الفصيلة في بطاقة الطوارئ.'
  }
};

export const LabRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [search, setSearch] = useState('');
  
  const [selectedReq, setSelectedReq] = useState(null);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [activeBarcodeReq, setActiveBarcodeReq] = useState(null);

  // Form state
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('cbc');
  const [parameters, setParameters] = useState(TEST_TEMPLATES.cbc.params);
  const [notes, setNotes] = useState(TEST_TEMPLATES.cbc.defaultNote);
  const [hasPanicValue, setHasPanicValue] = useState(false);

  // New Walk-in Sample Form
  const [walkinPatient, setWalkinPatient] = useState({
    name: '',
    mrn: 'P-' + Math.floor(10000 + Math.random() * 90000),
    nationalId: '',
    doctorName: 'د. هالة منير النجار',
    testType: 'cbc',
    priority: 'عادي',
    hospital: 'مجمع الشفاء الطبي - المختبر المركزي'
  });

  const { addToast } = useNotification();

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await laboratoryService.getLabRequests();
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const evaluateParameterStatus = (valStr, param) => {
    const num = parseFloat(valStr);
    if (isNaN(num)) return 'normal';
    if (param.panicMin !== undefined && num <= param.panicMin) return 'critical';
    if (param.panicMax !== undefined && num >= param.panicMax) return 'critical';
    if (param.min !== undefined && num < param.min) return 'low';
    if (param.max !== undefined && num > param.max) return 'high';
    return 'normal';
  };

  const handleOpenEntry = (req) => {
    setSelectedReq(req);
    // Find matching template or default to cbc
    let templateKey = 'cbc';
    const testLower = req.testName.toLowerCase();
    if (testLower.includes('كلى') || testLower.includes('kidney') || testLower.includes('kft')) templateKey = 'kft';
    else if (testLower.includes('كبد') || testLower.includes('liver') || testLower.includes('lft')) templateKey = 'lft';
    else if (testLower.includes('قلب') || testLower.includes('troponin') || testLower.includes('cardiac')) templateKey = 'cardiac';
    else if (testLower.includes('غازات') || testLower.includes('abg')) templateKey = 'abg';
    else if (testLower.includes('فصيلة') || testLower.includes('blood group')) templateKey = 'blood_typing';

    setSelectedTemplateKey(templateKey);
    const tmpl = TEST_TEMPLATES[templateKey];
    setParameters(tmpl.params.map(p => ({ ...p, status: evaluateParameterStatus(p.value, p) })));
    setNotes(tmpl.defaultNote);
    setHasPanicValue(false);
    setEntryModalOpen(true);
  };

  const handleApplyTemplate = (key) => {
    setSelectedTemplateKey(key);
    const tmpl = TEST_TEMPLATES[key];
    setParameters(tmpl.params.map(p => ({ ...p, status: evaluateParameterStatus(p.value, p) })));
    setNotes(tmpl.defaultNote);
  };

  const handleParamChange = (index, field, val) => {
    const updated = [...parameters];
    updated[index][field] = val;
    if (field === 'value') {
      const status = evaluateParameterStatus(val, updated[index]);
      updated[index].status = status;
    }
    setParameters(updated);

    // check if any is critical
    const isCritical = updated.some(p => p.status === 'critical');
    setHasPanicValue(isCritical);
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        requestId: selectedReq?.id,
        patientName: selectedReq?.patientName || 'مريض مجهول',
        patientMrn: selectedReq?.patientMrn || selectedReq?.patientId || 'P-10492',
        testName: selectedReq?.testName || TEST_TEMPLATES[selectedTemplateKey].name,
        doctorName: selectedReq?.doctorName || 'د. إبراهيم القدوة',
        analystName: 'أ. خليل المصري (أخصائي تحاليل أول)',
        hospital: selectedReq?.hospital || 'مجمع الشفاء الطبي',
        parameters: parameters,
        notes: notes,
        isCritical: hasPanicValue
      };

      const res = await laboratoryService.submitLabResult(payload);
      if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== selectedReq?.id));
        setEntryModalOpen(false);
        addToast({
          title: hasPanicValue ? '⚠️ تم قيد نتيجة حرجة وإخطار الطبيب' : 'تم اعتماد وترحيل النتيجة',
          message: hasPanicValue 
            ? 'تم إرسال إشعار فوري وتنبيه أحمر للعيادة والطبيب المعالج' 
            : 'تم ترحيل التقرير المخبري المعتمد إلى السجل الطبي الموحد بنجاح',
          type: hasPanicValue ? 'warning' : 'success'
        });
      }
    } catch {
      addToast({ title: 'خطأ', message: 'فشل حفظ نتيجة الفحص', type: 'error' });
    }
  };

  const handleCreateWalkin = async (e) => {
    e.preventDefault();
    if (!walkinPatient.name.trim()) {
      addToast({ title: 'تنبيه', message: 'يرجى إدخال اسم المريض', type: 'warning' });
      return;
    }

    const tmpl = TEST_TEMPLATES[walkinPatient.testType];
    const newReq = {
      patientName: walkinPatient.name,
      patientMrn: walkinPatient.mrn,
      patientId: walkinPatient.mrn,
      doctorName: walkinPatient.doctorName,
      testName: tmpl.name,
      category: tmpl.category,
      sampleType: tmpl.sampleType,
      priority: walkinPatient.priority,
      hospital: walkinPatient.hospital
    };

    const res = await laboratoryService.createRequest(newReq);
    if (res.success) {
      setRequests(prev => [res.data, ...prev]);
      setNewRequestModalOpen(false);
      setWalkinPatient({
        name: '',
        mrn: 'P-' + Math.floor(10000 + Math.random() * 90000),
        nationalId: '',
        doctorName: 'د. هالة منير النجار',
        testType: 'cbc',
        priority: 'عادي',
        hospital: 'مجمع الشفاء الطبي - المختبر المركزي'
      });
      addToast({
        title: 'تم تسجيل العينة وطباعة الباركود',
        message: `تم إضافة فحص ${tmpl.name} إلى قائمة العمل المخبري بنجاح`,
        type: 'success'
      });
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchSearch = (r.patientName || '').includes(search) || 
                        (r.testName || '').includes(search) || 
                        (r.patientMrn || r.patientId || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || (r.category || '').includes(filterCategory);
    const matchPri = filterPriority === 'all' || (filterPriority === 'urgent' ? (r.priority === 'عاجل' || r.priority === 'حرج' || r.priority === 'urgent') : r.priority === 'عادي' || r.priority === 'routine');
    return matchSearch && matchCat && matchPri;
  });

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            طلبات وعينات الفحص المخبري الواردة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            استلام العينات، مسح باركود الأنابيب، وإدخال النتائج البيوكيميائية والدموية المعتمدة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            onClick={() => setNewRequestModalOpen(true)}
          >
            استقبال وتسجيل عينة جديدة
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم المريض، رقم الملف، أو اسم الفحص..."
              className="w-full pr-10 pl-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
            >
              <option value="all">كافة الأولويات</option>
              <option value="urgent">🔴 عاجل وطارئ STAT</option>
              <option value="routine">🟢 روتيني عادي</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
            >
              <option value="all">جميع التخصصات المخبرية</option>
              <option value="Hematology">أمراض الدم (Hematology)</option>
              <option value="Chemistry">كيمياء سريرية (Biochemistry)</option>
              <option value="Critical">طوارئ وغازات (Critical Care)</option>
              <option value="Blood Bank">بنك الدم (Blood Bank)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            <FlaskConical className="w-12 h-12 mx-auto text-slate-300 mb-2 opacity-50" />
            <p className="text-sm font-bold">لا توجد طلبات مطابقة للبحث حالياً</p>
          </Card>
        ) : (
          filteredRequests.map((req) => (
            <Card key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono shrink-0 ${
                  req.priority === 'عاجل' || req.priority === 'حرج' || req.priority === 'urgent'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 ring-2 ring-rose-500/30 animate-pulse'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                }`}>
                  <TestTube2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {req.testName}
                    </h4>
                    <Badge variant={req.priority === 'عاجل' || req.priority === 'حرج' || req.priority === 'urgent' ? 'danger' : 'warning'} size="sm">
                      {req.priority === 'عاجل' || req.priority === 'حرج' || req.priority === 'urgent' ? 'عاجل STAT' : 'روتيني'}
                    </Badge>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {req.barcode || req.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    المريض: <strong className="text-slate-800 dark:text-slate-200">{req.patientName}</strong> ({req.patientId || req.patientMrn}) • الطبيب الطالب: {req.doctorName}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>الأنبوبة: {req.sampleType || 'EDTA'}</span>
                    <span>•</span>
                    <span>الموقع: {req.hospital}</span>
                    <span>•</span>
                    <span>الوقت: {req.requestedDate || req.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  icon={QrCode}
                  onClick={() => {
                    setActiveBarcodeReq(req);
                    setBarcodeModalOpen(true);
                  }}
                >
                  الباركود
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={PlusCircle}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={() => handleOpenEntry(req)}
                >
                  إدخال النتيجة
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Result Entry Modal */}
      {entryModalOpen && (
        <Modal
          isOpen={entryModalOpen}
          onClose={() => setEntryModalOpen(false)}
          title={`إدخال نتائج التحليل: ${selectedReq?.testName || 'فحص مخبري'}`}
        >
          <form onSubmit={handleSaveResult} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span><strong>المريض:</strong> {selectedReq?.patientName} ({selectedReq?.patientMrn || selectedReq?.patientId})</span>
                <span className="font-mono text-emerald-600 font-bold">{selectedReq?.barcode || selectedReq?.id}</span>
              </div>
              <p><strong>الطبيب المعالج:</strong> {selectedReq?.doctorName} • <strong>الأنبوبة:</strong> {selectedReq?.sampleType}</p>
            </div>

            {/* Template Presets Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>تحميل نموذج فحص جاهز (Quick Test Presets):</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(TEST_TEMPLATES).map(([k, tmpl]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleApplyTemplate(k)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTemplateKey === k
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                    }`}
                  >
                    {tmpl.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Panic Value Alert Banner */}
            {hasPanicValue && (
              <div className="p-3 rounded-xl bg-rose-500 text-white text-xs font-bold flex items-center gap-2 animate-bounce">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>تحذير: تم رصد قيمة حرجة (Panic Value) تتطلب تدخلاً علاجياً فورياً! سيتم إخطار الطبيب تلقائياً.</span>
              </div>
            )}

            {/* Parameters Table Inputs */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                المؤشرات والنتائج المقاسة (Parameters & Measured Values)
              </label>

              {parameters.map((p, idx) => (
                <div key={idx} className={`p-3 rounded-xl border transition-all ${
                  p.status === 'critical'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200'
                    : p.status === 'high' || p.status === 'low'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center">
                    <div className="sm:col-span-4">
                      <span className="text-[10px] text-slate-400 block">المؤشر</span>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleParamChange(idx, 'name', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-900 font-bold dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-[10px] text-slate-400 block">النتيجة</span>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => handleParamChange(idx, 'value', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-[10px] text-slate-400 block">الوحدة والمعدل</span>
                      <div className="text-[11px] text-slate-500 font-mono py-1">
                        {p.unit} ({p.normalRange})
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 block">التقييم</span>
                      <Badge variant={p.status === 'critical' ? 'danger' : p.status === 'high' || p.status === 'low' ? 'warning' : 'success'} size="sm">
                        {p.status === 'critical' ? 'حرج ⚠️' : p.status === 'high' ? 'مرتفع ↑' : p.status === 'low' ? 'منخفض ↓' : 'طبيعي ✓'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">تقرير وملاحظات أخصائي المختبر</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setEntryModalOpen(false)}>
                إلغاء
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                icon={Save}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                اعتماد وترحيل النتيجة للسجل
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* New Sample Intake Modal */}
      {newRequestModalOpen && (
        <Modal
          isOpen={newRequestModalOpen}
          onClose={() => setNewRequestModalOpen(false)}
          title="استقبال وتسجيل عينة فحص جديدة (Sample Reception)"
        >
          <form onSubmit={handleCreateWalkin} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">اسم المريض الكامل</label>
                <input
                  type="text"
                  value={walkinPatient.name}
                  onChange={(e) => setWalkinPatient({ ...walkinPatient, name: e.target.value })}
                  placeholder="مثال: خليل إبراهيم عودة"
                  className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-bold dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">رقم الهوية / الملف</label>
                <input
                  type="text"
                  value={walkinPatient.mrn}
                  onChange={(e) => setWalkinPatient({ ...walkinPatient, mrn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-mono dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">نوع الفحص المطلوب</label>
                <select
                  value={walkinPatient.testType}
                  onChange={(e) => setWalkinPatient({ ...walkinPatient, testType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-bold dark:text-white"
                >
                  <option value="cbc">صورة الدم الكاملة (CBC)</option>
                  <option value="kft">وظائف الكلى والشوارد (KFT)</option>
                  <option value="lft">وظائف الكبد والإنزيمات (LFT)</option>
                  <option value="cardiac">إنزيمات القلب الحادة (Troponin)</option>
                  <option value="abg">غازات الدم الشرياني (ABG)</option>
                  <option value="blood_typing">فصيلة الدم والتطابق (Blood Group)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">أولوية العينة</label>
                <select
                  value={walkinPatient.priority}
                  onChange={(e) => setWalkinPatient({ ...walkinPatient, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-bold dark:text-white"
                >
                  <option value="عادي">روتيني عادي</option>
                  <option value="عاجل">🔴 طوارئ عاجل STAT (أولوية قصوى)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 dark:text-emerald-200">
              <p><strong>نوع الأنبوبة المخصصة:</strong> {TEST_TEMPLATES[walkinPatient.testType].sampleType}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewRequestModalOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={PlusCircle} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                توليد الباركود وإضافة العينة
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Barcode Label Modal */}
      {barcodeModalOpen && activeBarcodeReq && (
        <Modal
          isOpen={barcodeModalOpen}
          onClose={() => setBarcodeModalOpen(false)}
          title="ملصق باركود أنبوبة التحليل (Tube Barcode Label)"
        >
          <div className="space-y-4 text-center">
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-800 text-slate-900 space-y-2 inline-block w-full max-w-sm shadow-md">
              <div className="text-xs font-black border-b border-slate-300 pb-1 flex justify-between items-center">
                <span>وزارة الصحة - مجمع الشفاء</span>
                <span>{activeBarcodeReq.priority === 'عاجل' ? '🔴 STAT' : 'ROUTINE'}</span>
              </div>

              <div className="text-sm font-bold text-right pt-1">
                {activeBarcodeReq.patientName}
              </div>
              <div className="text-xs text-right text-slate-600 font-mono">
                MRN: {activeBarcodeReq.patientMrn || activeBarcodeReq.patientId} • {activeBarcodeReq.testName}
              </div>

              {/* Barcode Representation */}
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="h-12 w-48 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_7px,#fff_7px,#fff_8px,#000_8px,#000_12px)] rounded" />
                <span className="font-mono text-xs tracking-widest font-black mt-1">
                  {activeBarcodeReq.barcode || activeBarcodeReq.id}
                </span>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-300 pt-1 flex justify-between">
                <span>{activeBarcodeReq.sampleType || 'EDTA Tube'}</span>
                <span>2026-09-01</span>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setBarcodeModalOpen(false)}>
                إغلاق
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Printer}
                className="bg-slate-900 text-white"
                onClick={() => {
                  window.print();
                  addToast({ title: 'جاري الطباعة', message: 'تم إرسال ملصق الباركود لطابعة الأنابيب Zebra', type: 'info' });
                }}
              >
                طباعة الملصق
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

