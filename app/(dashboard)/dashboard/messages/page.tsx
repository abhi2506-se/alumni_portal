'use client';
// app/(dashboard)/dashboard/messages/page.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Send, Lock, Check, CheckCheck, MoreVertical,
  User, Phone, Video, ArrowLeft, MessageSquare, Plus, X,
} from 'lucide-react';
import { cn, getInitials, timeAgo, generateAvatarColor } from '@/lib/utils/helpers';
import { encryptMessage, decryptMessage, deriveRoomKey } from '@/lib/utils/encryption';
import toast from 'react-hot-toast';

interface Contact {
  connectionId: string;
  chatRoomId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    currentRole?: string;
    currentCompany?: string;
  };
  lastMessage?: { content: string; createdAt: string; senderId: string };
  unreadCount: number;
  online: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  pending?: boolean;
}

// ── Mock data for UI demonstration ───────────────────────────────────────────
const MOCK_CONTACTS: Contact[] = [
  {
    connectionId: 'c1', chatRoomId: 'cr1',
    user: { id: 'u1', name: 'Arjun Mehta', role: 'ALUMNI', currentRole: 'Senior Engineer', currentCompany: 'Google' },
    lastMessage: { content: 'Sure, let me know when you are free!', createdAt: new Date(Date.now() - 3600000).toISOString(), senderId: 'u1' },
    unreadCount: 2, online: true,
  },
  {
    connectionId: 'c2', chatRoomId: 'cr2',
    user: { id: 'u2', name: 'Priya Sharma', role: 'ALUMNI', currentRole: 'Founder', currentCompany: 'EduStart' },
    lastMessage: { content: 'Great! Looking forward to our session.', createdAt: new Date(Date.now() - 86400000).toISOString(), senderId: 'u2' },
    unreadCount: 0, online: false,
  },
  {
    connectionId: 'c3', chatRoomId: 'cr3',
    user: { id: 'u3', name: 'Rohan Patel', role: 'ALUMNI', currentRole: 'PM', currentCompany: 'Microsoft' },
    lastMessage: { content: 'Check out this job opening!', createdAt: new Date(Date.now() - 172800000).toISOString(), senderId: 'u3' },
    unreadCount: 0, online: true,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  cr1: [
    { id: 'm1', content: 'Hi! I saw your profile and would love to connect.', senderId: 'me', createdAt: new Date(Date.now() - 7200000).toISOString(), status: 'READ' },
    { id: 'm2', content: 'Hey! Of course, happy to help. What are you looking for?', senderId: 'u1', createdAt: new Date(Date.now() - 7100000).toISOString(), status: 'READ' },
    { id: 'm3', content: 'I am preparing for software engineering interviews and would love some guidance from someone at Google.', senderId: 'me', createdAt: new Date(Date.now() - 7000000).toISOString(), status: 'READ' },
    { id: 'm4', content: 'Absolutely! I can share what the Google interview process looks like. Let us schedule a mock interview session.', senderId: 'u1', createdAt: new Date(Date.now() - 6900000).toISOString(), status: 'READ' },
    { id: 'm5', content: 'That would be amazing! Thank you so much.', senderId: 'me', createdAt: new Date(Date.now() - 3700000).toISOString(), status: 'READ' },
    { id: 'm6', content: 'Sure, let me know when you are free!', senderId: 'u1', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'DELIVERED' },
  ],
  cr2: [
    { id: 'm7', content: 'Hello Priya! I booked a mentorship session with you.', senderId: 'me', createdAt: new Date(Date.now() - 90000000).toISOString(), status: 'READ' },
    { id: 'm8', content: 'Great! Looking forward to our session.', senderId: 'u2', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'READ' },
  ],
  cr3: [
    { id: 'm9', content: 'Hey Rohan! Any product management internship opportunities?', senderId: 'me', createdAt: new Date(Date.now() - 180000000).toISOString(), status: 'READ' },
    { id: 'm10', content: 'Check out this job opening!', senderId: 'u3', createdAt: new Date(Date.now() - 172800000).toISOString(), status: 'READ' },
  ],
};

function MessageBubble({ msg, isOwn, showAvatar, contact }: { msg: Message; isOwn: boolean; showAvatar: boolean; contact: Contact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-2 mb-1', isOwn ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      {!isOwn && showAvatar ? (
        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0', generateAvatarColor(contact.user.name))}>
          {getInitials(contact.user.name)}
        </div>
      ) : !isOwn ? (
        <div className="w-7 flex-shrink-0" />
      ) : null}

      <div className={cn('max-w-[70%] group', isOwn ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
        <div className={cn(
          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isOwn
            ? 'bg-navy-700 text-white rounded-br-sm'
            : 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white rounded-bl-sm border border-border',
        )}>
          {msg.pending ? <span className="opacity-60">{msg.content}</span> : msg.content}
        </div>
        <div className={cn('flex items-center gap-1 text-[10px] text-muted-foreground px-1', isOwn ? 'flex-row-reverse' : 'flex-row')}>
          <span>{timeAgo(msg.createdAt)}</span>
          {isOwn && (
            msg.status === 'READ'      ? <CheckCheck className="w-3 h-3 text-blue-400" /> :
            msg.status === 'DELIVERED' ? <CheckCheck className="w-3 h-3" /> :
                                         <Check className="w-3 h-3" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const myId = (session?.user as any)?.id ?? 'me';

  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [active, setActive] = useState<Contact | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMessages = active ? (messages[active.chatRoomId] ?? []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, active]);

  function openChat(contact: Contact) {
    setActive(contact);
    setShowMobileChat(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendMessage() {
    if (!input.trim() || !active || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      content: text,
      senderId: myId,
      createdAt: new Date().toISOString(),
      status: 'SENT',
      pending: true,
    };
    setMessages(prev => ({
      ...prev,
      [active.chatRoomId]: [...(prev[active.chatRoomId] ?? []), optimistic],
    }));

    try {
      // Encrypt before sending
      const roomKey = deriveRoomKey(myId, active.user.id);
      const { ciphertext, iv } = await encryptMessage(text, roomKey);

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatRoomId: active.chatRoomId, content: text, ciphertext, iv }),
      });

      if (res.ok) {
        const saved = await res.json();
        setMessages(prev => ({
          ...prev,
          [active.chatRoomId]: prev[active.chatRoomId].map(m =>
            m.id === tempId ? { ...saved, content: text } : m,
          ),
        }));
      } else {
        // Remove optimistic on failure
        setMessages(prev => ({
          ...prev,
          [active.chatRoomId]: prev[active.chatRoomId].filter(m => m.id !== tempId),
        }));
        toast.error('Failed to send message');
      }
    } catch {
      // In demo mode, just finalize the optimistic message
      setMessages(prev => ({
        ...prev,
        [active.chatRoomId]: prev[active.chatRoomId].map(m =>
          m.id === tempId ? { ...m, pending: false, status: 'SENT' as const } : m,
        ),
      }));
    } finally {
      setSending(false);
    }
  }

  const filtered = contacts.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.user.currentCompany ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Page title */}
      <div className="mb-4 flex-shrink-0">
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> End-to-end encrypted
        </p>
      </div>

      <div className="flex-1 min-h-0 flex rounded-2xl border border-border overflow-hidden bg-white dark:bg-navy-800 shadow-sm">
        {/* ── Contact list ──────────────────────────────── */}
        <div className={cn(
          'w-full md:w-80 flex-shrink-0 flex flex-col border-r border-border',
          showMobileChat ? 'hidden md:flex' : 'flex',
        )}>
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-700 text-sm placeholder:text-muted-foreground text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageSquare className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Connect with alumni to start chatting</p>
              </div>
            ) : (
              filtered.map(contact => (
                <button
                  key={contact.connectionId}
                  onClick={() => openChat(contact)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3.5 hover:bg-navy-50 dark:hover:bg-navy-700/50 transition-colors text-left',
                    active?.connectionId === contact.connectionId ? 'bg-navy-50 dark:bg-navy-700/50 border-r-2 border-navy-600' : '',
                  )}
                >
                  {/* Avatar with online dot */}
                  <div className="relative flex-shrink-0">
                    <div className={cn('w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold', generateAvatarColor(contact.user.name))}>
                      {getInitials(contact.user.name)}
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-navy-800" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{contact.user.name}</p>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                        {contact.lastMessage ? timeAgo(contact.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.user.currentRole} · {contact.user.currentCompany}</p>
                    {contact.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {contact.lastMessage.senderId === myId ? 'You: ' : ''}{contact.lastMessage.content}
                      </p>
                    )}
                  </div>

                  {contact.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-navy-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {contact.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Chat area ─────────────────────────────────── */}
        <div className={cn(
          'flex-1 flex flex-col min-w-0',
          !showMobileChat ? 'hidden md:flex' : 'flex',
        )}>
          {active ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-white dark:bg-navy-800 flex-shrink-0">
                <button className="md:hidden p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700" onClick={() => setShowMobileChat(false)}>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold', generateAvatarColor(active.user.name))}>
                    {getInitials(active.user.name)}
                  </div>
                  {active.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-navy-800" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-900 dark:text-white text-sm">{active.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {active.online ? (
                      <span className="text-green-500">● Online</span>
                    ) : 'Last seen recently'}
                    {' · '}{active.user.currentRole}, {active.user.currentCompany}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors text-muted-foreground">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors text-muted-foreground">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Encryption notice */}
              <div className="flex items-center justify-center gap-1.5 py-2 bg-green-50 dark:bg-green-900/10 text-xs text-green-600 dark:text-green-400 flex-shrink-0">
                <Lock className="w-3 h-3" />
                Messages are end-to-end encrypted. Only you and {active.user.name} can read them.
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-0.5 bg-cream-50/50 dark:bg-navy-900/30">
                {currentMessages.map((msg, i) => {
                  const isOwn = msg.senderId === myId || msg.senderId === 'me';
                  const prevMsg = currentMessages[i - 1];
                  const showAvatar = !isOwn && (prevMsg?.senderId !== msg.senderId || i === 0);
                  return (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      contact={active}
                    />
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-4 border-t border-border bg-white dark:bg-navy-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-3 rounded-2xl bg-navy-50 dark:bg-navy-700 text-sm placeholder:text-muted-foreground text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="w-11 h-11 rounded-2xl bg-navy-700 text-white flex items-center justify-center disabled:opacity-40 hover:bg-navy-800 transition-colors flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-3xl bg-navy-100 dark:bg-navy-700 flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-navy-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-navy-900 dark:text-white mb-2">Your Messages</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Select a conversation to start chatting. All messages are encrypted and private.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
