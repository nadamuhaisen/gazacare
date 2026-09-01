import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Bell, AlertTriangle, CheckCircle2, Clock, 
  FlaskConical, Calendar, FileText, Trash2, Check, RefreshCw
} from 'lucide-react';
import { Button, Badge } from '../../components/ui/Badge';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, addNotification } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.type === 'critical' || n.type === 'warning';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'critical':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'lab':
        return <FlaskConical className="w-5 h-5 text-teal-500" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-sky-500" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-sky-500" />
            <span>مركز الإشعارات والتنبيهات السريرية</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            سجل التنبيهات اللحظية، نتائج المختبر الحرجة، تذكيرات المواعيد، والرسائل الطبية
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={Check}
              onClick={markAllAsRead}
              className="text-xs"
            >
              تحديد الكل كمقروء
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={clearAll}
              className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              مسح السجل
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'all', label: `جميع الإشعارات (${notifications.length})` },
          { id: 'unread', label: `غير المقروءة (${unreadCount})` },
          { id: 'critical', label: 'التنبيهات الحرجة والطارئة' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">لا توجد إشعارات حالياً</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              سيتم إشعارك فور ورود أي نتائج مخبرية جديدة، طلبات فحص، أو تحديثات على جدول المواعيد.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notification.read
                  ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${
                notification.type === 'critical' 
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 ring-2 ring-rose-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{notification.time || 'الآن'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
