import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchCartHealth } from '../services/api';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  ArrowRightLeft, 
  CheckCircle2, 
  Zap, 
  TrendingDown, 
  HelpCircle 
} from 'lucide-react';

export default function AICartHealth() {
  const { cart, userBudget, addToCart, removeFromCart } = useStore();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [acceptedOptimizations, setAcceptedOptimizations] = useState([]);

  const loadHealth = async () => {
    setLoading(true);
    const data = await fetchCartHealth(cart, userBudget);
    setHealthData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHealth();
  }, [cart, userBudget]);

  if (!healthData) return null;

  const scoreColor =
    healthData.score >= 80
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      : healthData.score >= 60
      ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
      : 'text-rose-400 border-rose-500/40 bg-rose-500/10';

  const handleApplyOptimization = (opt) => {
    if (opt.originalProduct && opt.replacementProduct) {
      removeFromCart(opt.originalProduct.id);
      addToCart(opt.replacementProduct, 1);
      setAcceptedOptimizations([...acceptedOptimizations, opt.id]);
    }
  };

  return (
    <div className="rounded-3xl glass-panel border border-cyan-500/20 p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Glow Backing */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 font-mono flex items-center gap-2">
              AI Cart Health Engine
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Real-Time
              </span>
            </h3>
            <p className="text-xs text-slate-400">Automated budget, compatibility & value analysis</p>
          </div>
        </div>

        <button
          onClick={loadHealth}
          disabled={loading}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
        >
          {loading ? 'Re-calculating...' : 'Refresh Diagnostic'}
        </button>
      </div>

      {/* Main Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Radial Score Display */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
          <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-inner ${scoreColor}`}>
            <span className="text-3xl font-black font-mono tracking-tight">{healthData.score}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
          </div>
          <span className="mt-3 text-xs font-bold text-slate-200">{healthData.status}</span>
        </div>

        {/* Breakdown Metric Bars */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Budget Compliance</span>
              <span className="font-mono text-cyan-400">{healthData.breakdown.budgetCompliance}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${healthData.breakdown.budgetCompliance}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Peripheral Compatibility</span>
              <span className="font-mono text-emerald-400">{healthData.breakdown.compatibility}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${healthData.breakdown.compatibility}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Redundancy & Duplicate Check</span>
              <span className="font-mono text-indigo-400">{healthData.breakdown.redundancyCheck}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${healthData.breakdown.redundancyCheck}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Diagnostic Alerts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {healthData.insights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                insight.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : insight.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
              }`}
            >
              {insight.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : insight.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">{insight.title}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{insight.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Optimize My Cart" Action Section */}
      {healthData.optimizations && healthData.optimizations.length > 0 && (
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider font-mono">
                AI Optimization Opportunities Available
              </h4>
            </div>
            <span className="text-xs text-emerald-400 font-bold font-mono">
              Potential Savings: ₹{healthData.optimizations.reduce((sum, o) => sum + o.savings, 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3">
            {healthData.optimizations.map((opt) => {
              const isAccepted = acceptedOptimizations.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 line-through">
                        {opt.originalProduct?.name} (₹{opt.originalProduct?.price.toLocaleString('en-IN')})
                      </span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold text-cyan-300">
                        {opt.replacementProduct?.name} (₹{opt.replacementProduct?.price.toLocaleString('en-IN')})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">{opt.reason}</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0 border-slate-900">
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">
                      YOU SAVE ₹{opt.savings.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleApplyOptimization(opt)}
                      disabled={isAccepted}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                        isAccepted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
                      }`}
                    >
                      {isAccepted ? 'Optimization Applied ✓' : 'Accept Swap'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
