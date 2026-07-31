import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchProductComparison, productsData } from '../services/api';
import { Scale, Sparkles, Bot, Trash2, CheckCircle2, Star, Trophy, ArrowRight } from 'lucide-react';

export default function ComparePage() {
  const { compareList, toggleCompare, clearCompare } = useStore();

  const [intent, setIntent] = useState('coding');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedProducts = productsData.filter((p) => compareList.includes(p.id));

  const handleRunAICompare = async () => {
    if (selectedProducts.length === 0) return;
    setLoading(true);
    const res = await fetchProductComparison(compareList, intent);
    setComparisonResult(res);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      handleRunAICompare();
    }
  }, [compareList, intent]);

  if (selectedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-200">No products selected for comparison</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Browse our catalog discovery page and click the scale icon on 2 to 4 products to compare specs, prices, and AI suitability scores side-by-side.
        </p>
        <Link
          to="/products"
          className="inline-flex px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs shadow-md"
        >
          Select Products to Compare
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight flex items-center gap-2">
            <Scale className="w-7 h-7 text-cyan-400" />
            Product Comparison Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comparing {selectedProducts.length} items side-by-side with AI Suitability Score
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
          >
            <option value="coding">Focus: Coding & Development</option>
            <option value="gaming">Focus: AAA Gaming & FPS</option>
            <option value="budget">Focus: Max Value / Budget</option>
          </select>

          <button
            onClick={clearCompare}
            className="px-3 py-2 bg-slate-900 text-rose-400 border border-slate-800 rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
          >
            Clear Matrix
          </button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      {comparisonResult && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/30 space-y-3 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
              <Trophy className="w-5 h-5 text-amber-400" />
              NEXORA AI Recommendation Winner: {comparisonResult.winnerText || selectedProducts[0].name}
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              96% AI Match
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{comparisonResult.explanation}"
          </p>
        </div>
      )}

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-3xl glass-panel border border-slate-800">
        <table className="w-full text-left text-xs divide-y divide-slate-800">
          <thead className="bg-slate-950">
            <tr>
              <th className="p-4 w-44 font-mono uppercase text-slate-400">Specifications</th>
              {selectedProducts.map((p) => (
                <th key={p.id} className="p-4 min-w-[220px] space-y-2">
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="absolute top-2 right-2 p-1 bg-slate-950/80 rounded-md text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-bold text-slate-100 line-clamp-2">{p.name}</div>
                  <div className="text-sm font-black text-cyan-400 font-mono">₹{p.price.toLocaleString('en-IN')}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800 text-slate-300">
            <tr>
              <td className="p-4 font-mono font-bold text-slate-400">User Rating</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{p.rating} / 5</span>
                    <span className="text-slate-500 font-normal">({p.reviewsCount})</span>
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-mono font-bold text-slate-400">AI Suitability Score</td>
              {selectedProducts.map((p) => {
                const match = comparisonResult?.suitabilityScores?.find((s) => s.id === p.id);
                const score = match ? match.score : 88;
                return (
                  <td key={p.id} className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                      {score} / 100
                    </span>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-mono font-bold text-slate-400">Category</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 capitalize font-mono text-slate-300">{p.category}</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-mono font-bold text-slate-400">Stock Availability</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-emerald-400 font-mono">In Stock ({p.stock} units)</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-mono font-bold text-slate-400">Key Specs</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-[11px] leading-relaxed space-y-1">
                  {p.specs ? (
                    Object.entries(p.specs).map(([k, v]) => (
                      <div key={k}><strong className="capitalize">{k}:</strong> {v}</div>
                    ))
                  ) : (
                    <span>{p.description.substring(0, 80)}...</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
