import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { 
  Star, 
  ShoppingCart, 
  Scale, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Bot, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, toggleCompare, compareList, openAICopilotWithPrompt } = useStore();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const res = await fetchProductById(id);
      setData(res);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">Loading product specifications & AI evaluation...</p>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Product not found</h2>
        <Link to="/products" className="text-xs text-cyan-400 underline">Return to catalog</Link>
      </div>
    );
  }

  const { product, related } = data;
  const isCompared = compareList.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-mono transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discovery</span>
      </button>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Large Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md font-mono">
                ✨ {product.badge}
              </span>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-slate-400">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
              <Truck className="w-4 h-4 text-cyan-400 mx-auto" />
              <div>Free Express Shipping</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
              <div>2 Year Warranty</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
              <RotateCcw className="w-4 h-4 text-indigo-400 mx-auto" />
              <div>14-Day Easy Return</div>
            </div>
          </div>
        </div>

        {/* Right: Product Details & AI Advice */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-extrabold font-mono">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 text-[11px]">({product.reviewsCount} reviews)</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock ({product.stock} units left)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-slate-100 font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-xs text-slate-500 line-through font-mono">
                  MSRP: ₹{product.originalPrice.toLocaleString('en-IN')} ({discount}% discount)
                </div>
              )}
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg font-mono">
              Inclusive of GST
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* AI Suitability Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                NEXORA AI Suitability Analysis
              </span>
              <button
                onClick={() => openAICopilotWithPrompt(`Why should I buy ${product.name}?`)}
                className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" /> Ask AI Assistant
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Evaluated as an optimal component for developer & workstation setups. High thermal resistance and multi-year compatibility guarantee.
            </p>
          </div>

          {/* Specifications Table */}
          {product.specs && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Technical Specifications
              </h3>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3">
                    <span className="text-slate-400 capitalize font-medium">{key}</span>
                    <span className="text-slate-200 font-mono font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white font-bold"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-bold text-slate-100 text-xs">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add {quantity} to Smart Cart</span>
            </button>

            <button
              onClick={() => toggleCompare(product.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
              title="Toggle Compare"
            >
              <Scale className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-800">
          <h2 className="text-xl font-extrabold text-slate-100 font-mono">
            Complementary Products & Accessories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
