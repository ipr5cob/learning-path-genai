import { useState } from 'react';
import { explainabilityData } from './data';
import { AlertTriangle, BookOpen, Brain, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'explain' | 'reasoning' | 'gaps' | 'citations';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'explain', label: 'Explain', icon: <BookOpen className="h-3 w-3" /> },
  { id: 'reasoning', label: 'AI Reasoning', icon: <Brain className="h-3 w-3" /> },
  { id: 'gaps', label: 'Gap Analysis', icon: <AlertTriangle className="h-3 w-3" /> },
  { id: 'citations', label: 'Citations', icon: <Search className="h-3 w-3" /> },
];

const RightPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('explain');
  const d = explainabilityData;

  return (
    <aside className="w-full h-full bg-contrast-bg text-contrast-text overflow-y-auto custom-scrollbar flex flex-col">
      <div className="p-3 border-b border-contrast-secondary">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-contrast-muted">AI Insights</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-contrast-secondary">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
              activeTab === t.id
                ? 'text-accent-pure border-b-2 border-accent-pure'
                : 'text-contrast-muted hover:text-contrast-text'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 space-y-4">
        {activeTab === 'explain' && (
          <>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-accent-pure">Why This Order</h3>
              <p className="text-xs text-contrast-muted leading-relaxed">{d.orderReason}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-accent-pure">Dependency Summary</h3>
              <p className="text-xs text-contrast-muted leading-relaxed">{d.dependencySummary}</p>
            </div>
            <div className="p-3 rounded bg-contrast-secondary border border-contrast-secondary space-y-2">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-contrast-muted">Dependency Graph</h4>
              <div className="text-xs font-mono text-contrast-muted space-y-1">
                <p>M1 → M2</p>
                <p>M2 → M3, M4, M5</p>
                <p>M4 → M6</p>
                <p>M4 + M6 → M7</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'reasoning' && (
          <>
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-accent-pure">AI-Generated Module Analysis</h3>
              {d.aiReasoning.map((r, i) => (
                <div key={i} className="p-3 rounded bg-contrast-secondary border border-contrast-secondary space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-contrast-text">{r.module}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${
                      r.confidence >= 90 ? 'bg-signal-success/20 text-signal-success' : r.confidence >= 80 ? 'bg-signal-warning/20 text-signal-warning' : 'bg-signal-error/20 text-signal-error'
                    }`}>
                      {r.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-contrast-muted">Similarity:</span>
                    <div className="flex-1 h-1.5 rounded-full bg-contrast-bg overflow-hidden">
                      <div className="h-full bg-accent-major rounded-full" style={{ width: `${r.similarity * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-contrast-muted">{(r.similarity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {r.skills.map((s) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-signal-info/10 text-signal-info">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'gaps' && (
          <>
            <div className="p-3 rounded bg-signal-error/10 border border-signal-error/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-signal-error">Missing Coverage</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-signal-error/20 text-signal-error">
                  {d.gapAnalysis.severity}
                </span>
              </div>
              <p className="text-xs text-contrast-muted">{d.gapAnalysis.area}</p>
              <p className="text-xs text-contrast-muted">{d.gapAnalysis.description}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-contrast-muted">Confidence:</span>
                <span className="font-medium text-signal-error">{d.gapAnalysis.confidence}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-accent-pure">Suggested Modules</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded bg-contrast-secondary">
                  <span className="text-xs text-contrast-text">Azure Monitor Integration</span>
                  <Button size="sm" className="h-5 text-[10px] bg-accent-major hover:bg-accent-hover text-plain-white">
                    <Plus className="h-2.5 w-2.5 mr-0.5" />Add
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-contrast-secondary">
                  <span className="text-xs text-contrast-text">App Insights Observability</span>
                  <Button size="sm" className="h-5 text-[10px] bg-accent-major hover:bg-accent-hover text-plain-white">
                    <Plus className="h-2.5 w-2.5 mr-0.5" />Add
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'citations' && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-accent-pure">Sources Used</h3>
            {d.citations.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded bg-contrast-secondary border border-contrast-secondary">
                <span className="text-xs text-contrast-text">{c.source}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${
                  c.confidence >= 90 ? 'bg-signal-success/20 text-signal-success' : 'bg-signal-warning/20 text-signal-warning'
                }`}>
                  {c.confidence}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;
