import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AIChatMessage from '../components/ai/AIChatMessage';
import AIQuickActions from '../components/ai/AIQuickActions';
import { aiApi } from '../api/aiApi';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! I'm your SmartBiz AI assistant. I know your real business data — ask me about stock, sales, customers, or what to do next.",
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const sendMessage = async (text) => {
    const question = text || input;
    if (!question.trim() || sending) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setSending(true);

    try {
      const res = await aiApi.chat(question);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry, I couldn't process that right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <DashboardLayout title="AI assistant" subtitle="Ask anything about your business">
      <div className="card flex flex-col h-[calc(100vh-140px)]">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">SmartBiz assistant</p>
            <p className="text-xs text-slate-400">Powered by your live business data</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((m, i) => (
            <AIChatMessage key={i} role={m.role} content={m.content} />
          ))}
          {sending && <AIChatMessage role="assistant" isTyping />}
          <div ref={bottomRef} />
        </div>

        <div className="px-5 py-4 border-t border-slate-100 space-y-3">
          <AIQuickActions onSelect={sendMessage} disabled={sending} />
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sales, stock, customers..."
              className="input-field flex-1"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
