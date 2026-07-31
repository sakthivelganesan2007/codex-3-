import React from 'react';
import { useStore } from '../store/useStore';
import { PlayCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function DemoScenarioRunner() {
  const { demoState } = useStore();

  if (!demoState.isRunning) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-4 rounded-2xl glass-panel border border-cyan-400/50 shadow-2xl shadow-cyan-500/20 pointer-events-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-slate-950 animate-spin" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 font-mono">
            <span>AUTOMATED HACKATHON DEMO</span>
            <span>Step {demoState.currentStep} of 5</span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5 font-medium">{demoState.message}</p>
        </div>
      </div>
    </div>
  );
}
