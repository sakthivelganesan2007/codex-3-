import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Cpu, PlayCircle, CheckCircle2, Server, Database, ShieldCheck, ShoppingCart, CreditCard, Sparkles, ArrowRight } from 'lucide-react';

export default function ArchitecturePage() {
  const { activeArchNode, setArchNode } = useStore();
  const [simulating, setSimulating] = useState(false);

  const nodes = [
    { id: 'customer', label: '1. Customer Request', subtitle: 'User Prompt or UI Action', icon: Sparkles },
    { id: 'storefront', label: '2. Storefront (React SPA)', subtitle: 'Vite + Zustand + Tailwind', icon: Cpu },
    { id: 'ai-copilot', label: '3. Gemini AI Assistant', subtitle: 'Setup Builder & Intent Parser', icon: Cpu },
    { id: 'cart', label: '4. Smart Cart Engine', subtitle: 'Cart Health Score & Optimizations', icon: ShoppingCart },
    { id: 'inventory', label: '5. Inventory & Stock API', subtitle: 'Warehouse Reserved Stock', icon: Server },
    { id: 'checkout', label: '6. AI Checkout Guardian', subtitle: 'Pre-Payment Verification', icon: ShieldCheck },
    { id: 'payment-simulator', label: '7. Payment Simulator', subtitle: 'UPI / Card Validation', icon: CreditCard },
    { id: 'order-service', label: '8. Order & Admin Pipeline', subtitle: 'Receipt & Analytics Engine', icon: Database },
  ];

  const handleRunPipelineSimulation = () => {
    setSimulating(true);
    let step = 0;
    const nodeSequence = ['customer', 'storefront', 'ai-copilot', 'cart', 'inventory', 'checkout', 'payment-simulator', 'order-service'];

    const interval = setInterval(() => {
      if (step < nodeSequence.length) {
        setArchNode(nodeSequence[step]);
        step++;
      } else {
        clearInterval(interval);
        setSimulating(false);
        setArchNode('storefront');
      }
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" /> HACKATHON LIVE ARCHITECTURE VIEW
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            NEXORA Commerce Event Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time event flow visualization from natural language prompt to order confirmation
          </p>
        </div>

        <button
          onClick={handleRunPipelineSimulation}
          disabled={simulating}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <PlayCircle className="w-4 h-4" />
          <span>{simulating ? 'Simulating Event Propagation...' : '⚡ Simulate Order Flow Pipeline'}</span>
        </button>
      </div>

      {/* Interactive Visual Event Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isActive = activeArchNode === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setArchNode(node.id)}
              className={`p-6 rounded-3xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between h-48 border ${
                isActive
                  ? 'bg-slate-900 border-cyan-400 shadow-2xl shadow-cyan-500/30 scale-105 z-10'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Active Pulsing Indicator */}
              {isActive && (
                <span className="absolute top-3 right-3 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
              )}

              <div className="space-y-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isActive ? 'bg-cyan-500 text-slate-950 border-cyan-300' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold font-mono ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {node.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{node.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-2 text-slate-500">
                <span>Node 0{index + 1}</span>
                {isActive && <span className="text-cyan-400 font-bold uppercase animate-pulse">ACTIVE EVENT PROCESSING</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Explanation Card */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold text-slate-100 font-mono flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Technical Stack & Microservice Communication
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          NEXORA executes an asynchronous event pipeline. When a user requests a setup (*"Build coding setup under ₹50k"*), the Gemini AI Assistant Controller parses budget rules, matches MERN MongoDB schemas, passes proposed actions through the Smart Cart Engine, runs Checkout Guardian inventory checks, and commits orders to storage.
        </p>
      </div>
    </div>
  );
}
