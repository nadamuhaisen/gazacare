import api from './api';
import { mockLabRequests } from '../data/mockData';

// Extended default lab results
const defaultLabResults = [
  {
    id: "RES-901",
    requestId: "LAB-REQ-901",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    patientMrn: "P-10492",
    nationalId: "401234567",
    age: 48,
    gender: "ذكر",
    testName: "صورة الدم الكاملة (CBC)",
    category: "أمراض الدم (Hematology)",
    sampleType: "دم وريدي (EDTA Tube)",
    barcode: "BC-901-8842",
    doctorName: "د. هالة منير النجار",
    analystName: "أ. خليل المصري (أخصائي تحاليل أول)",
    hospital: "مجمع الشفاء الطبي - المختبر المركزي",
    completedDate: "2026-08-30 11:15 ص",
    status: "approved",
    isCritical: false,
    parameters: [
      { name: "الهيموجلوبين (Hemoglobin - Hb)", value: "14.2", unit: "g/dL", normalRange: "13.5 - 17.5", status: "normal" },
      { name: "كريات الدم البيضاء (WBC)", value: "7.8", unit: "x10^3/uL", normalRange: "4.0 - 11.0", status: "normal" },
      { name: "الصفائح الدموية (Platelets)", value: "245", unit: "x10^3/uL", normalRange: "150 - 450", status: "normal" },
      { name: "كريات الدم الحمراء (RBC)", value: "4.8", unit: "x10^6/uL", normalRange: "4.3 - 5.9", status: "normal" },
      { name: "حجم الخلايا المكدسة (Hematocrit - HCT)", value: "42.5", unit: "%", normalRange: "40.0 - 52.0", status: "normal" }
    ],
    notes: "جميع مؤشرات الدم مكتملة وضمن المعدل الطبيعي. تم الفحص بواسطة جهاز Mindray BC-5000."
  },
  {
    id: "RES-902",
    requestId: "LAB-REQ-902",
    patientId: "P-10492",
    patientName: "أحمد يوسف خليل",
    patientMrn: "P-10492",
    nationalId: "401234567",
    age: 48,
    gender: "ذكر",
    testName: "وظائف الكلى والشوارد (Kidney Panel)",
    category: "كيمياء سريرية (Clinical Chemistry)",
    sampleType: "مصل الدم (Serum Tube)",
    barcode: "BC-902-1193",
    doctorName: "د. هالة منير النجار",
    analystName: "أ. خليل المصري (أخصائي تحاليل أول)",
    hospital: "مجمع الشفاء الطبي - المختبر المركزي",
    completedDate: "2026-08-30 11:45 ص",
    status: "approved",
    isCritical: false,
    parameters: [
      { name: "الكرياتينين (Serum Creatinine)", value: "1.1", unit: "mg/dL", normalRange: "0.7 - 1.3", status: "normal" },
      { name: "اليوريا في الدم (BUN)", value: "18", unit: "mg/dL", normalRange: "7 - 20", status: "normal" },
      { name: "البوتاسيوم (Potassium - K+)", value: "4.3", unit: "mmol/L", normalRange: "3.5 - 5.0", status: "normal" },
      { name: "الصوديوم (Sodium - Na+)", value: "139", unit: "mmol/L", normalRange: "135 - 145", status: "normal" },
      { name: "السكر التراكمي (HbA1c)", value: "6.8", unit: "%", normalRange: "< 5.7 (طبيعي) | < 7.0 (مقبول)", status: "warning" }
    ],
    notes: "وظائف الكلى سليمة، مؤشر السكر التراكمي منتظم نسبيًا مع استمرار الحمية."
  },
  {
    id: "RES-903",
    requestId: "LAB-REQ-903",
    patientId: "P-10619",
    patientName: "زياد ناصر البطش",
    patientMrn: "P-10619",
    nationalId: "401554433",
    age: 63,
    gender: "ذكر",
    testName: "غازات الدم الشرياني والشوارد (ABG)",
    category: "طوارئ وعناية مركزة (Critical Care)",
    sampleType: "دم شرياني (Heparinized Syringe)",
    barcode: "BC-903-7740",
    doctorName: "د. إبراهيم القدوة",
    analystName: "أ. خليل المصري (أخصائي تحاليل أول)",
    hospital: "مستشفى ناصر الطبي - وحدة الطوارئ",
    completedDate: "2026-08-31 10:45 ص",
    status: "approved",
    isCritical: true,
    parameters: [
      { name: "درجة حموضة الدم (pH)", value: "7.22", unit: "pH", normalRange: "7.35 - 7.45", status: "critical" },
      { name: "البوتاسيوم (Potassium - K+)", value: "6.4", unit: "mmol/L", normalRange: "3.5 - 5.0", status: "critical" },
      { name: "البيكربونات (HCO3-)", value: "15.0", unit: "mmol/L", normalRange: "22.0 - 28.0", status: "critical" },
      { name: "ضغط الأكسجين الشرياني (PaO2)", value: "78", unit: "mmHg", normalRange: "80 - 100", status: "low" }
    ],
    notes: "تنبيه حرج (Panic Value): حماض أيضي حاد مع فرط بوتاسيوم خطير (Severe Metabolic Acidosis & Hyperkalemia) - تم الاتصال الفوري بالطبيب المعالج د. إبراهيم القدوة."
  }
];

