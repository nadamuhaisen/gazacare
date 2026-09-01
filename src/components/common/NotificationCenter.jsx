import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  CheckCheck,
  FlaskConical,
  Calendar,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ChevronLeft,
  X,
  Info,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none" dir="rtl">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-900',
          error: 'border-rose-200 dark:border-rose-900',
          warning: 'border-amber-200 dark:border-amber-900',
          info: 'border-sky-200 dark:border-sky-900'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border ${borders[toast.type] || borders.info} shadow-xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                  {toast.title}
                </h5>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  const { role } = useAuth();
  const dropdownRef = useRef(null);

  // Filter notifications for current user role or global
  const relevantNotifications = notifications.filter(
    n => !n.targetRole || n.targetRole === role
  );

  const unreadCount = relevantNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'lab':
      case 'lab_request':
        return <FlaskConical className="w-4 h-4 text-emerald-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-sky-500" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="الإشعارات"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                مركز التنبيهات والإشعارات
              </h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                  {unreadCount} غير مقروء
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead(role)}
                className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {relevantNotifications.length > 0 ? (
              relevantNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-3 cursor-pointer ${
                    !n.read ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0 shadow-xs">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h5 className={`text-xs truncate ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1.5 hover:underline"
                      >
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                لا توجد إشعارات جديدة حالياً
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
