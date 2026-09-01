import React from 'react';
import { usePwa } from '../../context/PwaContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner = () => {
  const { isOnline, isSyncing, lastSyncTime, triggerSync } = usePwa();

  if (isOnline && !isSyncing) return null;

  return (
    <div
      className={`px-4 py-2 text-xs flex items-center justify-between transition-colors print:hidden ${
        isOnline
          ? 'bg-sky-50 dark:bg-sky-950/60 border-b border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300'
          : 'bg-amber-500 text-white shadow-md animate-pulse'
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-sky-600 dark:text-sky-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-white" />
        )}
        <span>
          {isOnline
            ? `أنت متصل بالإنترنت | آخر مزامنة: ${lastSyncTime}`
            : 'أنت تعمل حالياً في وضع عدم الاتصال (Offline). تم تفعيل الحفظ المحلي الآمن.'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isSyncing ? (
          <span className="flex items-center gap-1 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            جاري المزامنة مع الخادم...
          </span>
        ) : (
          <button
            onClick={triggerSync}
            className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
              isOnline
                ? 'bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 text-sky-900 dark:text-sky-200'
                : 'bg-white text-amber-800 hover:bg-amber-50'
            }`}
          >
            مزامنة يدوية
          </button>
        )}
      </div>
    </div>
  );
};
