import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import { User, Phone, Mail, MapPin, Calendar, ShieldCheck, Heart, AlertTriangle, Edit3, Save, Printer } from 'lucide-react';

export const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { addToast } = useNotification();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await patientService.getProfile();
        if (res.success) {
          setProfile(res.data);
          setEditForm(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await patientService.updateProfile(editForm);
      if (res.success) {
        setProfile(res.data);
        setEditModalOpen(false);
        addToast({
          title: 'تم تحديث الملف',
          message: 'تم حفظ البيانات بنجاح',
          type: 'success'
        });
      }
    } catch {
      addToast({
        title: 'خطأ',
        message: 'فشل حفظ البيانات',
        type: 'error'
      });
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      {/* Header Profile Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            الملف الطبي الموحد للمريض
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            السجل الشخصي، فصيلة الدم، وبيانات الطوارئ المعتمدة لدى وزارة الصحة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
          >
            طباعة البطاقة الصحية
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Edit3}
            onClick={() => setEditModalOpen(true)}
          >
            تعديل البيانات
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img
            src={profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
            alt={profile?.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-sky-500/20"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {profile?.name}
              </h3>
              <Badge variant="primary" size="md">{profile?.bloodType}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              الرقم القومي (الهوية): <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{profile?.nationalId}</span> | رقم الملف: <span className="font-mono font-bold text-sky-600">{profile?.mrn}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {profile?.dateOfBirth} ({profile?.age} سنة)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile?.address}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400">رقم الهاتف الأساسي</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white" dir="ltr">
              {profile?.phone}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">البريد الإلكتروني</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {profile?.email}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">الجنس والحالة</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {profile?.gender === 'male' ? 'ذكر' : 'أنثى'}
            </p>
          </div>
        </div>
      </Card>

      {/* Medical History & Emergency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>الأمراض المزمنة والحالة الصحية</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile?.chronicConditions?.map((item, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs font-bold">
                {item}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>الحساسيات والتنبيهات السريرية</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile?.allergies?.map((item, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold">
                {item}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="تعديل بيانات الملف الشخصي"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
            <input
              type="text"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">العنوان</label>
              <input
                type="text"
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" type="button" onClick={() => setEditModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" size="sm" type="submit" icon={Save}>حفظ التغييرات</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
