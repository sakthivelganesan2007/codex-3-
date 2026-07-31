import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Check, 
  Trash2, 
  ArrowRightLeft, 
  Plus, 
  AlertCircle,
  HelpCircle,
  Zap,
  TrendingDown
} from 'lucide-react';

export default function AICopilotDrawer() {
  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef(null);

  const {
    aiCopilotOpen,
    toggleAICopilot,
    aiMessages,
    sendAIMessage,
    aiLoading,
    proposedActions,
    acceptProposedAction,
    rejectProposedAction
  } = useStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, proposedActions, aiLoading]);

  if (!aiCopilotOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (inputPrompt.trim() && !aiLoading) {
      sendAIMessage(inputPrompt.trim());
      setInputPrompt('');
    }
  };

  const samplePrompts = [
    "Build a coding setup under ₹50,000",
    "Gaming setup under ₹80k with high GPU",
    "Make my cart cheaper",
    "Headphones under ₹5k with long battery"
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md h-[600px] rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Drawer Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5 font-mono">
              NEXORA AI Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-[10px] text-slate-400">Gemini 2.5 AI Shopping Assistant</p>
          </div>
        </div>

        <button
          onClick={toggleAICopilot}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60">
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  NEXORA AI Response
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="mt-1 text-[9px] opacity-60 text-right font-mono">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {/* Pending Proposed Cart Actions (AI Suggestions) */}
        {proposedActions.length > 0 && (
          <div className="p-3 bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                AI Proposed Cart Actions ({proposedActions.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Requires Approval</span>
            </div>

            {proposedActions.map((action, idx) => (
              <div key={idx} className="p-3 bg-slate-950/80 border border-indigo-900/50 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {action.type === 'ADD' && <Plus className="w-4 h-4 text-emerald-400" />}
                    {action.type === 'REPLACE' && <ArrowRightLeft className="w-4 h-4 text-cyan-400" />}
                    {action.type === 'REMOVE' && <Trash2 className="w-4 h-4 text-rose-400" />}
                    <span className="text-xs font-bold text-slate-100">
                      {action.type === 'REPLACE'
                        ? `Replace with ${action.replacementProduct?.name}`
                        : `${action.type} ${action.product?.name}`}
                    </span>
                  </div>
                  {action.savings > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      Save ₹{action.savings.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 italic">"{action.reason}"</p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400">
                    Price: ₹{(action.product?.price || action.replacementProduct?.price || 0).toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectProposedAction(action)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => acceptProposedAction(action)}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors shadow-md flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {aiLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 p-2 bg-slate-900/50 rounded-xl animate-pulse font-mono">
            <Bot className="w-4 h-4 animate-spin" />
            Evaluating product specs, compatibility & budget rules...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendAIMessage(prompt)}
            disabled={aiLoading}
            className="shrink-0 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 rounded-full text-[10px] font-medium transition-colors border border-slate-700/60 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask NEXORA AI to build a setup or optimize..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={aiLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={aiLoading || !inputPrompt.trim()}
          className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
