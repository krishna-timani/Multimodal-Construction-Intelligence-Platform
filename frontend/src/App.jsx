import React, { useState, useEffect } from 'react';
import SafetyPage from './components/SafetyPage.jsx';
import CrackPage from './components/CrackPage.jsx';
import EstimationPage from './components/EstimationPage.jsx';
import PlanningPage from './components/PlanningPage.jsx';
import ValuationPage from './components/ValuationPage.jsx';
import SitePage from './components/SitePage.jsx';
import WeatherPage from './components/WeatherPage.jsx';
import KnowledgePage from './components/KnowledgePage.jsx';
import { api } from './services/api.js';
import {
  ShieldAlert, Layers, Calculator, Calendar, Home,
  ClipboardList, CloudSun, BookOpen, HardHat, ChevronRight,
  Wifi, WifiOff, Menu, X, Building2, Zap
} from 'lucide-react';

const MODULES = [
  { id: 'safety',      label: 'Safety Monitor',    icon: ShieldAlert,   color: 'text-rose-400',   bg: 'bg-rose-900/20 hover:bg-rose-900/40',   active: 'bg-rose-900/40 border-rose-500/50',   desc: 'PPE & hazard detection' },
  { id: 'crack',       label: 'Crack Analysis',    icon: Layers,        color: 'text-orange-400', bg: 'bg-orange-900/20 hover:bg-orange-900/40', active: 'bg-orange-900/40 border-orange-500/50', desc: 'Structural diagnostics' },
  { id: 'estimation',  label: 'Cost Estimator',    icon: Calculator,    color: 'text-emerald-400',bg: 'bg-emerald-900/20 hover:bg-emerald-900/40',active: 'bg-emerald-900/40 border-emerald-500/50',desc: 'BOQ & material costs' },
  { id: 'planning',    label: 'Project Planner',   icon: Calendar,      color: 'text-violet-400', bg: 'bg-violet-900/20 hover:bg-violet-900/40', active: 'bg-violet-900/40 border-violet-500/50', desc: 'WBS & CPM scheduling' },
  { id: 'valuation',   label: 'Valuation',         icon: Home,          color: 'text-sky-400',    bg: 'bg-sky-900/20 hover:bg-sky-900/40',      active: 'bg-sky-900/40 border-sky-500/50',      desc: 'Real estate appraisal' },
  { id: 'site',        label: 'Site Assistant',    icon: ClipboardList, color: 'text-teal-400',   bg: 'bg-teal-900/20 hover:bg-teal-900/40',   active: 'bg-teal-900/40 border-teal-500/50',   desc: 'Daily site logger' },
  { id: 'weather',     label: 'Weather Advisory',  icon: CloudSun,      color: 'text-cyan-400',   bg: 'bg-cyan-900/20 hover:bg-cyan-900/40',   active: 'bg-cyan-900/40 border-cyan-500/50',   desc: 'Activity impact forecast' },
  { id: 'knowledge',   label: 'Knowledge AI',      icon: BookOpen,      color: 'text-indigo-400', bg: 'bg-indigo-900/20 hover:bg-indigo-900/40', active: 'bg-indigo-900/40 border-indigo-500/50', desc: 'Engineering Q&A' },
];

const PAGE_MAP = {
  safety: SafetyPage,
  crack: CrackPage,
  estimation: EstimationPage,
  planning: PlanningPage,
  valuation: ValuationPage,
  site: SitePage,
  weather: WeatherPage,
  knowledge: KnowledgePage,
};

function NavItem({ mod, active, onClick }) {
  const Icon = mod.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left group ${
        active
          ? `${mod.active} border-opacity-100`
          : `${mod.bg} border-transparent hover:border-slate-700`
      }`}
    >
      <div className={`p-1.5 rounded-lg ${active ? 'bg-black/20' : 'bg-slate-800/60 group-hover:bg-slate-700/60'} shrink-0 transition-colors`}>
        <Icon className={`w-4 h-4 ${mod.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium truncate ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'} transition-colors`}>{mod.label}</p>
        <p className="text-xs text-slate-500 truncate">{mod.desc}</p>
      </div>
      {active && <ChevronRight className={`w-3.5 h-3.5 ${mod.color} shrink-0`} />}
    </button>
  );
}

