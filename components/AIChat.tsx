import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MapPin, ThumbsUp, ThumbsDown } from 'lucide-react';
import { getShoppingRecommendations } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ProductCard } from './ProductCard';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your personal shopping assistant. I can help you find products or even stores nearby. What do you need today?"
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { text, products, groundingLinks } = await getShoppingRecommendations(userMessage.text);
      
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text,
        relatedProducts: products.length > 0 ? products : undefined,
        groundingLinks: groundingLinks
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
            // Toggle logic: if clicking the same type, clear it. If different, switch it.
            return { ...msg, feedback: msg.feedback === type ? undefined : type };
        }
        return msg;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="font-semibold hidden group-hover:block transition-all duration-300">Ask AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-50 flex flex-col md:w-[450px] md:h-[600px] bg-white md:rounded-2xl shadow-2xl border border-slate-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 md:rounded-t-2xl flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Omni Assistant</h3>
            <p className="text-xs text-indigo-100 opacity-90">Powered by Gemini</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-300">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {/* Google Maps Grounding Sources */}
              {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Sources</p>
                      <div className="flex flex-col gap-1">
                          {msg.groundingLinks.map((link, idx) => (
                              <a 
                                key={idx} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline bg-indigo-50 p-1.5 rounded"
                              >
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-[200px]">{link.title}</span>
                              </a>
                          ))}
                      </div>
                  </div>
              )}

              {/* Feedback Buttons for Model Messages */}
              {msg.role === 'model' && (
                <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Was this helpful?</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleFeedback(msg.id, 'up')}
                            className={`p-1 rounded hover:bg-slate-50 transition-colors ${msg.feedback === 'up' ? 'text-green-600' : 'text-slate-400'}`}
                            title="Helpful"
                        >
                            <ThumbsUp className={`w-3.5 h-3.5 ${msg.feedback === 'up' ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                            onClick={() => handleFeedback(msg.id, 'down')}
                            className={`p-1 rounded hover:bg-slate-50 transition-colors ${msg.feedback === 'down' ? 'text-red-500' : 'text-slate-400'}`}
                            title="Not Helpful"
                        >
                            <ThumbsDown className={`w-3.5 h-3.5 ${msg.feedback === 'down' ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>
              )}
            </div>
            
            {/* Render Recommended Products within chat */}
            {msg.relatedProducts && msg.relatedProducts.length > 0 && (
              <div className="mt-3 w-full pl-2">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Recommended for you</p>
                <div className="flex gap-3 overflow-x-auto pb-4 px-1 -mx-1 snap-x no-scrollbar">
                  {msg.relatedProducts.map(product => (
                    <div key={product.id} className="min-w-[200px] w-[200px] snap-start">
                       <ProductCard product={product} compact={true} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0 md:rounded-b-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search products or stores nearby..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};