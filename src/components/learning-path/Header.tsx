import { Download, Share2, Save, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-plain-white border-b border-base-pure px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent-major" />
            <h1 className="text-xl font-semibold text-base-text">T-Hub Learning Path Studio</h1>
          </div>
          <p className="text-sm text-base-muted">AI-powered learning path generation from T-Hub catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs border-base-pure text-base-muted hover:bg-base-minor">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
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
