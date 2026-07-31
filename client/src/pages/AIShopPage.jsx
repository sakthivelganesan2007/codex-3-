import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Zap, 
  Plus, 
  ArrowRightLeft, 
  Trash2, 
  Check, 
  ShoppingBag,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function AIShopPage() {
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef(null);

  const {
    aiMessages,
    sendAIMessage,
    aiLoading,
    proposedActions,
    acceptProposedAction,
    rejectProposedAction,
    cart
  } = useStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, proposedActions, aiLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (prompt.trim() && !aiLoading) {
      sendAIMessage(prompt.trim());
      setPrompt('');
    }
  };

  const presetScenarios = [
    { title: "CSE College Setup", prompt: "Build me a complete CSE college setup under ₹50,000", tag: "₹50k Budget" },
    { title: "Gaming Setup (GPU Focus)", prompt: "Build me a gaming setup under ₹80k, prioritize GPU performance", tag: "₹80k Budget" },
    { title: "Smart Cart Cost Optimization", prompt: "Make my cart cheaper and identify value swaps", tag: "Cart Savings" },
    { title: "Developer Monitor & Desk Setup", prompt: "Recommend a 4K monitor and mechanical keyboard under ₹35,000", tag: "Ergonomics" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI-NATIVE STORE ROUTE
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            Conversational AI Shopping Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build custom rigs, solve budget limits, and review proposed cart modifications with rationale
          </p>
        </div>
      </div>

      {/* Preset Scenarios Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {presetScenarios.map((sc, i) => (
          <button
            key={i}
            onClick={() => sendAIMessage(sc.prompt)}
            disabled={aiLoading}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-left space-y-2 transition-all hover:-translate-y-0.5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                {sc.title}
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {sc.tag}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic font-mono line-clamp-2">"{sc.prompt}"</p>
          </button>
        ))}
      </div>

      {/* Main Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Pane: Chat Window & Proposed Actions (7 Cols) */}
        <div className="lg:col-span-7 h-[650px] rounded-3xl glass-panel border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
          {/* Top Bar */}
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">NEXORA Gemini Agent</h3>
                <span className="text-[10px] text-emerald-400 font-mono">● Ready to evaluate prompts & budgets</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/70">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="mt-1 text-[9px] opacity-60 text-right font-mono">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {/* Proposed Actions Cards */}
            {proposedActions.length > 0 && (
              <div className="p-4 bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                    AI Proposed Actions ({proposedActions.length})
                  </span>
                  <span>User Approval Required</span>
                </div>

                {proposedActions.map((action, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-indigo-900/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-100">
                      <span>{action.type}: {action.product?.name || action.replacementProduct?.name}</span>
                      <span className="text-cyan-400 font-mono">
                        ₹{(action.product?.price || action.replacementProduct?.price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic font-mono">"{action.reason}"</p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => rejectProposedAction(action)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => acceptProposedAction(action)}
                        className="px-3.5 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-[10px] flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Accept & Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 p-3 bg-slate-900/60 rounded-xl animate-pulse font-mono">
                <Bot className="w-4 h-4 animate-spin" />
                Thinking & generating setup recommendations...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI Copilot to build or modify setup..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={aiLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={aiLoading || !prompt.trim()}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>

        {/* Right Pane: Live Cart Preview & Recommendations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                Current Cart Items ({cart.length})
              </h3>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('en-IN')}
              </span>
            </div>

            {cart.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Cart is empty. Send a prompt to generate a setup!
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-200 line-clamp-1">{item.name}</div>
                    <div className="font-mono text-cyan-400">₹{item.price.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
