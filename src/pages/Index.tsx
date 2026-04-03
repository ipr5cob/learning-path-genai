import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import Header from '@/components/learning-path/Header';
import LeftPanel from '@/components/learning-path/LeftPanel';
import ChatPanel from '@/components/learning-path/ChatPanel';
import SessionExtendDialog from '@/components/learning-path/SessionExtendDialog';
import { useSessionManager } from '@/hooks/useSessionManager';
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

  const handleImportPaths = useCallback((imported: SavedPath[]) => {
    setSavedPaths((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newPaths = imported.filter((p) => !existingIds.has(p.id));
      const updated = [...newPaths, ...prev];
      persistSaved(updated);
      return updated;
    });
  }, []);

  const handleExport = useCallback(() => {
    if (messages.length === 0) {
      toast.error('Nothing to export — start a conversation first.');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Learning Path', margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`Exported on ${new Date().toLocaleDateString()}`, margin, y);
    doc.setTextColor(0);
    y += 10;

    messages.forEach((m) => {
      const isUser = m.role === 'user';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(isUser ? 0 : 59, isUser ? 0 : 130, isUser ? 0 : 246);
      doc.text(isUser ? 'You' : 'Assistant', margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(40);
      const lines = doc.splitTextToSize(m.content, maxWidth);
      for (const line of lines) {
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(line, margin, y);
        y += 4.5;
      }
      y += 6;
    });

    doc.save(`learning-path-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Learning path exported as PDF!');
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-base-major">
      <Header onSave={handleSave} onExport={handleExport} hasMessages={messages.length > 0} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[260px] min-w-[240px] border-r border-base-pure">
          <LeftPanel
            savedPaths={savedPaths}
            onDeletePath={handleDeletePath}
            onLoadPath={handleLoadPath}
            onImportPaths={handleImportPaths}
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
