import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Trash2 } from 'lucide-react';
import type { SavedPath } from './types';

interface LeftPanelProps {
  savedPaths: SavedPath[];
  onDeletePath: (id: string) => void;
  onLoadPath: (id: string) => void;
}

const LeftPanel = ({ savedPaths, onDeletePath, onLoadPath }: LeftPanelProps) => {
  const [maxDuration, setMaxDuration] = useState([20]);
  const [modality, setModality] = useState('Self-paced');
  const [language, setLanguage] = useState('English');
  const [internalFirst, setInternalFirst] = useState(true);
  const [allowExternal, setAllowExternal] = useState(false);
  const [approvedOnly, setApprovedOnly] = useState(true);
  const [pathStrategy, setPathStrategy] = useState('balanced');

  return (
    <aside className="w-full h-full bg-base-minor overflow-y-auto custom-scrollbar p-4 space-y-4">
      {/* Saved Learning Paths */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-base-muted mb-3">Saved Learning Paths</h2>
        <div className="space-y-2">
          {savedPaths.length === 0 ? (
            <div className="bg-plain-white rounded border border-base-pure p-3 text-center">
              <BookOpen className="h-5 w-5 text-base-pure mx-auto mb-1.5" />
              <p className="text-xs text-base-muted">No saved paths yet</p>
            </div>
          ) : (
            savedPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => onLoadPath(path.id)}
                className="w-full text-left bg-plain-white rounded border border-base-pure p-2.5 hover:border-accent-pure transition-colors group"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-medium text-base-text leading-tight">{path.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePath(path.id);
                    }}
                    className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-signal-error-light text-base-muted hover:text-signal-error transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-base-muted">
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {path.date}
                  </span>
                  <span>{path.messages.length} messages</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-base-pure" />
      <h2 className="text-xs font-semibold uppercase tracking-wider text-base-muted">Controls & Constraints</h2>

      {/* Constraints */}
      <div className="bg-plain-white rounded border border-base-pure p-3 space-y-3">
        <h3 className="text-xs font-semibold text-base-text">Constraints</h3>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label className="text-xs text-base-muted">Max Duration</Label>
            <span className="text-xs font-medium text-base-text">{maxDuration[0]}h</span>
          </div>
          <Slider value={maxDuration} onValueChange={setMaxDuration} max={40} min={4} step={1} className="w-full" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-base-muted">Modality</Label>
          <div className="flex gap-1">
            {['Self-paced', 'ILT', 'Virtual'].map((m) => (
              <button
                key={m}
                onClick={() => setModality(m)}
                className={`flex-1 text-xs py-1.5 rounded-sm border transition-colors ${
                  modality === m
                    ? 'bg-accent-major text-plain-white border-accent-major'
                    : 'bg-plain-white text-base-muted border-base-pure hover:bg-base-major'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-base-muted">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Controls */}
      <div className="bg-plain-white rounded border border-base-pure p-3 space-y-3">
        <h3 className="text-xs font-semibold text-base-text">AI Controls</h3>
        {[
          { label: 'Internal-first', value: internalFirst, setter: setInternalFirst },
          { label: 'Allow external augmentation', value: allowExternal, setter: setAllowExternal },
          { label: 'Show only approved modules', value: approvedOnly, setter: setApprovedOnly },
        ].map(({ label, value, setter }) => (
          <div key={label} className="flex items-center justify-between">
            <Label className="text-xs text-base-muted">{label}</Label>
            <Switch checked={value} onCheckedChange={setter} />
          </div>
        ))}
      </div>

      {/* Path Strategy */}
      <div className="bg-plain-white rounded border border-base-pure p-3 space-y-3">
        <h3 className="text-xs font-semibold text-base-text">Path Strategy</h3>
        {[
          { value: 'fastest', label: 'Fastest path' },
          { value: 'balanced', label: 'Balanced path' },
          { value: 'comprehensive', label: 'Comprehensive path' },
        ].map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="strategy"
              value={value}
              checked={pathStrategy === value}
              onChange={() => setPathStrategy(value)}
              className="h-3.5 w-3.5 accent-accent-major"
            />
            <span className={`text-xs ${pathStrategy === value ? 'text-base-text font-medium' : 'text-base-muted'}`}>
              {label}
              {value === 'balanced' && <span className="ml-1 text-accent-major">(default)</span>}
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default LeftPanel;
