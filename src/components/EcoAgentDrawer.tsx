import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PRODUCTS } from '../data/products.ts';
import { ChatMessage, Product } from '../types.ts';
import { 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  Eye, 
  AlertCircle, 
  RotateCcw,
  Check,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';

export const EcoAgentDrawer: React.FC = () => {
  const { 
    isEcoAgentOpen, 
    setIsEcoAgentOpen, 
    agentInitialPrompt, 
    setAgentInitialPrompt,
    addToCart,
    setSelectedProduct
  } = useApp();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Hello! I am your EcoMart Sustainability Advisor. Tell me what you are looking for, your budget in ₹, or your material preferences (e.g. plastic-free, organic cotton, zero-waste). I will guide you to verified items in our catalog!',
      suggestedQuestions: [
        'I need an environmentally friendly water bottle under ₹800',
        'Show me zero-waste kitchen essentials under ₹1,500',
        'What are the highest Eco Score items in the store?',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isEcoAgentOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isEcoAgentOpen]);

  // Handle triggered prompt from Hero or outside
  useEffect(() => {
    if (agentInitialPrompt && isEcoAgentOpen) {
      handleSendMessage(agentInitialPrompt);
      setAgentInitialPrompt('');
    }
  }, [agentInitialPrompt, isEcoAgentOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/eco-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          userQuery: textToSend,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.message || 'Here are our verified catalog recommendations.',
        recommendedProductIds: data.recommendedProductIds || [],
        suggestedQuestions: data.suggestedQuestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: Boolean(data.error),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err: any) {
      console.error('Eco Agent error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: 'I could not connect to the Gemini service right now. Please check your network connection and ensure your GEMINI_API_KEY is configured in AI Studio Secrets settings. The rest of the store remains fully functional!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        suggestedQuestions: [
          'Show me bestsellers with Eco Score 95+',
          'Show zero plastic items',
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEcoAgentOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsEcoAgentOpen(false)}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  EcoMart Eco Agent
                </h3>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-sm">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Grounded in current catalog · Zero hallucination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'reset',
                    sender: 'agent',
                    text: 'Conversation reset. How can I help you shop with purpose today?',
                    suggestedQuestions: [
                      'I need an environmentally friendly water bottle under ₹800',
                      'Show me kitchen items under ₹1,500',
                    ],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              title="Reset conversation"
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEcoAgentOpen(false)}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[88%]">
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div 
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-800 dark:bg-emerald-600 text-white rounded-br-xs'
                        : msg.isError
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-bl-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-xs'
                    }`}
                  >
                    {msg.isError && (
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800 dark:text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Advisor Notice</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  <span className="text-[10px] text-stone-400 mt-1 block px-1">
                    {msg.timestamp}
                  </span>

                  {/* Grounded Product Recommendations */}
                  {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                        Verified Catalog Matches
                      </span>
                      {msg.recommendedProductIds.map((pid) => {
                        const product = PRODUCTS.find((p) => p.id === pid);
                        if (!product) return null;
                        return (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-xs"
                          >
                            <div 
                              onClick={() => {
                                setSelectedProduct(product);
                              }}
                              className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate hover:text-emerald-600 transition-colors">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] mt-0.5">
                                  <span className="font-bold text-stone-900 dark:text-stone-100">
                                    ₹{product.price.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                                    Eco {product.ecoScore}/100
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => addToCart(product, 1)}
                              title={`Add ${product.name} to cart`}
                              className="ml-2 p-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-colors shrink-0"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggested Follow-up Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-left text-[11px] py-1 px-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                        >
                          {q} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-stone-500 dark:text-stone-400">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 rounded-bl-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] ml-1">Analyzing sustainable catalog...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. bottle under ₹800, kitchen gifts)..."
              disabled={isLoading}
              className="flex-1 py-2.5 px-3.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-emerald-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-colors disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-stone-400 text-center">
            Grounded in EcoMart verified catalog data. No simulated data.
          </div>
        </div>
      </div>
    </div>
  );
};
