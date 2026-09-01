import React, { useState } from 'react';
import { Card, Badge } from '../ui/Badge';
import { Heart, Activity, Thermometer, Droplet, Wind, Weight, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const VitalSigns = ({ vitals, showChart = true, compact = false }) => {
  const [selectedMetric, setSelectedMetric] = useState('bp');

  const current = vitals?.current || {
    heartRate: { value: 76, unit: "نبضة/دقيقة", status: "normal" },
    bloodPressure: { systolic: 124, diastolic: 82, unit: "ملم زئبق", status: "normal" },
    temperature: { value: 36.8, unit: "°C", status: "normal" },
    spO2: { value: 98, unit: "%", status: "normal" },
    respiratoryRate: { value: 16, unit: "تنفس/دقيقة", status: "normal" },
    weight: { value: 78.5, unit: "كغم", status: "normal", bmi: 25.4 }
  };

  const history = vitals?.history || [];

  const cards = [
    {
      key: 'bp',
      label: 'ضغط الدم (BP)',
      value: `${current.bloodPressure.systolic}/${current.bloodPressure.diastolic}`,
      unit: current.bloodPressure.unit,
      status: current.bloodPressure.status,
      icon: Activity,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900',
      badge: 'طبيعي'
    },
    {
      key: 'hr',
      label: 'نبض القلب (HR)',
      value: current.heartRate.value,
      unit: current.heartRate.unit,
      status: current.heartRate.status,
      icon: Heart,
      color: 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900',
      badge: 'طبيعي'
    },
    {
      key: 'temp',
      label: 'حرارة الجسم (Temp)',
      value: current.temperature.value,
      unit: current.temperature.unit,
      status: current.temperature.status,
      icon: Thermometer,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900',
      badge: 'طبيعي'
    },
    {
      key: 'spo2',
      label: 'أكسجين الدم (SpO2)',
      value: `${current.spO2.value}%`,
      unit: current.spO2.unit,
      status: current.spO2.status,
      icon: Droplet,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900',
      badge: 'ممتاز'
    },
    {
      key: 'rr',
      label: 'معدل التنفس (RR)',
      value: current.respiratoryRate.value,
      unit: current.respiratoryRate.unit,
      status: current.respiratoryRate.status,
      icon: Wind,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900',
      badge: 'طبيعي'
    },
    {
      key: 'weight',
      label: 'الوزن والكتلة (Weight)',
      value: current.weight.value,
      unit: current.weight.unit,
      status: current.weight.status,
      icon: Weight,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900',
      badge: `BMI ${current.weight.bmi || 25}`
    }
  ];

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
                <Badge variant="success" size="sm">
                  {item.badge}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mb-1">
                {item.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-[10px] text-slate-400">
                  {item.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Trend Chart */}
      {showChart && history.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                مخطط التتبع الزمني للعلامات الحيوية
              </h4>
            </div>
            <div className="text-xs text-slate-500">
              آخر 6 قراءات مسجلة
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
      )}
    </div>
  );
};
