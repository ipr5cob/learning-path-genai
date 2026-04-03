import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Clock, Trash2, FolderOpen, Upload, Download, Loader2 } from 'lucide-react';
import type { SavedPath } from './types';

interface LeftPanelProps {
  savedPaths: SavedPath[];
  loading?: boolean;
  onDeletePath: (id: string) => void;
  onLoadPath: (id: string) => void;
  onImportPaths: (paths: SavedPath[]) => void;
}

const LeftPanel = ({ savedPaths, loading, onDeletePath, onLoadPath, onImportPaths }: LeftPanelProps) => {
  const [internalFirst, setInternalFirst] = useState(true);
  const [allowExternal, setAllowExternal] = useState(false);
  const [approvedOnly, setApprovedOnly] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportAll = () => {
    if (savedPaths.length === 0) {
      toast.error('No saved paths to export.');
      return;
    }
    const blob = new Blob([JSON.stringify(savedPaths, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-paths-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${savedPaths.length} path(s).`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (!Array.isArray(data) || !data.every((p: any) => p.id && p.title && p.messages)) {
          toast.error('Invalid backup file format.');
          return;
        }
        onImportPaths(data as SavedPath[]);
        toast.success(`Imported ${data.length} path(s).`);
      } catch {
        toast.error('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <aside className="w-full h-full bg-base-minor/50 overflow-y-auto custom-scrollbar p-4 space-y-5">
      {/* Saved Learning Paths */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <FolderOpen className="h-3 w-3 text-base-muted" />
            <h2 className="panel-title">Saved Paths</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import paths"
              className="p-1.5 rounded-md text-base-muted hover:text-accent-major hover:bg-accent-minor/50 transition-all"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleExportAll}
              title="Export all paths"
              className="p-1.5 rounded-md text-base-muted hover:text-accent-major hover:bg-accent-minor/50 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        </div>
        <div className="space-y-1.5">
          {loading ? (
            <div className="panel-card text-center py-5">
              <Loader2 className="h-5 w-5 text-accent-major mx-auto mb-2 animate-spin" />
              <p className="text-xs text-base-muted">Loading saved paths…</p>
            </div>
          ) : savedPaths.length === 0 ? (
            <div className="panel-card text-center py-5">
              <BookOpen className="h-5 w-5 text-base-pure mx-auto mb-2" />
              <p className="text-xs text-base-muted">No saved paths yet</p>
              <p className="text-[10px] text-base-pure mt-0.5">Generate and save a learning path</p>
            </div>
          ) : (
            savedPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => onLoadPath(path.id)}
                className="w-full text-left bg-plain-white rounded-lg border border-base-pure/40 p-3 hover:border-accent-pure hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-base-text leading-snug">{path.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePath(path.id);
                    }}
                    className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-signal-error-light text-base-muted hover:text-signal-error transition-all shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-base-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {path.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-base-pure" />
                    {path.messages.length} messages
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-base-pure/40" />

      {/* AI Controls */}
      <div>
        <h2 className="panel-title mb-3">AI Controls</h2>
        <div className="panel-card space-y-3.5">
          {[
            { label: 'Internal-first', desc: 'Prefer internal catalog', value: internalFirst, setter: setInternalFirst },
            { label: 'External augmentation', desc: 'Allow external sources', value: allowExternal, setter: setAllowExternal },
            { label: 'Approved only', desc: 'Show reviewed modules', value: approvedOnly, setter: setApprovedOnly },
          ].map(({ label, desc, value, setter }) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-xs font-medium text-base-text block">{label}</Label>
                <span className="text-[10px] text-base-muted">{desc}</span>
              </div>
              <Switch checked={value} onCheckedChange={setter} />
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default LeftPanel;