function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-sky-500/5" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Building2 className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">AI Construction Intelligence</h1>
              <p className="text-slate-400 text-sm">Multimodal platform for smart construction management</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Leverage <span className="text-amber-300 font-medium">multimodal AI</span> across 8 intelligent modules — from OSHA-grade safety audits and structural crack forensics,
            to real estate valuations, project scheduling, and weather-aware site advisories.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Gemini AI Powered', 'FastAPI Backend', 'React + Vite', 'OSHA Compliant', 'ACI / IS Codes'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-slate-700/60 border border-slate-600 text-slate-300 text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Intelligence Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MODULES.map(mod => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className={`p-4 rounded-xl border border-transparent ${mod.bg} hover:border-slate-700 transition-all text-left group hover:scale-[1.01]`}
              >
                <div className={`p-2.5 rounded-xl bg-slate-900/60 w-fit mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${mod.color}`} />
                </div>
                <p className="font-semibold text-slate-100 text-sm">{mod.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{mod.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Backend', stack: ['Python 3.14', 'FastAPI 0.162', 'Uvicorn', 'Pydantic v2', 'Google GenAI'], icon: '⚙️' },
          { label: 'Frontend', stack: ['React 19', 'Vite 8', 'Tailwind CSS v4', 'Lucide Icons'], icon: '🎨' },
          { label: 'AI / ML', stack: ['Gemini 2.5 Flash', 'Multimodal Vision', 'Prompt Engineering', 'JSON Schema Contracts'], icon: '🤖' },
        ].map(s => (
          <div key={s.label} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <p className="text-sm font-semibold text-slate-200 mb-3">{s.icon} {s.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.stack.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => setHealth({ status: 'offline' }));
  }, []);

  const activeMod = MODULES.find(m => m.id === activeModule);
  const PageComponent = PAGE_MAP[activeModule];

  const navigate = (id) => {
    setActiveModule(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <HardHat className="w-5 h-5 text-amber-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white text-sm">ConstructionAI</span>
              <span className="text-slate-500 text-sm"> Platform</span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Breadcrumb */}
          {activeMod && (
            <div className="hidden md:flex items-center gap-2 text-sm">
              <button onClick={() => setActiveModule('dashboard')} className="text-slate-500 hover:text-slate-300 transition-colors">Dashboard</button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className={`font-medium ${activeMod.color}`}>{activeMod.label}</span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 ml-4">
            {health ? (
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium ${
                health.llm_connected
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400'
                  : 'border-amber-500/40 bg-amber-950/30 text-amber-400'
              }`}>
                {health.llm_connected ? <Zap className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                <span className="hidden sm:inline">{health.llm_connected ? 'Gemini Live' : 'Offline Mode'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-600 text-slate-500 text-xs">
                <WifiOff className="w-3 h-3" /> Connecting...
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0
          bg-slate-950 lg:bg-transparent border-r border-slate-800 lg:border-r-0
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col pt-14 lg:pt-0
        `}>
          <div className="flex flex-col gap-1 p-3 overflow-y-auto flex-1">
            {/* Dashboard Home */}
            <button
              onClick={() => navigate('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left mb-1 ${
                activeModule === 'dashboard'
                  ? 'bg-amber-900/30 border-amber-500/40'
                  : 'border-transparent bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-amber-900/50 shrink-0">
                <Building2 className="w-4 h-4 text-amber-400" />
              </div>
              <span className={`text-sm font-semibold ${activeModule === 'dashboard' ? 'text-amber-300' : 'text-slate-300'}`}>Dashboard</span>
            </button>

            <div className="text-xs text-slate-600 uppercase tracking-wider px-3 py-1 font-medium">AI Modules</div>

            {MODULES.map(mod => (
              <NavItem
                key={mod.id}
                mod={mod}
                active={activeModule === mod.id}
                onClick={() => navigate(mod.id)}
              />
            ))}
          </div>

          {/* Backend Status Footer */}
          <div className="p-3 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500">
              <div className="flex items-center justify-between mb-1">
                <span>Backend</span>
                <span className={health?.status === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}>
                  {health?.status === 'healthy' ? '● Online' : '● Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Engine</span>
                <span className={health?.llm_connected ? 'text-emerald-400' : 'text-amber-400'}>
                  {health?.llm_connected ? '● Live' : '● Analytical Mode'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 sm:p-6">
            {activeModule === 'dashboard'
              ? <Dashboard onNavigate={navigate} />
              : PageComponent
                ? <PageComponent />
                : <div className="text-slate-400">Module not found.</div>
            }
          </div>
        </main>
      </div>
    </div>
  );
}
