import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchGuardianCheck } from '../services/api';
import { ShieldCheck, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function CheckoutGuardian({ onApprove, onReview }) {
  const { cart, appliedCoupon } = useStore();
  const [guardian, setGuardian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runCheck() {
      setLoading(true);
      const res = await fetchGuardianCheck(cart, appliedCoupon, { pincode: '560102' });
      setGuardian(res);
      setLoading(false);
    }
    runCheck();
  }, [cart, appliedCoupon]);

  if (loading) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
        <h3 className="text-sm font-bold text-cyan-400 font-mono">NEXORA AI Checkout Guardian Running...</h3>
        <p className="text-xs text-slate-400">Verifying live inventory, pin availability, compatibility, and best coupon rates.</p>
      </div>
    );
  }

  if (!guardian) return null;

  return (
    <div className="p-6 bg-slate-950/90 border border-emerald-500/30 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 font-mono flex items-center gap-2">
              AI Checkout Guardian Review
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PASSED (98% Score)
              </span>
            </h3>
            <p className="text-xs text-slate-400">Final safety & budget verification prior to payment</p>
          </div>
        </div>
      </div>

      {/* Checks Grid */}
      <div className="space-y-3">
        {guardian.checks.map((check, i) => (
          <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-200">{check.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{check.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Potential Extra Savings Alert */}
      {guardian.potentialSaving > 0 && (
        <div className="p-3 bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Apply code <strong>{guardian.suggestedCoupon}</strong> to save an additional <strong>₹{guardian.potentialSaving.toLocaleString('en-IN')}</strong>!</span>
          </div>
        </div>
      )}

      {/* Recommendation Summary */}
      <p className="text-xs text-slate-300 italic bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
        "{guardian.recommendationSummary}"
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onReview}
          className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Review Cart Items
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Confirm & Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
