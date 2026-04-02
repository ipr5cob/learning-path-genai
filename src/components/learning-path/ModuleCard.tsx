import { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock, Trash2, Replace, Info, AlertTriangle, Eye } from 'lucide-react';
import type { LearningModule } from './data';

const proficiencyColors: Record<string, string> = {
  Beginner: 'bg-base-minor text-base-muted',
  Intermediate: 'bg-accent-minor text-accent-major',
  Advanced: 'bg-emphasis-purple-light text-emphasis-purple',
};

const sourceColors: Record<string, string> = {
  Internal: 'bg-base-minor text-base-muted',
  Generated: 'bg-emphasis-purple-light text-emphasis-purple',
};

const ModuleCard = ({ module, index }: { module: LearningModule; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [locked, setLocked] = useState(module.locked);

  const isGenerated = module.source === 'Generated';
  const hasWarning = module.status === 'warning';
  const needsReview = module.status === 'review';

  return (
    <div
      className={`group relative bg-plain-white rounded border transition-shadow hover:shadow-md ${
        isGenerated ? 'border-l-2 border-l-emphasis-purple border-t border-r border-b border-base-pure' : 'border-base-pure'
      } ${hasWarning ? 'ring-1 ring-signal-warning/40' : ''}`}
    >
      {/* Status indicators */}
      {hasWarning && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-signal-warning-light text-signal-warning text-xs rounded-t border-b border-signal-warning/20">
          <AlertTriangle className="h-3 w-3" />
          {module.statusMessage}
        </div>
      )}
      {needsReview && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-signal-info-light text-signal-info text-xs rounded-t border-b border-signal-info/20">
          <Eye className="h-3 w-3" />
          {module.statusMessage}
        </div>
      )}

      <div className="p-3 space-y-2">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-mono text-base-muted shrink-0">M{index + 1}</span>
            <h4 className="text-sm font-medium text-base-text truncate">{module.title}</h4>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${proficiencyColors[module.proficiency]}`}>
              {module.proficiency}
            </span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${sourceColors[module.source]}`}>
              {module.source}
              {isGenerated && <Info className="inline h-2.5 w-2.5 ml-0.5" />}
            </span>
          </div>
        </div>

        {/* Middle */}
        <p className="text-xs text-base-muted leading-relaxed">{module.description}</p>
        <div className="flex items-center gap-3 text-xs text-base-muted">
          <span>⏱ {module.duration}</span>
          <span>📋 {module.modality}</span>
          {module.confidence && (
            <span className={`font-medium ${
              module.confidence >= 90 ? 'text-signal-success' : module.confidence >= 80 ? 'text-signal-warning' : 'text-signal-error'
            }`}>
              {module.confidence}% confidence
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {module.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-base-major text-base-muted border border-base-pure">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-base-major">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLocked(!locked)}
              className="p-1 rounded hover:bg-base-major text-base-muted transition-colors"
              title={locked ? 'Unlock' : 'Lock'}
            >
              {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>
            <button className="p-1 rounded hover:bg-base-major text-base-muted transition-colors" title="Replace">
              <Replace className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-signal-error-light text-base-muted hover:text-signal-error transition-colors" title="Remove">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-accent-major hover:text-accent-hover transition-colors"
          >
            {expanded ? 'Collapse' : 'Details'}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Expanded */}
        {expanded && (
          <div className="pt-2 space-y-3 border-t border-base-major animate-accordion-down">
            <div>
              <h5 className="text-[10px] font-semibold uppercase tracking-wider text-base-muted mb-1">Table of Contents</h5>
              <ul className="space-y-0.5">
                {module.toc.map((item, i) => (
                  <li key={i} className="text-xs text-base-muted pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-base-pure">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-semibold uppercase tracking-wider text-base-muted mb-1">Learning Outcomes</h5>
              <ul className="space-y-0.5">
                {module.outcomes.map((o, i) => (
                  <li key={i} className="text-xs text-base-muted pl-3 relative before:content-['✓'] before:absolute before:left-0 before:text-signal-success before:text-[10px]">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            {module.prerequisites.length > 0 && (
              <div>
                <h5 className="text-[10px] font-semibold uppercase tracking-wider text-base-muted mb-1">Prerequisites</h5>
                <p className="text-xs text-base-muted">{module.prerequisites.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
