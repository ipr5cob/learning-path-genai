import { Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import thubLogo from '@/assets/thub-logo.png';

interface HeaderProps {
  onSave: () => void;
  hasMessages: boolean;
}

const Header = ({ onSave, hasMessages }: HeaderProps) => {
  return (
    <header className="bg-plain-white border-b border-base-pure px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={thubLogo} alt="T-Hub" className="h-8 object-contain" />
          <div>
            <h1 className="text-lg font-semibold text-base-text">Learning Path Studio</h1>
            <p className="text-xs text-base-muted">AI-powered learning path generation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={!hasMessages}
            className="text-xs border-base-pure text-base-muted hover:bg-base-minor disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
          <Button size="sm" className="text-xs bg-accent-major text-plain-white hover:bg-accent-hover">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
