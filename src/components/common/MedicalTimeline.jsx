import React from 'react';
import { Stethoscope, FlaskConical, Pill, Activity, AlertTriangle, CheckCircle, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const MedicalTimeline = ({ items = [] }) => {
  const getIconAndColor = (type) => {
    switch (type) {
      case 'doctor_visit':
        return { icon: Stethoscope, color: 'bg-sky-500 text-white ring-sky-100 dark:ring-sky-950' };
      case 'lab_result':
        return { icon: FlaskConical, color: 'bg-emerald-500 text-white ring-emerald-100 dark:ring-emerald-950' };
      case 'prescription':
        return { icon: Pill, color: 'bg-indigo-500 text-white ring-indigo-100 dark:ring-indigo-950' };
      case 'radiology':
        return { icon: Activity, color: 'bg-purple-500 text-white ring-purple-100 dark:ring-purple-950' };
      case 'emergency':
        return { icon: AlertTriangle, color: 'bg-rose-500 text-white ring-rose-100 dark:ring-rose-950' };
      default:
        return { icon: CheckCircle, color: 'bg-slate-500 text-white ring-slate-100 dark:ring-slate-900' };
    }
  };

  if (!items || items.length === 0) {
    return <div className="text-center py-6 text-sm text-slate-500">لا توجد أحداث طبية مسجلة في السجل الزمني.</div>;
  }

  return (
    <div className="relative pr-6 before:absolute before:right-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-6">
      {items.map((item, idx) => {
        const { icon: Icon, color } = getIconAndColor(item.type);
        return (
          <div key={item.id || idx} className="relative group">
            {/* Timeline Marker */}
            <div
              className={`absolute -right-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 transition-transform group-hover:scale-110 ${color}`}
            >
              <Icon className="w-2.5 h-2.5" />
            </div>

            {/* Timeline Content Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <Badge variant={item.badgeColor || 'primary'} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  {item.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  )}
                </div>
              </div>

              {item.subtitle && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                  {item.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {item.doctor && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {item.doctor}
                  </span>
                )}
                {item.facility && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.facility}
                  </span>
                )}
                {item.status && (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    الحالة: {item.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
