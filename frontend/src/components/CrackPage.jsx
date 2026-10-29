import React, { useState, useRef } from 'react';
import { api } from '../services/api.js';
import StatusBadge from './StatusBadge.jsx';
import MetricCard from './MetricCard.jsx';
import {
  Layers, UploadCloud, Loader2, AlertTriangle, ChevronDown, ChevronUp,
  Hammer, Wrench, Activity
} from 'lucide-react';

function CrackCard({ crack }) {
  const [open, setOpen] = useState(false);
  const sev = (crack.severity || '').toUpperCase();
  const border =
    sev === 'CRITICAL_FAILURE_RISK' ? 'border-rose-600/70 bg-rose-950/20' :
    sev === 'SEVERE' ? 'border-orange-500/50 bg-orange-950/20' :
    sev === 'MODERATE' ? 'border-amber-500/40 bg-amber-950/10' :
    'border-slate-600 bg-slate-800/30';

  return (
    <div className={`border rounded-xl p-4 transition-all ${border}`}>
      <button className="w-full flex items-center justify-between gap-3 text-left" onClick={() => setOpen(o => !o)}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-500">{crack.crack_id}</span>
          <span className="font-semibold text-sm text-slate-100">{crack.crack_type?.replace(/_/g, ' ')}</span>
          <StatusBadge status={crack.severity?.replace(/_/g, ' ')} size="sm" />
          <span className="text-xs text-slate-500">{crack.location}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 rounded-lg p-2.5">
              <p className="text-xs text-slate-500 mb-0.5">Est. Width</p>
              <p className="font-bold text-white">{crack.estimated_width_mm} <span className="font-normal text-slate-400 text-xs">mm</span></p>
            </div>
            <div className="bg-slate-900 rounded-lg p-2.5">
              <p className="text-xs text-slate-500 mb-0.5">Est. Length</p>
              <p className="font-bold text-white">{crack.estimated_length_cm} <span className="font-normal text-slate-400 text-xs">cm</span></p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Structural Implication</p>
            <p className="text-slate-200">{crack.structural_implication}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1 font-medium">Probable Causes</p>
            <ul className="space-y-1">
              {crack.probable_causes?.map((c, i) => <li key={i} className="flex gap-1.5 text-slate-300"><span className="text-amber-500 shrink-0">•</span>{c}</li>)}
            </ul>
          </div>
          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-400 mb-1 font-semibold">⚡ Immediate Stabilization</p>
            <p>{crack.immediate_stabilization}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1 font-medium">Long-Term Remediation</p>
            <ol className="space-y-1 list-decimal list-inside">
              {crack.long_term_remediation?.map((r, i) => <li key={i} className="text-slate-300">{r}</li>)}
            </ol>
          </div>
          <p className="text-xs bg-slate-900 rounded px-2 py-1 font-mono text-sky-400">
            📊 Monitoring: {crack.monitoring_frequency}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CrackPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [memberType, setMemberType] = useState('RCC Beam-Column Joint');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f); setPreview(URL.createObjectURL(f)); setResult(null); setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      if (image) fd.append('image', image);
      fd.append('notes', notes);
      fd.append('member_type', memberType);
      const data = await api.analyzeCrack(fd);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-900/40 border border-orange-500/30">
          <Layers className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Structural Crack Detection & Analysis</h2>
          <p className="text-sm text-slate-400">Forensic AI crack classification, severity assessment & rehabilitation engineering</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="border-2 border-dashed border-slate-700 hover:border-orange-500/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[200px] bg-slate-900/40"
          onClick={() => fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {preview
            ? <img src={preview} alt="Crack preview" className="max-h-48 rounded-lg object-contain" />
            : <>
                <UploadCloud className="w-8 h-8 text-slate-500" />
                <p className="text-sm text-slate-400">Upload structural element photo</p>
                <p className="text-xs text-slate-600">Close-up of crack, beam, column, wall, or slab</p>
              </>
          }
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Structural Member / Element Type</label>
            <select
              value={memberType}
              onChange={e => setMemberType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option>RCC Beam-Column Joint</option>
              <option>Load-Bearing Masonry Wall</option>
              <option>Foundation Raft / Plinth Beam</option>
              <option>Suspended Floor Slab</option>
              <option>Staircase Riser / Landing</option>
              <option>External Stucco Plaster</option>
              <option>Precast Concrete Panel</option>
              <option>Bridge Deck / Girder</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Inspection Observations</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
              placeholder="Describe crack pattern, location on the element, any recent loading events or settlement observations..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Cracks...</> : <><Activity className="w-4 h-4" /> Run Crack Diagnostic</>}
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
            <MetricCard title="Health Index" value={result.overall_structural_health_index} unit="/ 100" icon={Activity}
              status={result.overall_structural_health_index >= 80 ? 'success' : result.overall_structural_health_index >= 55 ? 'warning' : 'danger'} />
            <MetricCard title="Risk Status" value={result.risk_status?.replace(/_/g, ' ')} icon={AlertTriangle}
              status={result.risk_status === 'NORMAL' ? 'success' : result.risk_status === 'WATCHLIST' ? 'warning' : 'danger'} />
            <MetricCard title="Cracks Detected" value={result.total_cracks_detected} icon={Layers} status="primary" />
            <MetricCard title="Evacuation" value={result.requires_evacuation ? 'REQUIRED' : 'Not Required'} icon={Wrench}
              status={result.requires_evacuation ? 'danger' : 'success'} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm">
              <p className="text-xs text-slate-500 mb-1">Surface Type</p>
              <p className="text-slate-200 font-medium">{result.surface_type}</p>
            </div>
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm">
              <p className="text-xs text-slate-500 mb-1">Image Quality</p>
              <StatusBadge status={result.image_quality_check ? 'ADEQUATE' : 'POOR QUALITY'} size="sm" />
            </div>
          </div>

          {result.detected_cracks?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">Crack Findings</p>
              <div className="space-y-2">
                {result.detected_cracks.map((c, i) => <CrackCard key={i} crack={c} />)}
              </div>
            </div>
          )}

          {result.engineering_recommendations?.length > 0 && (
            <div className="p-4 bg-sky-950/30 border border-sky-500/30 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-sky-400 mb-3 font-semibold flex items-center gap-2">
                <Hammer className="w-3.5 h-3.5" /> Engineering Recommendations
              </p>
              <ul className="space-y-1.5">
                {result.engineering_recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-sky-100 flex gap-2">
                    <span className="text-sky-500 font-bold shrink-0">→</span> {r}
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

