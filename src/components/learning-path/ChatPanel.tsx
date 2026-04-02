import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Send, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import type { Message } from './types';

const SUGGESTIONS = [
  'Azure DevOps',
  'Kubernetes for Beginners',
  'Machine Learning with Python',
  'Cloud Security Fundamentals',
  'React & TypeScript',
];

interface ChatPanelProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const ChatPanel = ({ messages, setMessages }: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (allMessages: Message[]) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-learning-path`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || `Error ${resp.status}`);
    }

    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant') {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: 'assistant', content: assistantContent }];
            });
          }
        } catch {
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMsg: Message = { role: 'user', content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      await streamChat(updatedMessages);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Error:** ${e.message || 'Failed to generate learning path. Please try again.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <main className="flex-1 h-full flex flex-col bg-base-major">
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent-major" />
              <h2 className="text-lg font-semibold text-base-text">Learning Path Generator</h2>
            </div>
            <p className="text-sm text-base-muted text-center max-w-md">
              Enter a topic to generate an AI-powered, structured learning path.
              The AI will create a progressive curriculum from beginner to advanced.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-accent-pure text-accent-major bg-accent-minor hover:bg-accent-pure/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-accent-major text-plain-white'
                    : 'bg-plain-white border border-base-pure text-base-text'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-headings:text-base-text prose-p:text-base-muted prose-li:text-base-muted prose-strong:text-base-text prose-code:text-accent-major prose-code:bg-accent-minor prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-plain-white border border-base-pure rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-base-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent-major" />
              Generating learning path...
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-base-pure bg-plain-white p-3">
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="shrink-0 text-xs border-base-pure text-base-muted hover:bg-base-minor"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
          <div className="flex-1 flex items-center gap-2 bg-base-major rounded-lg border border-base-pure px-3 py-2 focus-within:border-accent-major transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a topic (e.g., Azure DevOps, Kubernetes, React)..."
              className="flex-1 bg-transparent text-sm text-base-text placeholder:text-base-muted outline-none"
              disabled={isLoading}
            />
            <Button
              size="sm"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-7 w-7 p-0 bg-accent-major text-plain-white hover:bg-accent-hover disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatPanel;
