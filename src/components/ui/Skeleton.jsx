import React from 'react';

export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variantClass = variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded h-4 w-full' : 'rounded-xl';
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantClass} ${className}`}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex gap-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <Skeleton key={cIdx} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton variant="circular" className="h-8 w-8" />
      </div>
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};
