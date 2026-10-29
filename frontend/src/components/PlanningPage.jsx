import React, { useState } from 'react';
import { api } from '../services/api.js';
import MetricCard from './MetricCard.jsx';
import StatusBadge from './StatusBadge.jsx';
import { Calendar, Loader2, AlertTriangle, Flag, ChevronDown, ChevronUp, Clock, GitBranch } from 'lucide-react';

function TaskRow({ t }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-lg transition-all ${t.critical_path ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-700 bg-slate-800/30'}`}>
      <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setOpen(o => !o)}>
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.critical_path ? 'bg-amber-400' : 'bg-slate-500'}`} />
        <span className="font-mono text-xs text-slate-500 shrink-0">{t.task_id}</span>
        <span className="font-medium text-sm text-slate-100 flex-1 min-w-0 truncate">{t.task_name}</span>
        <span className="text-xs text-slate-500 shrink-0">D{t.start_day}–D{t.end_day}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${t.critical_path ? 'bg-amber-900/50 text-amber-300 border border-amber-600/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
          {t.critical_path ? '⚡ Critical' : t.phase?.split(' ')[0]}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2 text-sm text-slate-300">
          <p><span className="text-slate-500">Phase: </span>{t.phase}</p>
          <p><span className="text-slate-500">Duration: </span>{t.duration_days} days</p>
          <p><span className="text-slate-500">Deliverable: </span>{t.deliverable}</p>
          {t.dependencies?.length > 0 && (
            <p><span className="text-slate-500">Dependencies: </span>{t.dependencies.join(', ')}</p>
          )}
          {t.resources_required?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {t.resources_required.map((r, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300">{r}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlanningPage() {
  const [form, setForm] = useState({
    project_name: 'Commercial Office Complex Phase 1',
    built_up_area_sqft: 8000,
    project_type: 'Commercial',
    target_duration_months: 8,
    start_date: '2026-11-01',
    workforce_capacity: 'Normal (25-40 workers daily)',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await api.generateSchedule({ ...form, built_up_area_sqft: Number(form.built_up_area_sqft), target_duration_months: Number(form.target_duration_months) });
      setResult(data);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-violet-900/40 border border-violet-500/30">
          <Calendar className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Project Planning & Scheduling (WBS/CPM)</h2>
          <p className="text-sm text-slate-400">AI-generated Work Breakdown Structure with critical path analysis</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { k: 'project_name', label: 'Project Name', type: 'text', full: true },
          { k: 'built_up_area_sqft', label: 'Built-up Area (sq ft)', type: 'number' },
          { k: 'target_duration_months', label: 'Target Duration (months)', type: 'number' },
          { k: 'project_type', label: 'Project Type', type: 'select', opts: ['Residential Villa', 'Multi-family Apartment', 'Commercial', 'Industrial', 'Mixed-Use'] },
          { k: 'start_date', label: 'Planned Start Date', type: 'date' },
          { k: 'workforce_capacity', label: 'Workforce Capacity', type: 'select', opts: ['Limited (<15 workers)', 'Normal (25-40 workers daily)', 'Large (40-80 workers)'] },
        ].map(f => (
          <div key={f.k} className={f.full ? 'col-span-full' : ''}>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
            {f.type === 'select' ? (
              <select value={form[f.k]} onChange={e => upd(f.k, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} value={form[f.k]} onChange={e => upd(f.k, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
            )}
          </div>
        ))}
        <div className="col-span-full">
          <button onClick={handleSubmit} disabled={loading}
            className="py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-violet-900/30">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Schedule...</> : <><Calendar className="w-4 h-4" /> Generate Project Schedule</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="space-y-5 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard title="Total Duration" value={result.total_duration_days} unit="days" icon={Clock} status="primary" />
            <MetricCard title="Total Phases" value={result.total_phases} icon={GitBranch} status="default" />
            <MetricCard title="Tasks Defined" value={result.tasks?.length || 0} icon={Calendar} status="success" />
            <MetricCard title="Weather Buffer" value={result.weather_buffer_days} unit="days" icon={AlertTriangle} status="warning" />
          </div>

          {/* Phases */}
          <div className="flex flex-wrap gap-2">
            {result.phases?.map((p, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/40 text-violet-300 text-xs font-medium">
                Phase {i + 1}: {p}
              </span>
            ))}
          </div>

          {/* Critical Path */}
          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl">
            <p className="text-xs uppercase tracking-wider text-amber-400 mb-2 font-semibold flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5" /> Critical Path Summary
            </p>
            <p className="text-sm text-amber-100 leading-relaxed">{result.critical_path_summary}</p>
          </div>

          {/* Milestones */}
          {result.milestones?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium flex items-center gap-2">
                <Flag className="w-3.5 h-3.5" /> Key Milestones
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.milestones.map((m, i) => (
                  <div key={i} className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl flex gap-3 items-start">
                    <div className="text-center shrink-0">
                      <div className="text-lg font-bold text-violet-400">{m.day}</div>
                      <div className="text-xs text-slate-500">day</div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-100">{m.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task List */}
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">Task Schedule ({result.tasks?.length} tasks)</p>
            <div className="space-y-1.5">
              {result.tasks?.map((t, i) => <TaskRow key={i} t={t} />)}
            </div>
          </div>

          {/* Risks & Mitigations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-rose-400 mb-2 font-semibold">Risk Factors</p>
              <ul className="space-y-1.5">
                {result.risk_factors?.map((r, i) => (
                  <li key={i} className="text-sm text-rose-100 flex gap-2"><span className="text-rose-500 shrink-0">⚠</span>{r}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-emerald-400 mb-2 font-semibold">Mitigation Strategies</p>
              <ul className="space-y-1.5">
                {result.mitigation_strategies?.map((r, i) => (
                  <li key={i} className="text-sm text-emerald-100 flex gap-2"><span className="text-emerald-500 shrink-0">✓</span>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

