import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../ui/Badge';
import { Heart, Activity, Thermometer, Droplet, Wind, Weight, TrendingUp, PlusCircle, Save, Calendar, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const VitalSigns = ({ vitals, showChart = true, compact = false, onAddVital = null, patientId = null, isDoctor = false }) => {
  const [selectedMetric, setSelectedMetric] = useState('bp');
  const [modalOpen, setModalOpen] = useState(false);

  // Modal form state for adding new vitals
  const [form, setForm] = useState({
    systolic: '120',
    diastolic: '80',
    heartRate: '75',
    temperature: '37.0',
    spO2: '98',
    respiratoryRate: '16',
    weight: '70',
    height: '172',
    bloodSugar: '100',
    location: 'المنزل - قياس ذاتي',
    notes: ''
  });

  const rawCurrent = vitals?.current;

  // Determine if vitals are unset / zeroed
  const isUnset = (val) => val === undefined || val === null || val === '--' || val === '' || val === 0;

  const current = {
    heartRate: {
      value: rawCurrent?.heartRate?.value ?? (isUnset(rawCurrent?.heartRate) ? '--' : rawCurrent?.heartRate),
      unit: rawCurrent?.heartRate?.unit || 'نبضة/دقيقة',
      status: rawCurrent?.heartRate?.status || (isUnset(rawCurrent?.heartRate?.value || rawCurrent?.heartRate) ? 'unset' : 'normal')
    },
    bloodPressure: {
      systolic: rawCurrent?.bloodPressure?.systolic ?? (rawCurrent?.bloodPressure?.includes?.('/') ? rawCurrent.bloodPressure.split('/')[0] : '--'),
      diastolic: rawCurrent?.bloodPressure?.diastolic ?? (rawCurrent?.bloodPressure?.includes?.('/') ? rawCurrent.bloodPressure.split('/')[1] : '--'),
      unit: rawCurrent?.bloodPressure?.unit || 'ملم زئبق',
      status: rawCurrent?.bloodPressure?.status || (isUnset(rawCurrent?.bloodPressure?.systolic || rawCurrent?.bloodPressure) ? 'unset' : 'normal')
    },
    temperature: {
      value: rawCurrent?.temperature?.value ?? (isUnset(rawCurrent?.temperature) ? '--' : rawCurrent?.temperature),
      unit: rawCurrent?.temperature?.unit || '°C',
      status: rawCurrent?.temperature?.status || (isUnset(rawCurrent?.temperature?.value || rawCurrent?.temperature) ? 'unset' : 'normal')
    },
    spO2: {
      value: rawCurrent?.spO2?.value ?? (isUnset(rawCurrent?.spO2) ? '--' : rawCurrent?.spO2),
      unit: rawCurrent?.spO2?.unit || '%',
      status: rawCurrent?.spO2?.status || (isUnset(rawCurrent?.spO2?.value || rawCurrent?.spO2) ? 'unset' : 'normal')
    },
    respiratoryRate: {
      value: rawCurrent?.respiratoryRate?.value ?? (isUnset(rawCurrent?.respiratoryRate) ? '--' : rawCurrent?.respiratoryRate),
      unit: rawCurrent?.respiratoryRate?.unit || 'تنفس/دقيقة',
      status: rawCurrent?.respiratoryRate?.status || (isUnset(rawCurrent?.respiratoryRate?.value || rawCurrent?.respiratoryRate) ? 'unset' : 'normal')
    },
    weight: {
      value: rawCurrent?.weight?.value ?? (isUnset(rawCurrent?.weight) ? '--' : rawCurrent?.weight),
      unit: rawCurrent?.weight?.unit || 'كغم',
      status: rawCurrent?.weight?.status || (isUnset(rawCurrent?.weight?.value || rawCurrent?.weight) ? 'unset' : 'normal'),
      bmi: rawCurrent?.weight?.bmi || (rawCurrent?.weight?.value && rawCurrent?.height ? (rawCurrent.weight.value / Math.pow(rawCurrent.height / 100, 2)).toFixed(1) : '--')
    }
  };

  const history = vitals?.history || [];

  const getStatusBadge = (status, val) => {
    if (status === 'unset' || val === '--' || isUnset(val)) {
      return { variant: 'default', text: 'لم يُسجل بعد' };
    }
    if (status === 'warning' || status === 'high' || status === 'low') {
      return { variant: 'warning', text: 'تنبيه' };
    }
    if (status === 'critical') {
      return { variant: 'danger', text: 'حرج' };
    }
    return { variant: 'success', text: 'طبيعي' };
  };

  const bpVal = isUnset(current.bloodPressure.systolic) || current.bloodPressure.systolic === '--' 
    ? '--' 
    : `${current.bloodPressure.systolic}/${current.bloodPressure.diastolic}`;

  const cards = [
    {
      key: 'bp',
      label: 'ضغط الدم (BP)',
      value: bpVal,
      unit: bpVal === '--' ? '' : current.bloodPressure.unit,
      status: current.bloodPressure.status,
      icon: Activity,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900',
      badgeObj: getStatusBadge(current.bloodPressure.status, bpVal)
    },
    {
      key: 'hr',
      label: 'نبض القلب (HR)',
      value: current.heartRate.value,
      unit: current.heartRate.value === '--' ? '' : current.heartRate.unit,
      status: current.heartRate.status,
      icon: Heart,
      color: 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900',
      badgeObj: getStatusBadge(current.heartRate.status, current.heartRate.value)
    },
    {
      key: 'temp',
      label: 'حرارة الجسم (Temp)',
      value: current.temperature.value,
      unit: current.temperature.value === '--' ? '' : current.temperature.unit,
      status: current.temperature.status,
      icon: Thermometer,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900',
      badgeObj: getStatusBadge(current.temperature.status, current.temperature.value)
    },
    {
      key: 'spo2',
      label: 'أكسجين الدم (SpO2)',
      value: current.spO2.value === '--' ? '--' : `${current.spO2.value}%`,
      unit: current.spO2.value === '--' ? '' : current.spO2.unit,
      status: current.spO2.status,
      icon: Droplet,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900',
      badgeObj: getStatusBadge(current.spO2.status, current.spO2.value)
    },
    {
      key: 'rr',
      label: 'معدل التنفس (RR)',
      value: current.respiratoryRate.value,
      unit: current.respiratoryRate.value === '--' ? '' : current.respiratoryRate.unit,
      status: current.respiratoryRate.status,
      icon: Wind,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900',
      badgeObj: getStatusBadge(current.respiratoryRate.status, current.respiratoryRate.value)
    },
    {
      key: 'weight',
      label: 'الوزن والكتلة (Weight)',
      value: current.weight.value,
      unit: current.weight.value === '--' ? '' : current.weight.unit,
      status: current.weight.status,
      icon: Weight,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900',
      badgeObj: current.weight.value === '--' ? { variant: 'default', text: 'لم يُسجل' } : { variant: 'success', text: `BMI ${current.weight.bmi || '--'}` }
    }
  ];

  const handleSaveVital = (e) => {
    e.preventDefault();
    const weightNum = parseFloat(form.weight) || 70;
    const heightNum = parseFloat(form.height) || 170;
    const calculatedBmi = (weightNum / Math.pow(heightNum / 100, 2)).toFixed(1);

    const newVitalRecord = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      bpSys: parseInt(form.systolic, 10) || 120,
      bpDia: parseInt(form.diastolic, 10) || 80,
      hr: parseInt(form.heartRate, 10) || 75,
      temp: parseFloat(form.temperature) || 37.0,
      spo2: parseInt(form.spO2, 10) || 98,
      rr: parseInt(form.respiratoryRate, 10) || 16,
      weight: weightNum,
      height: heightNum,
      bmi: parseFloat(calculatedBmi),
      bloodSugar: parseInt(form.bloodSugar, 10) || 100,
      location: form.location,
      notes: form.notes,
      recordedBy: isDoctor ? 'الطبيب المعالج' : 'المريض (تسجيل ذاتي)'
    };

    if (onAddVital) {
      onAddVital(newVitalRecord);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Vitals Grid */}
      <div className={`grid gap-3.5 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
        {cards.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMetric === item.key;
          return (
            <div
              key={item.key}
              onClick={() => setSelectedMetric(item.key)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 ${
                isSelected
                  ? 'ring-2 ring-sky-500 border-sky-500 shadow-xs'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <Badge variant={item.badgeObj.variant} size="sm">
                  {item.badgeObj.text}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mb-1">
                {item.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`font-bold text-slate-900 dark:text-white ${item.value === '--' ? 'text-2xl text-slate-400 dark:text-slate-500' : 'text-xl'}`}>
                  {item.value}
                </span>
                {item.unit && (
                  <span className="text-[10px] text-slate-400">
                    {item.unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Trend Chart or Empty State */}
      {showChart && (
        history.length > 0 ? (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  مخطط التتبع الزمني للعلامات الحيوية
                </h4>
              </div>
              <div className="text-xs text-slate-500">
                {history.length} قراءات مسجلة
              </div>
            </div>

            <div className="h-56 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      textAlign: 'right'
                    }}
                  />
                  {selectedMetric === 'bp' && (
                    <>
                      <Line type="monotone" dataKey="bpSys" stroke="#e11d48" name="الضغط الانقباضي" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="bpDia" stroke="#3b82f6" name="الضغط الانبساطي" strokeWidth={2.5} dot={{ r: 4 }} />
                    </>
                  )}
                  {selectedMetric === 'hr' && (
                    <Line type="monotone" dataKey="hr" stroke="#ef4444" name="نبض القلب" strokeWidth={2.5} dot={{ r: 4 }} />
                  )}
                  {selectedMetric === 'temp' && (
                    <Line type="monotone" dataKey="temp" stroke="#f59e0b" name="حرارة الجسم" strokeWidth={2.5} dot={{ r: 4 }} />
                  )}
                  {selectedMetric === 'spo2' && (
                    <Line type="monotone" dataKey="spo2" stroke="#0ea5e9" name="أكسجين الدم %" strokeWidth={2.5} dot={{ r: 4 }} />
                  )}
                  {selectedMetric === 'weight' && (
                    <Line type="monotone" dataKey="weight" stroke="#6366f1" name="الوزن (كغم)" strokeWidth={2.5} dot={{ r: 4 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center flex flex-col items-center justify-center space-y-3 bg-slate-50/70 dark:bg-slate-800/40 border-dashed">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                لا توجد قياسات حيوية مسجلة بعد في السجل الزمني
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                المؤشرات مصفّرة للحساب الجديد. يمكنك تسجيل قراءتك الأولى الآن لبدء تتبع صحتك ومشاركتها مع الطبيب المعالج.
              </p>
            </div>
            {onAddVital && (
              <Button
                variant="primary"
                size="sm"
                icon={PlusCircle}
                onClick={() => setModalOpen(true)}
              >
                تسجيل أول قياس حيوي الآن
              </Button>
            )}
          </Card>
        )
      )}

      {/* Add New Vitals Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={isDoctor ? "تسجيل العلامات والمؤشرات الحيوية للمريض" : "تسجيل قراءة حيوية جديدة في ملفك الطبي"}
        >
          <form onSubmit={handleSaveVital} className="space-y-4">
            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900/40 text-xs text-sky-800 dark:text-sky-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-sky-600" />
              <span>
                سيتم تحديث المؤشرات الحيوية فوراً وإضافتها للرسم البياني والسجل الصحي الموحد للمريض.
              </span>
            </div>

            {/* Blood Pressure & Heart Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ضغط الدم الانقباضي (Systolic)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="60"
                    max="240"
                    value={form.systolic}
                    onChange={(e) => setForm({ ...form, systolic: e.target.value })}
                    placeholder="120"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">mmHg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الضغط الانبساطي (Diastolic)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="40"
                    max="140"
                    value={form.diastolic}
                    onChange={(e) => setForm({ ...form, diastolic: e.target.value })}
                    placeholder="80"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">mmHg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نبض القلب (Heart Rate)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="30"
                    max="220"
                    value={form.heartRate}
                    onChange={(e) => setForm({ ...form, heartRate: e.target.value })}
                    placeholder="75"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">bpm</span>
                </div>
              </div>
            </div>

            {/* Temperature & SpO2 & Respiratory Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  درجة الحرارة (Temperature)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="34"
                    max="43"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                    placeholder="37.0"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">°C</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  أكسجين الدم (SpO2)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="70"
                    max="100"
                    value={form.spO2}
                    onChange={(e) => setForm({ ...form, spO2: e.target.value })}
                    placeholder="98"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  معدل التنفس (Respiratory)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="8"
                    max="50"
                    value={form.respiratoryRate}
                    onChange={(e) => setForm({ ...form, respiratoryRate: e.target.value })}
                    placeholder="16"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">تنفس/د</span>
                </div>
              </div>
            </div>

            {/* Weight, Height & Blood Sugar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الوزن (Weight)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="70"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">كغم</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الطول (Height)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    placeholder="172"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">سم</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  سكر الدم (Glucose)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.bloodSugar}
                    onChange={(e) => setForm({ ...form, bloodSugar: e.target.value })}
                    placeholder="100"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">mg/dL</span>
                </div>
              </div>
            </div>

            {/* Location & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مكان القياس / الفحص
                </label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                >
                  <option value="المنزل - قياس ذاتي">المنزل - قياس ذاتي</option>
                  <option value="مجمع الشفاء الطبي - عيادة الباطنة">مجمع الشفاء الطبي - عيادة الباطنة</option>
                  <option value="مستشفى ناصر الطبي - الطوارئ">مستشفى ناصر الطبي - الطوارئ</option>
                  <option value="مستشفى شهداء الأقصى">مستشفى شهداء الأقصى</option>
                  <option value="مركز صحي أولي">مركز صحي أولي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات أو أعراض مصاحبة
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="مثال: قياس بعد الراحة، بعد تناول وجبة الإفطار"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Save}>
                حفظ واعتماد القياس
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Button to open add modal if provided externally as well */}
      {onAddVital && (
        <div className="flex justify-end pt-1">
          <Button
            variant="outline"
            size="sm"
            icon={PlusCircle}
            onClick={() => setModalOpen(true)}
          >
            {isDoctor ? "تسجيل قراءة حيوية جديدة للمريض" : "تسجيل قراءة حيوية جديدة"}
          </Button>
        </div>
      )}
    </div>
  );
};
