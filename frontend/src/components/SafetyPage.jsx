import React, { useState, useRef } from 'react';
import { api } from '../services/api.js';
import StatusBadge from './StatusBadge.jsx';
import MetricCard from './MetricCard.jsx';
import {
  ShieldAlert, UploadCloud, Loader2, AlertTriangle, CheckCircle,
  User, HardHat, Eye, Zap, ChevronDown, ChevronUp
} from 'lucide-react';

function HazardCard({ h, idx }) {
  const [open, setOpen] = useState(false);
  const sev = (h.severity || '').toUpperCase();
  const border =
    sev === 'CRITICAL' ? 'border-rose-500/60 bg-rose-950/20' :
    sev === 'HIGH' ? 'border-orange-500/60 bg-orange-950/20' :
    sev === 'MEDIUM' ? 'border-amber-500/60 bg-amber-950/20' :
    'border-slate-600 bg-slate-800/40';

  return (
    <div className={`border rounded-xl p-4 transition-all ${border}`}>
      <button
        className="w-full flex items-center justify-between gap-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="font-semibold text-sm text-slate-100">{h.title}</span>
          <StatusBadge status={h.severity} size="sm" />
          <span className="hidden sm:inline text-xs text-slate-500">{h.category}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <p><span className="text-slate-500">Description: </span>{h.description}</p>
          <p><span className="text-slate-500">Recommendation: </span>{h.recommendation}</p>
          {h.osha_reference && (
            <p className="text-xs font-mono bg-slate-900 rounded px-2 py-1 text-sky-400">{h.osha_reference}</p>
          )}
        </div>
      )}
    </div>
  );
}

function PpeRow({ w }) {
  const items = [
    { label: 'Helmet', val: w.helmet_detected },
    { label: 'Vest', val: w.vest_detected },
    { label: 'Boots', val: w.boots_detected },
    { label: 'Harness', val: w.harness_detected },
    { label: 'Gloves', val: w.gloves_detected },
  ];
  return (
    <div className={`p-3 rounded-lg border text-sm ${w.is_compliant ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 font-medium text-slate-200">
          <User className="w-3.5 h-3.5" /> {w.worker_id}
        </span>
        <StatusBadge status={w.is_compliant ? 'COMPLIANT' : 'NON-COMPLIANT'} size="sm" />
      </div>
      <div className="flex gap-3 flex-wrap">
        {items.map(it => it.val !== null && it.val !== undefined ? (
          <span key={it.label} className={`text-xs flex items-center gap-1 ${it.val ? 'text-emerald-400' : 'text-rose-400'}`}>
            {it.val ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {it.label}
          </span>
        ) : null)}
      </div>
      {w.violations?.length > 0 && (
        <div className="mt-2 text-xs text-rose-300">{w.violations.join('; ')}</div>
      )}
    </div>
  );
}

export default function SafetyPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('Zone 1 - Main Structural Deck');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f);
    setPreview(URL.createObjectURL(f));
    setResult(null); setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      if (image) fd.append('image', image);
      fd.append('notes', notes);
      fd.append('site_location', location);
      const data = await api.analyzeSafety(fd);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.overall_safety_score >= 85 ? 'text-emerald-400'
    : result.overall_safety_score >= 65 ? 'text-amber-400'
    : 'text-rose-400' : 'text-slate-400';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-rose-900/40 border border-rose-500/30">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Construction Site Safety Monitor</h2>
          <p className="text-sm text-slate-400">OSHA-compliant multimodal hazard detection & PPE compliance analysis</p>
        </div>
      </div>

      {/* Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Image Upload */}
        <div
          className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[200px] bg-slate-900/40"
          onClick={() => fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {preview ? (
            <img src={preview} alt="Site preview" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-slate-500" />
              <p className="text-sm text-slate-400">Upload construction site photo</p>
              <p className="text-xs text-slate-600">JPG, PNG, WEBP — or analyze without image</p>
            </>
          )}
        </div>

        {/* Text Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Site Zone / Location</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="e.g. Tower A – North Perimeter"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Supervisor Observations / Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              placeholder="Describe site conditions, observed behaviors, active tasks, equipment being used..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Site...</> : <><ShieldAlert className="w-4 h-4" /> Run Safety Analysis</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard title="Safety Score" value={result.overall_safety_score} unit="/ 100" icon={ShieldAlert}
              status={result.overall_safety_score >= 85 ? 'success' : result.overall_safety_score >= 65 ? 'warning' : 'danger'} />
            <MetricCard title="Risk Level" value={result.risk_level} icon={AlertTriangle}
              status={result.risk_level === 'SAFE' ? 'success' : result.risk_level === 'MODERATE' ? 'warning' : 'danger'} />
            <MetricCard title="Workers Detected" value={result.total_workers_detected} icon={User} status="primary" />
            <MetricCard title="Compliant Workers" value={result.compliant_workers_count} icon={CheckCircle}
              status={result.compliant_workers_count === result.total_workers_detected ? 'success' : 'warning'}
              subtitle={`${result.total_workers_detected > 0 ? Math.round((result.compliant_workers_count / result.total_workers_detected) * 100) : 0}% compliance rate`} />
          </div>

          {/* Summary */}
          <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-300 leading-relaxed">
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">AI Analysis Summary</p>
            {result.summary}
          </div>

          {/* Immediate Actions */}
          {result.immediate_actions?.length > 0 && (
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-amber-400 mb-3 font-semibold flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Immediate Corrective Actions
              </p>
              <ul className="space-y-1.5">
                {result.immediate_actions.map((a, i) => (
                  <li key={i} className="text-sm text-amber-100 flex gap-2">
                    <span className="text-amber-500 font-bold shrink-0">→</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hazards */}
          {result.hazards?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">Detected Hazards ({result.hazards.length})</p>
              <div className="space-y-2">
                {result.hazards.map((h, i) => <HazardCard key={i} h={h} idx={i} />)}
              </div>
            </div>
          )}

          {/* PPE Evaluations */}
          {result.ppe_evaluations?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium flex items-center gap-2">
                <HardHat className="w-3.5 h-3.5" /> PPE Compliance Per Worker
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.ppe_evaluations.map((w, i) => <PpeRow key={i} w={w} />)}
              </div>
            </div>
          )}

          {/* OSHA Citations */}
          {result.osha_citations?.length > 0 && (
            <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" /> Applicable OSHA Standards
              </p>
              <div className="flex flex-wrap gap-2">
                {result.osha_citations.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-600 text-xs font-mono text-sky-400">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

