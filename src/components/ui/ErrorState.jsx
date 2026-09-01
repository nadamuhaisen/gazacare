import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Badge';

export const ErrorState = ({
  title = "حدث خطأ أثناء تحميل البيانات",
  message = "تعذر الاتصال بالخادم أو جلب المعلومات المطلوبة. يرجى المحاولة مرة أخرى.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-rose-700/80 dark:text-rose-300/80 max-w-md mb-4">
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
