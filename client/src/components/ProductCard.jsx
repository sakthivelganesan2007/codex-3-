import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Star, ShoppingCart, Check, Scale, Sparkles } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, compareList, toggleCompare } = useStore();

  const isCompared = compareList.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md font-mono">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Quick Compare Button */}
        <button
          onClick={() => toggleCompare(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
            isCompared
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
              : 'bg-slate-950/70 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-900'
          }`}
          title={isCompared ? 'Remove from compare' : 'Compare product'}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider text-[10px] font-semibold text-cyan-400/90">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold text-[11px]">{product.rating}</span>
              <span className="text-slate-500 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="group-hover:text-cyan-400 transition-colors">
            <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer Info & Cart Trigger */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-slate-100 font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-500 line-through font-mono">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all shadow-md cursor-pointer border border-slate-700/60 hover:border-cyan-400"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
