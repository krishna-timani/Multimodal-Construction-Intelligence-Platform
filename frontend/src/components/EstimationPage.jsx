import React, { useState } from 'react';
import { api } from '../services/api.js';
import MetricCard from './MetricCard.jsx';
import { Calculator, Loader2, AlertTriangle, Package, Users, TrendingDown } from 'lucide-react';

const CatColors = {
  Structural: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  Masonry: 'bg-orange-900/40 text-orange-300 border-orange-700/40',
  Finishing: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  Plumbing: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/40',
  Electrical: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
  Hardware: 'bg-slate-700/60 text-slate-300 border-slate-600',
};
const catStyle = (cat) => CatColors[cat] || CatColors.Hardware;

export default function EstimationPage() {
  const [form, setForm] = useState({
    project_title: 'Modern Residential Villa Phase 1',
    built_up_area_sqft: 3000,
    number_of_floors: 2,
    project_type: 'Residential Villa',
    quality_grade: 'Premium',
    location: 'Urban Metro',
    custom_notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = { ...form, built_up_area_sqft: Number(form.built_up_area_sqft), number_of_floors: Number(form.number_of_floors) };
      const data = await api.generateBOQ(payload);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => typeof n === 'number' ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : n;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30">
          <Calculator className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Material Estimation & Cost Planner (BOQ)</h2>
          <p className="text-sm text-slate-400">AI-driven Bill of Quantities, labor allocation & cost benchmarking</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { key: 'project_title', label: 'Project Title', type: 'text', full: true },
          { key: 'built_up_area_sqft', label: 'Built-up Area (sq ft)', type: 'number' },
          { key: 'number_of_floors', label: 'Number of Floors', type: 'number' },
          { key: 'project_type', label: 'Project Type', type: 'select', opts: ['Residential Villa', 'Multi-family Apartment', 'Commercial Office', 'Industrial Warehouse'] },
          { key: 'quality_grade', label: 'Quality Grade', type: 'select', opts: ['Standard', 'Premium', 'Luxury'] },
          { key: 'location', label: 'Location Context', type: 'text' },
          { key: 'custom_notes', label: 'Special Requirements', type: 'text', full: true },
        ].map(f => (
          <div key={f.key} className={f.full ? 'col-span-full' : ''}>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
            {f.type === 'select' ? (
              <select value={form[f.key]} onChange={e => upd(f.key, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} value={form[f.key]} onChange={e => upd(f.key, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" />
            )}
          </div>
        ))}
        <div className="col-span-full">
          <button onClick={handleSubmit} disabled={loading}
            className="py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-900/30">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating BOQ...</> : <><Calculator className="w-4 h-4" /> Generate Bill of Quantities</>}
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
          {/* Cost Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard title="Total Cost" value={fmt(result.total_estimated_cost)} icon={Calculator} status="success" />
            <MetricCard title="Cost / Sq Ft" value={fmt(result.cost_per_sqft)} icon={TrendingDown} status="primary" />
            <MetricCard title="Timeline" value={result.completion_timeline_weeks} unit="weeks" icon={Package} status="warning" />
            <MetricCard title="Materials" value={fmt(result.subtotal_material_cost)} icon={Package} status="default" subtitle={`Labor: ${fmt(result.subtotal_labor_cost)}`} />
          </div>

          {/* Materials Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm text-white">Material Schedule</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800/60 text-left">
                    {['Item', 'Category', 'Qty', 'Unit', 'Unit Cost', 'Total Cost', 'Spec'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {result.materials?.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3 py-2.5 text-slate-200 font-medium max-w-[180px]">{m.item_name}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${catStyle(m.category)}`}>{m.category}</span>
                      </td>
                      <td className="px-3 py-2.5 text-white font-mono">{m.quantity?.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-slate-400">{m.unit}</td>
                      <td className="px-3 py-2.5 text-slate-300 font-mono">{fmt(m.estimated_unit_cost)}</td>
                      <td className="px-3 py-2.5 text-emerald-400 font-mono font-semibold">{fmt(m.total_cost)}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs max-w-[200px] truncate" title={m.specifications}>{m.specifications}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Labor Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-sm text-white">Labour Allocation</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800/60 text-left">
                    {['Trade', 'Workers', 'Days', 'Daily Rate', 'Total Cost'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {result.labor?.map((l, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3 py-2.5 text-slate-200 font-medium">{l.trade}</td>
                      <td className="px-3 py-2.5 text-white font-mono">{l.worker_count}</td>
                      <td className="px-3 py-2.5 text-white font-mono">{l.estimated_days}</td>
                      <td className="px-3 py-2.5 text-slate-300 font-mono">{fmt(l.daily_rate)}</td>
                      <td className="px-3 py-2.5 text-sky-400 font-mono font-semibold">{fmt(l.total_cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
              <p className="text-xs text-slate-500">Equipment & Machinery</p>
              <p className="text-emerald-300 font-bold mt-1">{fmt(result.equipment_machinery_cost)}</p>
            </div>
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
              <p className="text-xs text-slate-500">Permits & Contingency</p>
              <p className="text-amber-300 font-bold mt-1">{fmt(result.permits_and_contingency)}</p>
            </div>
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl col-span-2">
              <p className="text-xs text-slate-500">Grand Total Estimated Cost</p>
              <p className="text-emerald-300 font-bold text-xl mt-1">{fmt(result.total_estimated_cost)}</p>
            </div>
          </div>

          {result.cost_saving_tips?.length > 0 && (
            <div className="p-4 bg-teal-950/30 border border-teal-500/30 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-teal-400 mb-3 font-semibold flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5" /> Cost Optimization Tips
              </p>
              <ul className="space-y-1.5">
                {result.cost_saving_tips.map((t, i) => (
                  <li key={i} className="text-sm text-teal-100 flex gap-2">
                    <span className="text-teal-500 font-bold shrink-0">✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

