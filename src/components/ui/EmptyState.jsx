import React from 'react';
import { FileQuestion, PlusCircle } from 'lucide-react';
import { Button } from './Badge';

export const EmptyState = ({
  icon: Icon = FileQuestion,
  title = "لا توجد بيانات متاحة",
  description = "لم يتم العثور على أي عناصر لعرضها حالياً.",
  actionText,
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" icon={PlusCircle} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
