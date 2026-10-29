import React, { useState } from 'react';
import { api } from '../services/api.js';
import { BookOpen, Loader2, AlertTriangle, CheckSquare, ExternalLink, MessageSquare } from 'lucide-react';

const QUICK_QUESTIONS = [
  'What is the minimum concrete curing time per ACI 308R?',
  'OSHA requirements for fall protection at 6 feet height',
  'How to repair diagonal shear cracks in RCC beams?',
  'Safe wind speed limits for tower crane operations',
  'What is the water-cement ratio for M30 concrete mix design?',
  'Steps for epoxy injection crack repair methodology',
];

export default function KnowledgePage() {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Structural Engineering & Safety Regulations');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (q = null) => {
    const queryText = q || question;
    if (!queryText.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await api.queryKnowledge({ question: queryText, category });
      setResult(data);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-900/40 border border-indigo-500/30">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Construction Knowledge Assistant</h2>
          <p className="text-sm text-slate-400">Expert answers on structural engineering, building codes (ACI, OSHA, IS, Eurocodes), safety & best practices</p>
        </div>
      </div>

      {/* Quick Question Chips */}
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Quick Questions</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => { setQuestion(q); handleSubmit(q); }}
              className="px-3 py-1.5 rounded-full bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-500/30 text-indigo-200 text-xs transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
            {[
              'Structural Engineering & Safety Regulations',
              'Concrete Technology & Mix Design',
              'Construction Safety (OSHA / IS Standards)',
              'Project Management & Scheduling',
              'Real Estate & Property Valuation',
              'MEP – Mechanical Electrical Plumbing',
              'Foundation & Geotechnical Engineering',
              'Repair & Rehabilitation Methods',
            ].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Your Question</label>
          <div className="relative">
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(); }}
              rows={4}
              placeholder="Ask anything about construction engineering, safety codes, materials, project management..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none pr-24"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !question.trim()}
              className="absolute bottom-3 right-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
              {loading ? 'Asking...' : 'Ask AI'}
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1">Tip: Press Ctrl+Enter to submit</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Question Echo */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center shrink-0 text-xs">
              Q
            </div>
            <div className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300">
              {result.question}
            </div>
          </div>

          {/* Answer */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-xs text-indigo-300">
              AI
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-slate-800/60 border border-indigo-500/20 rounded-xl px-4 py-4 text-sm text-slate-200 leading-relaxed">
                {result.answer}
              </div>

              {/* Codes */}
              {result.relevant_codes?.length > 0 && (
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" /> Applicable Standards & Codes
                  </p>
                  <div className="space-y-2">
                    {result.relevant_codes.map((c, i) => (
                      <div key={i} className="flex gap-3 items-start text-sm">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-xs font-mono shrink-0 mt-0.5">
                          {c.standard_name}
                        </span>
                        <div>
                          <p className="text-slate-300 text-xs font-medium">{c.section}</p>
                          <p className="text-slate-500 text-xs">{c.relevance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {result.practical_checklist?.length > 0 && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs uppercase tracking-wider text-emerald-400 mb-3 font-semibold flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5" /> Practical Execution Checklist
                  </p>
                  <ul className="space-y-2">
                    {result.practical_checklist.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-emerald-100">
                        <span className="mt-0.5 shrink-0 w-4 h-4 rounded border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-xs">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compliance Risks */}
              {result.compliance_risks?.length > 0 && (
                <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                  <p className="text-xs uppercase tracking-wider text-amber-400 mb-2 font-semibold">⚠ Compliance Risks</p>
                  <ul className="space-y-1.5">
                    {result.compliance_risks.map((r, i) => (
                      <li key={i} className="text-sm text-amber-100 flex gap-2"><span className="shrink-0">•</span>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Topics */}
              {result.recommended_followup_topics?.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Related Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {result.recommended_followup_topics.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => { setQuestion(t); handleSubmit(t); }}
                        className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

