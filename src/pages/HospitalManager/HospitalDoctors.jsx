import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospitalService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { Stethoscope, PlusCircle, Search, Phone, Mail, Clock, Award, ShieldCheck } from 'lucide-react';

export const HospitalDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const { addToast } = useNotification();

  const [form, setForm] = useState({
    name: '',
    specialty: 'أمراض باطنة',
    department: 'قسم الباطنة',
    phone: '',
    email: '',
    status: 'on-duty'
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getDoctors();
      if (res.success) setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-${Date.now()}`,
      ...form,
      hospital: 'مجمع الشفاء الطبي',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80'
    };
    setDoctors([newDoc, ...doctors]);
    setAddModal(false);
    addToast({
      title: 'تمت إضافة الطبيب',
      message: 'تم تسجيل الطبيب في الكادر الطبي بنجاح',
      type: 'success'
    });
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            إدارة الكادر الطبي والأطباء
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            متابعة مناوبات الأطباء، التخصصات السريرية، وتوزيع العيادات
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setAddModal(true)}
        >
          إضافة طبيب جديد
        </Button>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن طبيب بالاسم أو التخصص..."
            className="w-full pr-10 pl-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <Card key={doc.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-500/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                      {doc.specialty}
                    </p>
                  </div>
                </div>
                <Badge variant={doc.status === 'on-duty' ? 'success' : 'default'} size="sm">
                  {doc.status === 'on-duty' ? 'على رأس العمل' : 'استراحة'}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span dir="ltr">{doc.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex justify-between items-center">
              <span>مجمع الشفاء الطبي</span>
              <span className="font-mono text-slate-500">{doc.id}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {addModal && (
        <Modal
          isOpen={addModal}
          onClose={() => setAddModal(false)}
          title="إضافة طبيب إلى المنظومة"
        >
          <form onSubmit={handleAddDoctor} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">اسم الطبيب الرباعي</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">التخصص</label>
                <input
                  type="text"
                  required
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">القسم الطبي</label>
                <input
                  type="text"
                  required
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">رقم الجوال</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setAddModal(false)}>إلغاء</Button>
              <Button variant="primary" size="sm" type="submit">إضافة الطبيب</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
