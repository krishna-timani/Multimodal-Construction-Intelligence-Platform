import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  const s = (status || '').toUpperCase();

  let colors = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (s.includes('SAFE') || s.includes('OPTIMAL') || s.includes('NORMAL') || s.includes('BUY') || s.includes('LOW')) {
    colors = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
    dotColor = 'bg-emerald-400';
  } else if (s.includes('MODERATE') || s.includes('WATCH') || s.includes('CAUTION') || s.includes('MEDIUM')) {
    colors = 'bg-amber-950/70 text-amber-300 border-amber-500/40';
    dotColor = 'bg-amber-400';
  } else if (s.includes('HIGH') || s.includes('SEVERE') || s.includes('ATTENTION')) {
    colors = 'bg-orange-950/70 text-orange-300 border-orange-500/40';
    dotColor = 'bg-orange-400';
  } else if (s.includes('CRITICAL') || s.includes('PROHIBITED') || s.includes('DANGER') || s.includes('FAIL')) {
    colors = 'bg-rose-950/80 text-rose-300 border-rose-500/50';
    dotColor = 'bg-rose-500 animate-ping';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colors} ${sizeClasses} shadow-sm backdrop-blur-sm`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
}

