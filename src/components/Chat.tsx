import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OPENAI_API_KEY, SYSTEM_PROMPT } from '../config';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hallo! Ich bin dein KI-Mathe-Tutor. Wie kann ich dir heute helfen? Du kannst mir Fragen zu Algebra, Geometrie oder Analysis stellen.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMockResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('pythagoras')) return 'Der Satz des Pythagoras lautet a² + b² = c². Er gilt in rechtwinkligen Dreiecken, wobei c die Hypotenuse ist.';
    if (q.includes('pq-formel')) return 'Die pq-Formel nutzt du für x² + px + q = 0. Die Formel ist: x₁,₂ = -(p/2) ± √((p/2)² - q).';
    return 'Das ist ein spannendes Thema! Nenne mir bitte eine konkrete Aufgabe, damit ich dir den Rechenweg zeigen kann.';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-12 h-[calc(100vh-40px)] flex flex-col relative">
      {/* Background Glow */}
      <div className="bg-glow w-[400px] h-[400px] bg-violet-500 -top-24 -left-24 opacity-10" />

      <div className="glass-card flex-grow flex flex-col overflow-hidden p-0 border-white/10">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-violet-500/20">
              <Bot className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">KI-Mathe-Tutor</h2>
              <div className="flex items-center text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                Online & Bereit
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-3 text-slate-400 hover:text-pink-500 hover:bg-white/5 rounded-xl transition-all"
            title="Chat leeren"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    msg.sender === 'user' ? 'bg-white/10' : 'bg-violet-500/20'
                  }`}>
                    {msg.sender === 'user' ? <User size={20} className="text-slate-300" /> : <Sparkles size={20} className="text-violet-400" />}
                  </div>
                  <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-xl ${
                    msg.sender === 'user' 
                      ? 'bg-violet-500 text-white rounded-tr-none' 
                      : 'glass border-white/5 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex justify-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Sparkles size={20} className="text-violet-400" />
              </div>
              <div className="glass p-5 rounded-3xl rounded-tl-none flex space-x-2">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-white/5">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Frag mich etwas... (z.B. 'Wie funktioniert der Satz des Pythagoras?')"
              className="w-full pl-6 pr-16 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all group-hover:border-white/20"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-violet-500 text-white rounded-xl hover:bg-violet-400 disabled:opacity-50 disabled:hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <AlertCircle size={12} />
            KI kann Fehler machen. Überprüfe wichtige Informationen.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;