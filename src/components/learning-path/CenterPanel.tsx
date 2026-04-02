import { Plus } from 'lucide-react';
import { modules, gap, type Proficiency } from './data';
import ModuleCard from './ModuleCard';
import { Button } from '@/components/ui/button';

const sectionStyles: Record<Proficiency, { bg: string; label: string; border: string }> = {
  Beginner: { bg: 'bg-base-major', label: 'text-base-muted', border: 'border-base-pure' },
  Intermediate: { bg: 'bg-accent-minor', label: 'text-accent-major', border: 'border-accent-pure' },
  Advanced: { bg: 'bg-emphasis-purple-light', label: 'text-emphasis-purple', border: 'border-emphasis-purple/20' },
};

const CoverageBar = () => {
  const begPct = 25;
  const intPct = 45;
  const advPct = 30;
  return (
    <div className="bg-plain-white rounded border border-base-pure p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-base-text">Coverage Distribution</span>
        <span className="text-xs text-base-muted">7 modules</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden">
        <div className="bg-base-pure" style={{ width: `${begPct}%` }} title="Beginner" />
        <div className="bg-accent-major" style={{ width: `${intPct}%` }} title="Intermediate" />
        <div className="bg-emphasis-purple" style={{ width: `${advPct}%` }} title="Advanced" />
      </div>
      <div className="flex justify-between text-[10px] text-base-muted">
        <span>Beginner {begPct}%</span>
        <span>Intermediate {intPct}%</span>
        <span>Advanced {advPct}%</span>
      </div>
    </div>
  );
};

const GapCard = () => (
  <div className="relative rounded border-2 border-dashed border-signal-error bg-signal-error-light p-3 space-y-2">
    <div className="flex items-start justify-between">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-signal-error">Gap Detected</span>
        <h4 className="text-sm font-medium text-base-text mt-0.5">{gap.title}</h4>
      </div>
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-signal-error/10 text-signal-error">
        Severity: {gap.severity}
      </span>
    </div>
    <p className="text-xs text-base-muted">Confidence: {gap.confidence}%</p>
    <div className="space-y-1.5">
      <span className="text-[10px] font-semibold text-base-muted uppercase tracking-wider">Suggested Modules</span>
      {gap.suggestedModules.map((s, i) => (
        <div key={i} className="flex items-center justify-between bg-plain-white rounded border border-base-pure p-2">
          <div>
            <span className="text-xs text-base-text">{s.title}</span>
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-sm ${s.source === 'Generated' ? 'bg-emphasis-purple-light text-emphasis-purple' : 'bg-base-minor text-base-muted'}`}>
              {s.source}
            </span>
          </div>
          <Button size="sm" variant="outline" className="h-6 text-[10px] border-accent-major text-accent-major hover:bg-accent-minor">
            + Add
          </Button>
        </div>
      ))}
    </div>
  </div>
);

const CenterPanel = () => {
  const grouped: Record<Proficiency, typeof modules> = {
    Beginner: modules.filter((m) => m.proficiency === 'Beginner'),
    Intermediate: modules.filter((m) => m.proficiency === 'Intermediate'),
    Advanced: modules.filter((m) => m.proficiency === 'Advanced'),
  };

  let globalIndex = 0;

  return (
    <main className="flex-1 h-full overflow-y-auto custom-scrollbar bg-base-major p-4 space-y-4">
      <CoverageBar />

      {(['Beginner', 'Intermediate', 'Advanced'] as Proficiency[]).map((level) => {
        const style = sectionStyles[level];
        return (
          <div key={level} className="space-y-3">
            {/* Section header */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded ${style.bg} border ${style.border}`}>
              <div className={`h-2 w-2 rounded-full ${level === 'Beginner' ? 'bg-base-pure' : level === 'Intermediate' ? 'bg-accent-major' : 'bg-emphasis-purple'}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${style.label}`}>{level}</span>
              <span className="text-[10px] text-base-muted ml-auto">{grouped[level].length} modules</span>
            </div>

            {/* Timeline connector + cards */}
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-base-pure" />

              <div className="space-y-3">
                {grouped[level].map((mod) => {
                  const idx = globalIndex++;
                  return (
                    <div key={mod.id} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[14px] top-4 h-2.5 w-2.5 rounded-full border-2 border-plain-white ${
                        level === 'Beginner' ? 'bg-base-pure' : level === 'Intermediate' ? 'bg-accent-major' : 'bg-emphasis-purple'
                      }`} />
                      {/* Connector line */}
                      {mod.prerequisites.length > 0 && (
                        <div className="absolute -left-[8px] top-4 w-[22px] h-px bg-accent-pure" />
                      )}
                      <ModuleCard module={mod} index={idx} />
                    </div>
                  );
                })}

                {/* Gap after Advanced */}
                {level === 'Advanced' && (
                  <div className="relative">
                    <div className="absolute -left-[14px] top-4 h-2.5 w-2.5 rounded-full border-2 border-plain-white bg-signal-error" />
                    <GapCard />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add module */}
      <button className="w-full flex items-center justify-center gap-2 py-3 rounded border border-dashed border-base-pure text-xs text-base-muted hover:bg-base-minor hover:border-accent-pure transition-colors">
        <Plus className="h-3.5 w-3.5" />
        Add Module
      </button>
    </main>
  );
};

export default CenterPanel;
