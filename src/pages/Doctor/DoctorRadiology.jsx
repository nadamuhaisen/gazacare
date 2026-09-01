import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../../components/ui/Badge';
import { Activity, PlusCircle, Eye, Printer, FileText, Calendar, User } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const DoctorRadiology = () => {
  const { addToast } = useNotification();
  const [selectedScan, setSelectedScan] = useState(null);
  const [newScanModal, setNewScanModal] = useState(false);

  const [scans, setScans] = useState([
    {
      id: 'rad-101',
      patientName: 'أحمد يوسف خليل',
      patientMrn: 'P-10492',
      type: 'أشعة سينية للصدر (Chest X-Ray)',
      date: '2026-02-15',
      doctor: 'د. يحيى خليل الأغا',
      radiologist: 'د. سامي محمود رضوان',
      hospital: 'مجمع الشفاء الطبي',
      status: 'completed',
      findings: 'لا توجد علامات ارتشاح رئوي حاد أو تضخم في عضلة القلب. الرئتان بحالة جيدة.',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'rad-102',
      patientName: 'مريم محمود حمدان',
      patientMrn: 'P-10493',
      type: 'تلفزيون بطن وحوض (Abdominal Ultrasound)',
      date: '2026-03-01',
      doctor: 'د. يحيى خليل الأغا',
      radiologist: 'د. إياد كمال البردويل',
      hospital: 'مجمع الشفاء الطبي',
      status: 'completed',
      findings: 'الكبد والطحال ضمن الحجم الطبيعي، لا توجد حصوات مرارية أو استسقاء.',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  const [newScanForm, setNewScanForm] = useState({
    patientName: 'أحمد يوسف خليل',
    patientMrn: 'P-10492',
    type: 'أشعة مقطعية (CT Scan)',
    reason: 'اشتباه التهاب حاد'
  });

  const handleCreateScan = (e) => {
    e.preventDefault();
    const newScan = {
      id: `rad-${Date.now()}`,
      ...newScanForm,
      date: new Date().toISOString().split('T')[0],
      doctor: 'د. يحيى خليل الأغا',
      radiologist: 'قيد التعيين',
      hospital: 'مجمع الشفاء الطبي',
      status: 'pending',
      findings: 'قيد التصوير والتحليل من قبل أخصائي الأشعة.',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
    };
    setScans([newScan, ...scans]);
    setNewScanModal(false);
    addToast({
      title: 'تم إرسال طلب الأشعة',
      message: 'تم تحويل الطلب إلى قسم التصوير الطبي',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            الأشعة والتصوير الطبي (Radiology PACS)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            طلب ومطالعة صور الأشعة المقطعية والسينية والتقارير الإشعاعية التشخيصية
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setNewScanModal(true)}
        >
          طلب تصوير إشعاعي جديد
        </Button>
      </div>

      {/* Scans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scans.map((scan) => (
          <Card key={scan.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {scan.type}
                    </h4>
                    <p className="text-xs text-slate-400">
                      المريض: {scan.patientName} ({scan.patientMrn})
                    </p>
                  </div>
                </div>
                <Badge variant={scan.status === 'completed' ? 'success' : 'warning'} size="sm">
                  {scan.status === 'completed' ? 'معتمد' : 'قيد التصوير'}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <strong>التقرير الإشعاعي:</strong> {scan.findings}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>أخصائي الأشعة: {scan.radiologist}</span>
                <span>{scan.date}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              className="w-full"
              onClick={() => setSelectedScan(scan)}
            >
              معاينة الصورة والتقرير الطبي
            </Button>
          </Card>
        ))}
      </div>

      {/* View Scan Modal */}
      {selectedScan && (
        <Modal
          isOpen={!!selectedScan}
          onClose={() => setSelectedScan(null)}
          title={`تقرير التصوير الإشعاعي: ${selectedScan.type}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between">
                <span><strong>المريض:</strong> {selectedScan.patientName}</span>
                <span><strong>رقم الملف:</strong> {selectedScan.patientMrn}</span>
              </div>
              <div><strong>تاريخ الفحص:</strong> {selectedScan.date} ({selectedScan.hospital})</div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black p-2 text-center">
              <img
                src={selectedScan.imageUrl}
                alt="Radiology Scan"
                className="max-h-64 mx-auto rounded-xl object-contain"
              />
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">النتائج والتشخيص الإشعاعي:</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                {selectedScan.findings}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedScan(null)}>إغلاق</Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>طباعة التقرير</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Scan Request Modal */}
      {newScanModal && (
        <Modal
          isOpen={newScanModal}
          onClose={() => setNewScanModal(false)}
          title="طلب تصوير إشعاعي جديد"
        >
          <form onSubmit={handleCreateScan} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المريض</label>
                <input
                  type="text"
                  required
                  value={newScanForm.patientName}
                  onChange={(e) => setNewScanForm({ ...newScanForm, patientName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">رقم الملف (MRN)</label>
                <input
                  type="text"
                  required
                  value={newScanForm.patientMrn}
                  onChange={(e) => setNewScanForm({ ...newScanForm, patientMrn: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">نوع التصوير المطلوب</label>
              <select
                value={newScanForm.type}
                onChange={(e) => setNewScanForm({ ...newScanForm, type: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              >
                <option value="أشعة سينية للصدر (Chest X-Ray)">أشعة سينية للصدر (Chest X-Ray)</option>
                <option value="تلفزيون بطن وحوض (Abdominal Ultrasound)">تلفزيون بطن وحوض (Ultrasound)</option>
                <option value="أشعة مقطعية للمخ (Brain CT Scan)">أشعة مقطعية للمخ (Brain CT)</option>
                <option value="رنين مغناطيسي (MRI)">رنين مغناطيسي (MRI)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">دواعي الفحص السريرية</label>
              <textarea
                rows={2}
                value={newScanForm.reason}
                onChange={(e) => setNewScanForm({ ...newScanForm, reason: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setNewScanModal(false)}>إلغاء</Button>
              <Button variant="primary" size="sm" type="submit">إرسال الطلب</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
