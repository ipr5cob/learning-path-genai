import Header from '@/components/learning-path/Header';
import LeftPanel from '@/components/learning-path/LeftPanel';
import ChatPanel from '@/components/learning-path/ChatPanel';

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-base-major">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[260px] min-w-[240px] border-r border-base-pure">
          <LeftPanel />
        </div>
        {/* Center Panel - Chat */}
        <div className="flex-1">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
