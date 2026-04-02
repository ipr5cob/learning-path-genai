import { Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import thubLogo from '@/assets/thub-logo.png';

interface HeaderProps {
  onSave: () => void;
  hasMessages: boolean;
}

const Header = ({ onSave, hasMessages }: HeaderProps) => {
  return (
    <header className="bg-plain-white border-b border-base-pure/60 px-6 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img src={thubLogo} alt="T-Hub" className="h-7 object-contain" />
          <div className="border-l border-base-pure/60 pl-3.5">
            <h1 className="text-sm font-semibold text-base-text tracking-tight">Learning Path Studio</h1>
            <p className="text-[10px] text-base-muted mt-0.5">AI-powered learning path generation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={!hasMessages}
            className="h-8 text-xs border-base-pure/60 text-base-muted hover:bg-base-major hover:text-base-text disabled:opacity-30 transition-all"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
          <Button size="sm" className="h-8 text-xs bg-accent-major text-plain-white hover:bg-accent-hover transition-all">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
