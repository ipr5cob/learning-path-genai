import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import Header from '@/components/learning-path/Header';
import LeftPanel from '@/components/learning-path/LeftPanel';
import ChatPanel from '@/components/learning-path/ChatPanel';
import type { Message, SavedPath } from '@/components/learning-path/types';

const STORAGE_KEY = 'thub-saved-paths';

const loadSaved = (): SavedPath[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistSaved = (paths: SavedPath[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [savedPaths, setSavedPaths] = useState<SavedPath[]>(loadSaved);

  const handleSave = useCallback(() => {
    if (messages.length === 0) {
      toast.error('Nothing to save — start a conversation first.');
      return;
    }
    const firstUserMsg = messages.find((m) => m.role === 'user');
    const title = firstUserMsg?.content.slice(0, 60) || 'Untitled Path';
    const newPath: SavedPath = {
      id: crypto.randomUUID(),
      title,
      date: new Date().toISOString().split('T')[0],
      messages: [...messages],
    };
    setSavedPaths((prev) => {
      const updated = [newPath, ...prev];
      persistSaved(updated);
      return updated;
    });
    toast.success('Learning path saved!');
  }, [messages]);

  const handleDeletePath = useCallback((id: string) => {
    setSavedPaths((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persistSaved(updated);
      return updated;
    });
  }, []);

  const handleLoadPath = useCallback((id: string) => {
    const path = savedPaths.find((p) => p.id === id);
    if (path) {
      setMessages([...path.messages]);
    }
  }, [savedPaths]);

  return (
    <div className="flex flex-col h-screen bg-base-major">
      <Header onSave={handleSave} hasMessages={messages.length > 0} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[260px] min-w-[240px] border-r border-base-pure">
          <LeftPanel
            savedPaths={savedPaths}
            onDeletePath={handleDeletePath}
            onLoadPath={handleLoadPath}
          />
        </div>
        <div className="flex-1">
          <ChatPanel messages={messages} setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
};

export default Index;
