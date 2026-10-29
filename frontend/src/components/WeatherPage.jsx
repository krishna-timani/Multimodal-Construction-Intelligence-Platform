import React, { useState } from 'react';
import { api } from '../services/api.js';
import StatusBadge from './StatusBadge.jsx';
import { CloudSun, Loader2, AlertTriangle, Thermometer, Wind, Droplets } from 'lucide-react';

export default function WeatherPage() {
  const [form, setForm] = useState({
    location: 'Central Construction Yard',
    temperature_c: 32.5,
    humidity_percent: 68.0,
    wind_speed_kmh: 24.0,
    precipitation_probability: 15.0,
    planned_activities: 'Concrete Pouring Slab Level 3\nTower Crane Heavy Steel Lifting\nExterior Stucco Plastering\nDeep Trenching and Earthwork',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const activities = form.planned_activities.split('\n').map(a => a.trim()).filter(Boolean);
      const data = await api.getWeatherAdvisory({
        location: form.location,
        temperature_c: Number(form.temperature_c),
        humidity_percent: Number(form.humidity_percent),
        wind_speed_kmh: Number(form.wind_speed_kmh),
        precipitation_probability: Number(form.precipitation_probability),
        planned_activities: activities,
      });
      setResult(data);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const statusColor = (s) => {
    if (s === 'OPTIMAL') return 'text-emerald-400';
    if (s === 'CAUTION') return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-900/40 border border-cyan-500/30">
          <CloudSun className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Weather-Aware Site Advisory</h2>
          <p className="text-sm text-slate-400">Engineering-grade construction activity impact analysis based on atmospheric conditions</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Weather Parameters */}
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Site Location</label>
          <input value={form.location} onChange={e => upd('location', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { k: 'temperature_c', label: 'Temperature (°C)', icon: Thermometer },
            { k: 'humidity_percent', label: 'Humidity (%)', icon: Droplets },
            { k: 'wind_speed_kmh', label: 'Wind Speed (km/h)', icon: Wind },
            { k: 'precipitation_probability', label: 'Rain Probability (%)', icon: CloudSun },
          ].map(f => (
            <div key={f.k}>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <f.icon className="w-3 h-3" /> {f.label}
              </label>
              <input type="number" step="0.1" value={form[f.k]} onChange={e => upd(f.k, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Planned Activities (one per line)</label>
          <textarea value={form.planned_activities} onChange={e => upd('planned_activities', e.target.value)} rows={5}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono text-xs" />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white transition-all disabled:opacity-50 flex items-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><CloudSun className="w-4 h-4" /> Get Weather Advisory</>}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Weather Summary Banner */}
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <div><p className="text-slate-500 text-xs">Temperature</p><p className="text-white font-bold">{result.temperature_c}°C</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <div><p className="text-slate-500 text-xs">Humidity</p><p className="text-white font-bold">{result.humidity_percent}%</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-slate-400" />
              <div><p className="text-slate-500 text-xs">Wind</p><p className="text-white font-bold">{result.wind_speed_kmh} km/h</p></div>
            </div>
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-cyan-400" />
              <div><p className="text-slate-500 text-xs">Rain Chance</p><p className="text-white font-bold">{result.precipitation_probability_percent}%</p></div>
            </div>
          </div>

          {/* Advisory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
              <p className="text-xs text-slate-500 mb-1 font-medium">🌡 Heat / Stress Level</p>
              <p className="text-sm text-amber-200">{result.heat_index_or_stress}</p>
            </div>
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
              <p className="text-xs text-slate-500 mb-1 font-medium">🏗 Crane Lifting Status</p>
              <p className={`text-sm font-semibold ${result.crane_lifting_clearance?.includes('OPTIMAL') ? 'text-emerald-300' : result.crane_lifting_clearance?.includes('CAUTION') ? 'text-amber-300' : 'text-rose-300'}`}>
                {result.crane_lifting_clearance}
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
            <p className="text-xs text-slate-500 mb-1 font-medium">🪨 Concrete Curing Advisory</p>
            <p className="text-sm text-sky-200">{result.concrete_curing_advisory}</p>
          </div>

          {/* Activity Impacts */}
          {result.activity_impacts?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Activity Impact Assessment</p>
              {result.activity_impacts.map((act, i) => (
                <div key={i} className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-3 items-start sm:items-center ${
                  act.status === 'OPTIMAL' ? 'border-emerald-500/30 bg-emerald-950/10' :
                  act.status === 'CAUTION' ? 'border-amber-500/30 bg-amber-950/10' :
                  'border-rose-500/30 bg-rose-950/10'}`}>
                  <div className="flex items-center gap-2 min-w-[220px]">
                    <StatusBadge status={act.status} size="sm" />
                    <span className="font-medium text-sm text-slate-200">{act.activity_name}</span>
                  </div>
                  <p className={`text-sm ${statusColor(act.status)}`}>{act.guidance}</p>
                </div>
              ))}
            </div>
          )}

          {result.protective_measures?.length > 0 && (
            <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-blue-400 mb-2 font-semibold">Protective Measures</p>
              <ul className="space-y-1.5">
                {result.protective_measures.map((m, i) => (
                  <li key={i} className="text-sm text-blue-100 flex gap-2"><span className="shrink-0 text-blue-400">🔵</span>{m}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
            <p className="text-xs text-slate-500 mb-1 font-medium">🕐 Safe Operational Window</p>
            <p className="text-emerald-200 font-medium text-sm">{result.safe_window_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

