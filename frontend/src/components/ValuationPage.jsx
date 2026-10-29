import React, { useState, useRef } from 'react';
import { api } from '../services/api.js';
import MetricCard from './MetricCard.jsx';
import { Home, Loader2, AlertTriangle, TrendingUp, BarChart2, UploadCloud } from 'lucide-react';

export default function ValuationPage() {
  const [form, setForm] = useState({
    property_title: 'Modern 3BHK Urban Apartment',
    property_type: 'Residential Apartment',
    location: 'Financial District Metro Corridor',
    built_up_area_sqft: 1850,
    age_years: 2,
    construction_quality: 'Grade A+ (RCC framed with imported fittings)',
    amenities: 'Clubhouse, 24/7 Power Backup, Covered Parking, Solar Water Heating',
    market_condition: 'High Demand',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      if (image) fd.append('image', image);
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      const data = await api.evaluateValuation(fd);
      setResult(data);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const fmt = (n) => typeof n === 'number' ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : n;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-sky-900/40 border border-sky-500/30">
          <Home className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Real Estate Valuation Engine</h2>
          <p className="text-sm text-slate-400">Multi-factor appraisal: Cost + Sales Comparison + Income Capitalization approaches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Image Upload */}
        <div
          className="border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[150px] bg-slate-900/40"
          onClick={() => fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {preview ? <img src={preview} alt="Property" className="max-h-36 rounded-lg object-contain" />
            : <><UploadCloud className="w-6 h-6 text-slate-500" /><p className="text-xs text-slate-500 text-center">Upload property image (optional)</p></>}
        </div>

        {/* Form Fields */}
        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { k: 'property_title', label: 'Property Title', type: 'text', full: true },
            { k: 'property_type', label: 'Type', type: 'select', opts: ['Residential Apartment', 'Luxury Penthouse', 'Commercial Office', 'Industrial Plot', 'Mixed-Use Complex'] },
            { k: 'location', label: 'Location / Micro-market' , type: 'text' },
            { k: 'built_up_area_sqft', label: 'Built-up Area (sq ft)', type: 'number' },
            { k: 'age_years', label: 'Age (years)', type: 'number' },
            { k: 'construction_quality', label: 'Construction Quality', type: 'text' },
            { k: 'amenities', label: 'Amenities (comma separated)', type: 'text', full: true },
            { k: 'market_condition', label: 'Market Condition', type: 'select', opts: ['High Demand', 'Stable', 'Declining', 'Distressed'] },
          ].map(f => (
            <div key={f.k} className={f.full ? 'col-span-full' : ''}>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
              {f.type === 'select' ? (
                <select value={form[f.k]} onChange={e => upd(f.k, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors">
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type} value={form[f.k]} onChange={e => upd(f.k, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors" />
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-sky-900/30">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Valuing Property...</> : <><Home className="w-4 h-4" /> Run Valuation Analysis</>}
      </button>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="space-y-5 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard title="Market Value" value={fmt(result.estimated_market_value)} icon={Home} status="success" />
            <MetricCard title="Price / Sq Ft" value={fmt(result.price_per_sqft)} icon={BarChart2} status="primary" />
            <MetricCard title="Confidence" value={`${result.confidence_score}%`} icon={TrendingUp}
              status={result.confidence_score > 85 ? 'success' : 'warning'} />
            <MetricCard title="5yr Appreciation" value={`+${result.projected_5yr_appreciation_percent}%`} icon={TrendingUp} status="success" />
          </div>

          {/* Valuation Range */}
          <div className="p-4 bg-sky-950/30 border border-sky-500/30 rounded-xl">
            <p className="text-xs text-slate-500 mb-2">Valuation Range</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-slate-400">Conservative</p>
                <p className="text-lg font-bold text-sky-300">{fmt(result.valuation_range_low)}</p>
              </div>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" style={{ width: '60%' }} />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Optimistic</p>
                <p className="text-lg font-bold text-sky-200">{fmt(result.valuation_range_high)}</p>
              </div>
            </div>
          </div>

          {/* Quality & Depreciation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
              <p className="text-xs text-slate-500">Construction Grade</p>
              <p className="text-slate-200 font-medium mt-1 text-sm">{result.construction_quality_grade}</p>
            </div>
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
              <p className="text-xs text-slate-500">Physical Depreciation</p>
              <p className="text-amber-300 font-bold text-lg mt-1">{result.depreciation_percent}%</p>
            </div>
          </div>

          {/* Value Drivers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-emerald-400 mb-2 font-semibold">Key Value Drivers</p>
              <ul className="space-y-1.5">
                {result.key_value_drivers?.map((d, i) => (
                  <li key={i} className="text-sm text-emerald-100 flex gap-2"><span className="text-emerald-500 shrink-0">↑</span>{d}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-amber-400 mb-2 font-semibold">Risk Factors</p>
              <ul className="space-y-1.5">
                {result.risk_factors?.map((r, i) => (
                  <li key={i} className="text-sm text-amber-100 flex gap-2"><span className="text-amber-500 shrink-0">⚠</span>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comparables */}
          {result.comparable_sales?.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800">
                <span className="font-semibold text-sm text-white">Comparable Sales Analysis</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/60">
                      {['Property', 'Distance', 'Area (sqft)', 'Sale Price', '₹/sqft', 'Similarity'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-xs font-medium text-slate-400 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {result.comparable_sales.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-3 py-2.5 text-slate-200">{c.title}</td>
                        <td className="px-3 py-2.5 text-slate-400">{c.distance_km} km</td>
                        <td className="px-3 py-2.5 text-slate-300 font-mono">{c.built_up_sqft?.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-sky-300 font-mono font-semibold">{fmt(c.sale_price)}</td>
                        <td className="px-3 py-2.5 text-slate-300 font-mono">{fmt(c.price_per_sqft)}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden w-16">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${c.similarity_index}%` }} />
                            </div>
                            <span className="text-sky-400 text-xs font-bold">{c.similarity_index}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Investment Recommendation */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl">
            <p className="text-xs uppercase tracking-wider text-emerald-400 mb-2 font-semibold">Investment Recommendation</p>
            <p className="text-emerald-100 font-medium">{result.investment_recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

