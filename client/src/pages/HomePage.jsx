import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { productsData } from '../services/api';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Laptop, 
  Headphones, 
  Gamepad2, 
  Monitor, 
  Keyboard, 
  CheckCircle 
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [heroPrompt, setHeroPrompt] = useState('');
  const { openAICopilotWithPrompt, startDemoScenario } = useStore();

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (heroPrompt.trim()) {
      openAICopilotWithPrompt(heroPrompt.trim());
    } else {
      openAICopilotWithPrompt("Build me a complete coding setup under ₹50,000");
    }
  };

  const categories = [
    { name: "Laptops & Rigs", slug: "laptops", icon: Laptop, count: "5 Products", color: "from-cyan-500/20 to-blue-500/20" },
    { name: "Monitors & Displays", slug: "monitors", icon: Monitor, count: "4 Products", color: "from-purple-500/20 to-indigo-500/20" },
    { name: "Keyboards & Accessories", slug: "accessories", icon: Keyboard, count: "8 Products", color: "from-emerald-500/20 to-teal-500/20" },
    { name: "Audio & Headphones", slug: "audio", icon: Headphones, count: "5 Products", color: "from-rose-500/20 to-pink-500/20" },
    { name: "Gaming Gear", slug: "gaming", icon: Gamepad2, count: "3 Products", color: "from-amber-500/20 to-orange-500/20" }
  ];

  const trendingProducts = productsData.slice(0, 8);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>THE FUTURE OF COMMERCE IS AI-NATIVE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
            Don't just shop. <br />
            Let AI build your <span className="text-gradient">Perfect Setup.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            NEXORA evaluates your budget, use-case, and hardware compatibility in real time. Describe what you need, approve proposed cart recommendations, and checkout safely.
          </p>

          {/* AI Conversational Input Box */}
          <form onSubmit={handleHeroSubmit} className="max-w-3xl mx-auto">
            <div className="p-2 rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-3 px-4 py-2 flex-1 w-full">
                <Bot className="w-6 h-6 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Build me a complete coding setup under ₹50,000..."
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Build My Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sample Prompts */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-400 text-[11px]">Try asking:</span>
              {[
                "CSE College Setup under ₹50,000",
                "Gaming setup under ₹80k, prioritize GPU",
                "Noise cancelling headphones under ₹7,000"
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openAICopilotWithPrompt(sample)}
                  className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors cursor-pointer"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-100">Conversational AI Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe your goal naturally. NEXORA AI searches the catalog, checks specs, calculates price impact, and proposes a tailored cart.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-100">Smart Cart Health (0-100)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time health diagnostic scoring budget compliance, redundancies, and compatibility. 1-click auto-optimization swaps save money.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-100">AI Checkout Guardian</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Final pre-payment safety layer verifying stock availability, pincode delivery, hardware ports compatibility, and missed coupon codes.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight font-mono">
              Explore Categories
            </h2>
            <p className="text-xs text-slate-400">Curated hardware and developer accessories</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View Full Store catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-3 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight font-mono flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Trending & AI Recommended Products
            </h2>
            <p className="text-xs text-slate-400">Popular items with high AI suitability ratings</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Explore All 25+ Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Interactive AI Shop Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider font-mono">
              CONVERSATIONAL SHOPPING ROUTE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Ready to experience AI-Native Commerce?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step into our full conversational AI shop. Give prompts, inspect visual cart proposed actions, and run instant cart optimizations.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/ai-shop"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Launch Full Conversational AI Shop
              </Link>
              <button
                onClick={() => startDemoScenario(navigate)}
                className="px-6 py-3 bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>⚡ Run Hackathon Demo</span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3 font-mono text-xs">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Real-Time Decision Audit
            </div>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>Budget Parsing</span>
                <span className="text-emerald-400">✓ ₹50,000 Limit</span>
              </div>
              <div className="flex justify-between">
                <span>Compatibility</span>
                <span className="text-emerald-400">✓ 100% Match</span>
              </div>
              <div className="flex justify-between">
                <span>Cart Health Score</span>
                <span className="text-cyan-400">92 / 100</span>
              </div>
              <div className="flex justify-between">
                <span>Savings Identified</span>
                <span className="text-emerald-400">₹2,300</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
