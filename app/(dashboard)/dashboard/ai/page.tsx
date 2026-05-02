'use client';
// app/(dashboard)/dashboard/ai/page.tsx – AI Career Assistant
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, FileText, TrendingUp, Lightbulb, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

interface Msg { role: 'user' | 'assistant'; content: string; id: string }

const QUICK_PROMPTS = [
  { icon: TrendingUp,  label: 'Career Paths',     prompt: 'Based on my profile, what are the best career paths for me?' },
  { icon: FileText,    label: 'Resume Tips',       prompt: 'Give me specific tips to improve my resume for software engineering roles.' },
  { icon: Lightbulb,   label: 'Skill Gaps',        prompt: 'What skills should I learn next to advance in my career?' },
  { icon: Sparkles,    label: 'Interview Prep',    prompt: 'How should I prepare for technical interviews at top tech companies?' },
];

function ChatBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-navy-700' : 'bg-gradient-to-br from-gold-400 to-gold-500',
      )}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-navy-950" />}
      </div>
      <div className={cn(
        'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
        isUser
          ? 'bg-navy-700 text-white rounded-tr-sm'
          : 'bg-white dark:bg-navy-800 text-navy-900 dark:text-white border border-border rounded-tl-sm',
      )}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className={isUser ? 'text-gold-300' : 'text-navy-900 dark:text-white'}>{part.slice(2, -2)}</strong>
                : part
            )}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function AIPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! 👋 I'm your AI Career Assistant. I'm here to help you with:\n\n**Career guidance** – paths, transitions, goal setting\n**Resume tips** – tailored feedback and improvements\n**Skill development** – what to learn and how\n**Interview prep** – technical and behavioral questions\n\nWhat would you like to explore today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'general' | 'career' | 'resume'>('general');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  async function send(text?: string) {
    const content = text ?? input.trim();
    if (!content || loading) return;
    setInput('');

    const userMsg: Msg = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content, type }),
      });
      const data = await res.json();
      const aiMsg: Msg = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      toast.error('AI service temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: 'Chat cleared! What would you like to explore?',
    }]);
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-navy-950" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-navy-900 dark:text-white">AI Career Assistant</h1>
            <p className="text-xs text-muted-foreground">Powered by Claude · Personalized to your profile</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode selector */}
          <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-xl p-1">
            {([['general', 'General'], ['career', 'Career'], ['resume', 'Resume']] as const).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setType(val)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  type === val ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
                )}
              >
                {lbl}
              </button>
            ))}
          </div>
          <button
            onClick={reset}
            className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700 text-muted-foreground transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0 bg-white dark:bg-navy-800 rounded-2xl border border-border flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-navy-950" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-navy-700 border border-border flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div className="px-5 pb-4 grid grid-cols-2 gap-2">
            {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => send(prompt)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-50 dark:bg-navy-700/50 hover:bg-navy-100 dark:hover:bg-navy-700 text-left transition-colors group"
              >
                <Icon className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="text-sm text-navy-700 dark:text-navy-200 font-medium group-hover:text-navy-900 dark:group-hover:text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 border-t border-border pt-4 flex items-center gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask me anything about your career…"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-2xl bg-navy-50 dark:bg-navy-700 text-sm placeholder:text-muted-foreground text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300 disabled:opacity-50"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950 flex items-center justify-center disabled:opacity-40 hover:from-gold-300 hover:to-gold-400 transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