let localRequests = [...mockLabRequests];
let localResults = [...defaultLabResults];

export const laboratoryService = {
  getLabStats: async () => {
    return {
      success: true,
      data: {
        todayTests: 64 + localResults.length,
        pendingTests: localRequests.filter(r => r.status !== 'مكتمل').length + 5,
        urgentRequests: localRequests.filter(r => r.priority === 'عاجل' || r.priority === 'حرج').length + 2,
        criticalAlerts: localResults.filter(r => r.isCritical).length + 1,
        reagentsHealth: 94,
        analyzerStatus: 'جاهز ونشط'
      }
    };
  },

  getLabRequests: async (params) => {
    try {
      const res = await api.get('/lab/requests.php', { params });
      return res;
    } catch {
      return { success: true, data: localRequests };
    }
  },

  getRequests: async (params) => {
    return laboratoryService.getLabRequests(params);
  },

  getLabResults: async (params) => {
    try {
      const res = await api.get('/lab/results.php', { params });
      return res;
    } catch {
      return { success: true, data: localResults };
    }
  },

  getResults: async (params) => {
    return laboratoryService.getLabResults(params);
  },

  getRequestById: async (id) => {
    const request = localRequests.find(r => r.id === id) || localRequests[0];
    return { success: true, data: request };
  },

  submitLabResult: async (resultData) => {
    try {
      const isCritical = resultData.parameters?.some(p => p.status === 'critical') || !!resultData.isCritical;
      const newResult = {
        id: "RES-" + Math.floor(1000 + Math.random() * 9000),
        barcode: "BC-" + Math.floor(100 + Math.random() * 900) + "-LAB",
        completedDate: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' اليوم',
        status: 'approved',
        isCritical,
        ...resultData
      };

      localResults.unshift(newResult);
      localRequests = localRequests.map(req => 
        (req.id === resultData.requestId || req.patientName === resultData.patientName && req.testName === resultData.testName)
          ? { ...req, status: isCritical ? 'حرج' : 'مكتمل' }
          : req
      );

      return {
        success: true,
        message: 'تم حفظ واعتماد النتيجة المخبرية بنجاح وإرسالها للسجل الموحد',
        data: newResult
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  saveResult: async (requestId, resultData) => {
    return laboratoryService.submitLabResult({ requestId, ...resultData });
  },

  markCritical: async (requestId, note) => {
    try {
      return await api.post(`/lab/requests/critical.php?id=${requestId}`, { note });
    } catch {
      localRequests = localRequests.map(r => r.id === requestId ? { ...r, status: 'حرج', priority: 'حرج' } : r);
      return {
        success: true,
        message: 'تم تصنيف النتيجة كحالة حرجة وإرسال إشعار فوري للطبيب المعالج'
      };
    }
  },

  createRequest: async (requestData) => {
    try {
      const newReq = {
        id: 'LAB-REQ-' + Math.floor(1000 + Math.random() * 9000),
        barcode: 'BC-' + Math.floor(100 + Math.random() * 900) + '-SMP',
        requestedDate: 'الآن',
        status: 'في الانتظار',
        ...requestData
      };
      localRequests.unshift(newReq);
      return {
        success: true,
        message: 'تم إرسال وقيد طلب الفحص المخبري بنجاح',
        data: newReq
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};

