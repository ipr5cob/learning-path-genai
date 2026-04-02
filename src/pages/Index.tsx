import Header from '@/components/learning-path/Header';
import LeftPanel from '@/components/learning-path/LeftPanel';
import CenterPanel from '@/components/learning-path/CenterPanel';
import RightPanel from '@/components/learning-path/RightPanel';

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-base-major">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - 20% */}
        <div className="w-[20%] min-w-[240px] border-r border-base-pure">
          <LeftPanel />
        </div>
        {/* Center Panel - 55% */}
        <div className="flex-1">
          <CenterPanel />
        </div>
        {/* Right Panel - 25% */}
        <div className="w-[25%] min-w-[280px] border-l border-base-pure">
          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
