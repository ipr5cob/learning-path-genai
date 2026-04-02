import { useState } from 'react';
import { explainabilityData } from './data';
import { AlertTriangle, BookOpen, Brain, Search, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'about' | 'tips' | 'examples';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'about', label: 'About', icon: <Info className="h-3 w-3" /> },
  { id: 'tips', label: 'Tips', icon: <Brain className="h-3 w-3" /> },
  { id: 'examples', label: 'Examples', icon: <BookOpen className="h-3 w-3" /> },
];

const RightPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('about');

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
        {activeTab === 'about' && (
          <>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-accent-pure">How It Works</h3>
              <p className="text-xs text-contrast-muted leading-relaxed">
                Type any topic into the chat and the AI will generate a structured learning path from Beginner to Advanced level.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-accent-pure">What You Get</h3>
              <ul className="space-y-1.5 text-xs text-contrast-muted">
                <li className="flex items-start gap-2">
                  <span className="text-signal-success mt-0.5">✓</span>
                  Structured modules from beginner to advanced
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal-success mt-0.5">✓</span>
                  Duration estimates and modality suggestions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal-success mt-0.5">✓</span>
                  Gap analysis and recommendations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal-success mt-0.5">✓</span>
                  AI reasoning and confidence scores
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal-success mt-0.5">✓</span>
                  Follow-up refinement via conversation
                </li>
              </ul>
            </div>
            <div className="p-3 rounded bg-contrast-secondary border border-contrast-secondary space-y-2">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-contrast-muted">Conversational</h4>
              <p className="text-xs text-contrast-muted leading-relaxed">
                After generating a path, ask follow-up questions like "Add more advanced modules" or "Focus on hands-on labs" to refine it.
              </p>
            </div>
          </>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-accent-pure">Query Tips</h3>
            {[
              { tip: 'Be specific', example: '"Azure DevOps for backend engineers" instead of just "DevOps"' },
              { tip: 'Set constraints', example: '"Create a 10-hour path for beginners in Kubernetes"' },
              { tip: 'Specify audience', example: '"Machine Learning path for product managers"' },
              { tip: 'Request focus', example: '"Deep dive into CI/CD pipelines only"' },
              { tip: 'Iterate', example: '"Remove Module 3 and add more on testing"' },
            ].map((t, i) => (
              <div key={i} className="p-3 rounded bg-contrast-secondary border border-contrast-secondary space-y-1">
                <span className="text-xs font-medium text-contrast-text">{t.tip}</span>
                <p className="text-[10px] text-contrast-muted italic">"{t.example}"</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-accent-pure">Example Queries</h3>
            {[
              'Create a learning path for Azure DevOps targeting advanced engineers',
              'Build a 15-hour Kubernetes fundamentals curriculum',
              'Design a data engineering path covering Spark, Airflow, and dbt',
              'Generate a cybersecurity awareness path for non-technical staff',
              'Create a React & TypeScript learning path with hands-on projects',
            ].map((q, i) => (
              <div key={i} className="p-2.5 rounded bg-contrast-secondary border border-contrast-secondary">
                <p className="text-xs text-contrast-muted">{q}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;
