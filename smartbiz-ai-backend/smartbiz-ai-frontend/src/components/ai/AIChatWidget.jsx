import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import AIChatMessage from './AIChatMessage';
import { aiApi } from '../../api/aiApi';

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask me anything about your business.' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, sending]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const question = input;
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setSending(true);
    try {
      const res = await aiApi.chat(question);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't process that. Try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-3 w-80 h-96 bg-white rounded-2xl border border-slate-100 shadow-soft flex flex-col overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-3 bg-brand-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">SmartBiz assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <AIChatMessage key={i} role={m.role} content={m.content} />
            ))}
            {sending && <AIChatMessage role="assistant" isTyping />}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="p-2.5 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="input-field flex-1 !py-2 text-sm"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-soft transition-transform hover:scale-105"
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </button>
    </div>
  );
}
