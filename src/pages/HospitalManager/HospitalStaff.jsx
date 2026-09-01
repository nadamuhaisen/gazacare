import React, { useState } from 'react';
import { Card, Badge, Button } from '../../components/ui/Badge';
import { Users, PlusCircle, Search, Phone, Mail, Award } from 'lucide-react';

export const HospitalStaff = () => {
  const [search, setSearch] = useState('');

  const [staff] = useState([
    { id: 'stf-1', name: 'أ. فاطمة رضوان', role: 'رئيسة تمريض العناية المركزة', department: 'قسم العناية المركزة (ICU)', phone: '0599112233', shift: 'صباحي' },
    { id: 'stf-2', name: 'م. حسام قاسم', role: 'مسؤول السجلات الطبية والـ IT', department: 'نظم المعلومات الطبية', phone: '0599223344', shift: 'نهاري' },
    { id: 'stf-3', name: 'حنان دغمش', role: 'ممرضة قانونية', department: 'قسم الطوارئ', phone: '0599334455', shift: 'ليلي' },
    { id: 'stf-4', name: 'سعيد عبد الله', role: 'فني طوارئ وإسعاف', department: 'قسم الطوارئ والإسعاف', phone: '0599445566', shift: 'صباحي' }
  ]);

  const filtered = staff.filter(s => s.name.includes(search) || s.role.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            الموظفون والكادر التمريضي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            إدارة طواقم التمريض، الفنيين، والموظفين الإداريين بالمستشفى
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <Card key={item.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <Badge variant="primary" size="sm">{item.shift}</Badge>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
              <p className="text-xs text-sky-600 font-medium">{item.role}</p>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <div>القسم: {item.department}</div>
              <div>الجوال: <span dir="ltr">{item.phone}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
