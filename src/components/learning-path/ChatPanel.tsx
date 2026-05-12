import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Send, Loader2, Sparkles, RotateCcw, Bot, User } from 'lucide-react';
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

  const sendChat = async (allMessages: Message[]) => {
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

    const data = await resp.json();
    const content = data.content || 'No response received.';

    setMessages((prev) => [...prev, { role: 'assistant', content }]);
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
      await sendChat(updatedMessages);
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
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-xl bg-accent-minor flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent-major" />
              </div>
              <h2 className="text-lg font-semibold text-base-text tracking-tight">
                Learning Path Generator
              </h2>
              <p className="text-sm text-base-muted max-w-md leading-relaxed">
                Enter a topic to generate a structured, AI-powered learning path
                with progressive modules from beginner to advanced.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-xs px-4 py-2 rounded-lg border border-accent-pure/40 text-accent-major bg-plain-white hover:bg-accent-minor hover:border-accent-pure transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="shrink-0 mt-1">
                  <div className="w-7 h-7 rounded-lg bg-emphasis-purple-light flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-emphasis-purple" />
                  </div>
                </div>
              )}
              <div
                className={`rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-accent-major text-plain-white px-4 py-2.5 max-w-[70%]'
                    : 'bg-plain-white border border-base-pure/40 shadow-sm px-5 py-4 max-w-[88%]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="ai-prose">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="shrink-0 mt-1">
                  <div className="w-7 h-7 rounded-lg bg-accent-major/10 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-accent-major" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3 justify-start">
            <div className="shrink-0 mt-1">
              <div className="w-7 h-7 rounded-lg bg-emphasis-purple-light flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-emphasis-purple" />
              </div>
            </div>
            <div className="bg-plain-white border border-base-pure/40 shadow-sm rounded-xl px-5 py-4 flex items-center gap-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-accent-major" />
              <span className="text-xs text-base-muted">Generating learning path…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-base-pure/40 bg-plain-white px-6 py-4">
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="shrink-0 h-9 w-9 p-0 border-base-pure/40 text-base-muted hover:bg-base-major hover:text-base-text transition-all rounded-lg"
              title="New conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
          <div className="flex-1 flex items-center gap-2 bg-base-major/60 rounded-xl border border-base-pure/40 px-4 py-2.5 focus-within:border-accent-major focus-within:bg-plain-white focus-within:shadow-sm transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a topic (e.g., Azure DevOps, Kubernetes, React)…"
              className="flex-1 bg-transparent text-sm text-base-text placeholder:text-base-muted/60 outline-none"
              disabled={isLoading}
            />
            <Button
              size="sm"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 p-0 bg-accent-major text-plain-white hover:bg-accent-hover disabled:opacity-30 transition-all rounded-lg"
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
