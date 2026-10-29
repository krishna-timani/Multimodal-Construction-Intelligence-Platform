import React from 'react';

export default function MetricCard({ title, value, unit = '', icon: Icon, change = null, status = 'default', subtitle = null }) {
  let accent = 'border-slate-800 bg-slate-900/60 text-slate-100';
  let iconBg = 'bg-slate-800 text-slate-300';

  if (status === 'success') {
    accent = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-100';
    iconBg = 'bg-emerald-900/40 text-emerald-400';
  } else if (status === 'warning') {
    accent = 'border-amber-500/30 bg-amber-950/20 text-amber-100';
    iconBg = 'bg-amber-900/40 text-amber-400';
  } else if (status === 'danger') {
    accent = 'border-rose-500/30 bg-rose-950/20 text-rose-100';
    iconBg = 'bg-rose-900/40 text-rose-400';
  } else if (status === 'primary') {
    accent = 'border-sky-500/30 bg-sky-950/20 text-sky-100';
    iconBg = 'bg-sky-900/40 text-sky-400';
  }

  return (
    <div className={`p-4 rounded-xl border ${accent} backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>

      {(subtitle || change) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {change && (
            <span className={change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

