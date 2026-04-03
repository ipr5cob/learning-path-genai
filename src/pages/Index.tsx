import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import Header from '@/components/learning-path/Header';
import LeftPanel from '@/components/learning-path/LeftPanel';
import ChatPanel from '@/components/learning-path/ChatPanel';
import SessionExtendDialog from '@/components/learning-path/SessionExtendDialog';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useSavedPaths } from '@/hooks/useSavedPaths';
import type { Message } from '@/components/learning-path/types';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { savedPaths, loading, savePath, deletePath, loadPath, importPaths } = useSavedPaths();
  const { showExtendPrompt, extendSession, logout } = useSessionManager();

  const handleSave = useCallback(() => {
    savePath(messages);
  }, [messages, savePath]);

  const handleLoadPath = useCallback((id: string) => {
    const loaded = loadPath(id);
    if (loaded) setMessages(loaded);
  }, [loadPath]);

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
            loading={loading}
            onDeletePath={deletePath}
            onLoadPath={handleLoadPath}
            onImportPaths={importPaths}
          />
        </div>
        <div className="flex-1">
          <ChatPanel messages={messages} setMessages={setMessages} />
        </div>
      </div>
      <SessionExtendDialog open={showExtendPrompt} onExtend={extendSession} onLogout={logout} />
    </div>
  );
};

export default Index;
