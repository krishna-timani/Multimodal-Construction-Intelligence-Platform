import React, { useState, useRef } from 'react';
import { api } from '../services/api.js';
import StatusBadge from './StatusBadge.jsx';
import { ClipboardList, Loader2, AlertTriangle, Truck, Wrench, CheckCircle, UploadCloud } from 'lucide-react';

export default function SitePage() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    log_date: today,
    shift: 'Day Shift (08:00 - 17:00)',
    weather_summary: 'Clear skies, 28°C',
    active_worker_count: 34,
    notes_raw_text: 'RCC framing work progressing on Level 3 slab. Rebar tying ongoing. One concrete pour scheduled.',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleFile = (e) => { const f = e.target.files[0]; if (!f) return; setImage(f); setPreview(URL.createObjectURL(f)); };

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      if (image) fd.append('image', image);
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      const data = await api.submitDailyLog(fd);
      setResult(data);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-teal-900/40 border border-teal-500/30">
          <ClipboardList className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Daily Site Assistant & Progress Logger</h2>
          <p className="text-sm text-slate-400">Transform field notes into structured, audit-ready daily site reports</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Date</label>
          <input type="date" value={form.log_date} onChange={e => upd('log_date', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Shift</label>
          <select value={form.shift} onChange={e => upd('shift', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors">
            <option>Day Shift (08:00 - 17:00)</option>
            <option>Evening Shift (17:00 - 22:00)</option>
            <option>Night Shift (22:00 - 06:00)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Active Workers</label>
          <input type="number" value={form.active_worker_count} onChange={e => upd('active_worker_count', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors" />
        </div>
        <div className="col-span-full">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Weather Summary</label>
          <input value={form.weather_summary} onChange={e => upd('weather_summary', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors" />
        </div>
        <div className="col-span-full">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Raw Field Notes / Voice Memo</label>
          <textarea value={form.notes_raw_text} onChange={e => upd('notes_raw_text', e.target.value)} rows={4}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
            placeholder="Paste raw field notes, voice transcription, or work progress observations..." />
        </div>
        <div
          className="border-2 border-dashed border-slate-700 hover:border-teal-500/50 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all"
          onClick={() => fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {preview ? <img src={preview} alt="Site" className="max-h-20 rounded-lg object-contain" />
            : <><UploadCloud className="w-5 h-5 text-slate-500" /><span className="text-xs text-slate-500">Site photo (optional)</span></>}
        </div>
        <div className="col-span-full">
          <button onClick={handleSubmit} disabled={loading}
            className="py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing Log...</> : <><ClipboardList className="w-4 h-4" /> Generate Daily Report</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Header */}
          <div className="p-4 bg-teal-950/30 border border-teal-500/30 rounded-xl flex flex-wrap gap-4 text-sm">
            <div><span className="text-slate-500 text-xs">Date</span><p className="text-white font-semibold">{result.date}</p></div>
            <div><span className="text-slate-500 text-xs">Shift</span><p className="text-white">{result.shift}</p></div>
            <div><span className="text-slate-500 text-xs">Weather</span><p className="text-white">{result.weather_summary}</p></div>
            <div><span className="text-slate-500 text-xs">Workers</span><p className="text-teal-300 font-bold">{result.active_worker_count}</p></div>
            <div><span className="text-slate-500 text-xs">Safety Incidents</span>
              <p className={result.safety_incidents_count === 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {result.safety_incidents_count === 0 ? 'None ✓' : result.safety_incidents_count}
              </p>
            </div>
          </div>

          {/* Machinery */}
          {result.machinery_operational?.length > 0 && (
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium flex items-center gap-2"><Wrench className="w-3.5 h-3.5" /> Machinery Status</p>
              <div className="flex flex-wrap gap-2">
                {result.machinery_operational.map((m, i) => <StatusBadge key={i} status={m.includes('Operational') ? m : m} size="sm" />)}
              </div>
            </div>
          )}

          {/* Works Completed */}
          {result.works_completed?.length > 0 && (
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Work Progress</p>
              <div className="space-y-3">
                {result.works_completed.map((w, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-200">{w.trade}</span>
                      <span className="font-bold text-teal-400">{w.percentage_completed}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${w.percentage_completed}%` }} />
                    </div>
                    <p className="text-xs text-slate-400">{w.description}</p>
                    {w.delays_encountered !== 'None' && w.delays_encountered && (
                      <p className="text-xs text-amber-400">⚠ {w.delays_encountered}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Material Deliveries */}
          {result.material_deliveries?.length > 0 && (
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> Material Deliveries</p>
              <div className="space-y-2">
                {result.material_deliveries.map((d, i) => (
                  <div key={i} className="flex flex-wrap gap-2 text-sm items-center">
                    <span className="text-slate-200 font-medium">{d.material}</span>
                    <span className="text-slate-400">{d.quantity}</span>
                    <span className="text-slate-500 text-xs">via {d.supplier}</span>
                    <StatusBadge status={d.quality_status.includes('Passed') ? 'PASSED' : 'PENDING'} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues & Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.critical_issues_and_delays?.length > 0 && (
              <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-amber-400 mb-2 font-semibold">Issues & Delays</p>
                <ul className="space-y-1.5">
                  {result.critical_issues_and_delays.map((i, idx) => (
                    <li key={idx} className="text-sm text-amber-100 flex gap-2"><span className="shrink-0">•</span>{i}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.action_items_for_tomorrow?.length > 0 && (
              <div className="p-4 bg-sky-950/20 border border-sky-500/20 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-sky-400 mb-2 font-semibold">Tomorrow's Action Items</p>
                <ul className="space-y-1.5">
                  {result.action_items_for_tomorrow.map((a, i) => (
                    <li key={i} className="text-sm text-sky-100 flex gap-2"><span className="text-sky-500 shrink-0">→</span>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.supervisor_signoff_notes && (
            <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 italic">
              📋 <span className="text-slate-500 not-italic font-medium">Supervisor Sign-off: </span>{result.supervisor_signoff_notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

