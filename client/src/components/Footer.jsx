import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Cpu, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold text-sm">
                ⚡
              </div>
              <span className="text-lg font-black tracking-wider text-slate-100 font-mono">
                NEX<span className="text-cyan-400">ORA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Native Adaptive Commerce storefront featuring natural language setup generation, live smart cart health diagnostics, and pre-checkout guardian safety.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Gemini 2.5 Flash Engine Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Storefront</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-cyan-400 transition-colors">Catalog Discovery</Link></li>
              <li><Link to="/ai-shop" className="hover:text-cyan-400 transition-colors">Conversational AI Shop</Link></li>
              <li><Link to="/compare" className="hover:text-cyan-400 transition-colors">Product Matrix Compare</Link></li>
              <li><Link to="/cart" className="hover:text-cyan-400 transition-colors">Smart Cart & Health</Link></li>
            </ul>
          </div>

          {/* Architecture & Hackathon */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Hackathon Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/architecture" className="hover:text-cyan-400 transition-colors">Live Event Pipeline</Link></li>
              <li><Link to="/admin" className="hover:text-cyan-400 transition-colors">Store Intelligence</Link></li>
              <li><span className="text-slate-500">MERN Stack Architecture</span></li>
              <li><span className="text-slate-500">Google Gemini AI Engine</span></li>
            </ul>
          </div>

          {/* Tech Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {['MongoDB', 'Express.js', 'React 19', 'Node.js', 'Google Gemini', 'Tailwind CSS', 'Framer Motion', 'Zustand'].map((tech) => (
                <span key={tech} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NEXORA AI Inc. Hackathon Submission Edition.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Simulated Payments</span>
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> 100% Fallback Safe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
