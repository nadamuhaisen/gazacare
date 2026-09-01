import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
        };

        const bgColors = {
          success: 'bg-emerald-50/90 dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60',
          error: 'bg-rose-50/90 dark:bg-slate-900 border-rose-200 dark:border-rose-900/60',
          warning: 'bg-amber-50/90 dark:bg-slate-900 border-amber-200 dark:border-amber-900/60',
          info: 'bg-sky-50/90 dark:bg-slate-900 border-sky-200 dark:border-sky-900/60'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              bgColors[toast.type] || bgColors.info
            }`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 text-right">
              {toast.title && (
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
