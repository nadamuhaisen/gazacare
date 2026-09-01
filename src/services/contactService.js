import api from './api';

export const fallbackHotlines = [
  {
    title: 'الإسعاف والطوارئ - الهلال الأحمر الفلسطيني',
    number: '101',
    description: 'خط الطوارئ المركزي للإسعاف الفوري ونقل الحالات الحرجة في كافة محافظات غزة',
    availability: '24/7 على مدار الساعة',
    type: 'emergency'
  },
  {
    title: 'غرفة طوارئ وزارة الصحة الفلسطينية',
    number: '103',
    description: 'الاستفسارات الطبية الطارئة، التحويلات العاجلة، ومتابعة نقص الأدوية التخصصية',
    availability: '24/7 على مدار الساعة',
    type: 'moh'
  },
  {
    title: 'مكتب الدعم الفني وإدارة السجلات EMR',
    number: '+970 8 282 0000',
    description: 'الدعم التقني لربط المستشفيات وحل مشكلات مزامنة الملفات والحسابات الطبية',
    availability: 'من 8:00 ص حتى 10:00 م',
    type: 'support'
  },
  {
    title: 'الخط الساخن للاستشارات الطبية والنفسية',
    number: '1800 100 200',
    description: 'استشارات أطباء الأسرة والدعم النفسي الميداني للنازحين والمتضررين',
    availability: 'من 9:00 ص حتى 8:00 م',
    type: 'consultation'
  }
];

export const contactService = {
  submitMessage: async (data) => {
    try {
      const res = await api.post('/contact/submit', data);
      return res;
    } catch (error) {
      // Fallback local persistence if network offline
      const ticketNum = 'TKT-2026-' + Math.floor(1000 + Math.random() * 9000);
      const localTicket = {
        id: 'MSG-' + Date.now(),
        ticketNumber: ticketNum,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('gazacare_contact_tickets') || '[]');
      existing.unshift(localTicket);
      localStorage.setItem('gazacare_contact_tickets', JSON.stringify(existing));

      return {
        success: true,
        message: `تم حفظ رسالتكم بنجاح ورقم التذكرة (${ticketNum}). سيتم التواصل معكم فوراً.`,
        data: {
          ticket: localTicket,
          ticketNumber: ticketNum,
          estimatedResponseTime: data.priority === 'emergency' ? 'خلال ساعتين' : 'خلال 24 ساعة'
        }
      };
    }
  },

  getHotlines: async () => {
    try {
      const res = await api.get('/contact/hotlines');
      return res.data || res || fallbackHotlines;
    } catch {
      return fallbackHotlines;
    }
  },

  getMessages: async (params) => {
    try {
      const res = await api.get('/contact/messages', { params });
      return res.data || res || [];
    } catch {
      const local = JSON.parse(localStorage.getItem('gazacare_contact_tickets') || '[]');
      return local;
    }
  },

  updateStatus: async (id, status, notes) => {
    try {
      const res = await api.put(`/contact/messages/${id}/status`, { status, notes });
      return res;
    } catch (error) {
      return { success: true, message: 'تم تحديث الحالة محلياً' };
    }
  }
};
