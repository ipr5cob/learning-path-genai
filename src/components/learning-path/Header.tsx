import { Download, Share2, Save, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-plain-white border-b border-base-pure px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-base-text">Azure DevOps</h1>
            <span className="inline-flex items-center gap-1 rounded-sm bg-accent-minor px-2 py-0.5 text-xs font-medium text-accent-major">
              <Shield className="h-3 w-3" />
              Confidence: High
            </span>
          </div>
          <p className="text-sm text-base-muted">AI-generated learning path using T-Hub catalog</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-base-muted">
            <span>Target: <strong className="text-base-text">Advanced</strong></span>
            <span className="text-base-pure">|</span>
            <span>Duration: <strong className="text-base-text">18 hours</strong></span>
            <span className="text-base-pure">|</span>
            <span>Modules: <strong className="text-base-text">7</strong></span>
            <span className="text-base-pure">|</span>
            <span>Request ID: <span className="font-mono text-base-text">LP-2026-001</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs border-base-pure text-base-muted hover:bg-base-minor">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Regenerate Path
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-base-pure text-base-muted hover:bg-base-minor">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Version
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-base-pure text-base-muted hover:bg-base-minor">
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Share
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
