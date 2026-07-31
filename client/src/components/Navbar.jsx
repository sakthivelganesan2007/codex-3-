import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Sparkles, 
  ShoppingCart, 
  Layers, 
  BarChart3, 
  Cpu, 
  Search, 
  Bot, 
  Scale, 
  PlayCircle,
  Menu,
  X,
  Settings,
  ShieldCheck,
  Lock,
  Unlock,
  ChevronDown,
  Trash2
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const { 
    cart, 
    compareList, 
    toggleAICopilot, 
    startDemoScenario, 
    demoState, 
    isAdminAuthenticated, 
    clearCart 
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Storefront', path: '/products', icon: Layers },
    { name: 'AI Shop', path: '/ai-shop', icon: Bot, badge: 'AI Native' },
    { name: 'Compare', path: '/compare', icon: Scale, count: compareList.length },
    { name: 'Architecture', path: '/architecture', icon: Cpu, badge: 'Live' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Top Hackathon Demo Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/20 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
              HACKATHON MODE
            </span>
            <span className="text-slate-300 hidden sm:inline">
              NEXORA AI-Native Adaptive Commerce Engine (MERN + Gemini AI)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => startDemoScenario(navigate)}
              disabled={demoState.isRunning}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-full transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{demoState.isRunning ? 'Demo Running...' : '⚡ 2-Min Hackathon Demo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-slate-100 font-mono">
                NEX<span className="text-cyan-400">ORA</span>
              </span>
              <span className="text-[9px] tracking-widest text-cyan-400/80 uppercase font-semibold">
                AI ADAPTIVE STORE
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products or ask AI copilot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      {link.badge}
                    </span>
                  )}
                  {link.count > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500 text-white">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: AI Assistant, Cart, & Settings Dropdown */}
          <div className="flex items-center gap-3">
            {/* Settings Menu Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  location.pathname === '/admin' || settingsOpen
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title="Store Settings & Admin Menu"
              >
                <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span className="hidden sm:inline">Settings</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Dropdown Card */}
              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl glass-panel border border-slate-800 shadow-2xl bg-slate-950/95 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                    System & Admin Settings
                  </div>

                  <div className="py-1 space-y-1 text-xs">
                    {/* Admin Portal Link */}
                    <Link
                      to="/admin"
                      onClick={() => setSettingsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold">Admin Portal</span>
                      </div>
                      {isAdminAuthenticated ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <Unlock className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </Link>

                    {/* Architecture Link */}
                    <Link
                      to="/architecture"
                      onClick={() => setSettingsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-900 transition-colors"
                    >
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span>Live Architecture Flow</span>
                    </Link>

                    {/* Clear Cart Action */}
                    <button
                      onClick={() => {
                        clearCart();
                        setSettingsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Reset / Clear Cart Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Copilot Trigger */}
            <button
              onClick={toggleAICopilot}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 border border-indigo-500/30 text-indigo-200 text-xs font-medium transition-all shadow-md cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span className="hidden sm:inline">AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-0.5 -right-0.5" />
            </button>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-200 transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black text-[11px] rounded-full flex items-center justify-center shadow-lg border border-slate-950">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200"
              />
            </div>
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-blue-400 hover:bg-slate-900"
          >
            ⚙️ Admin Portal {isAdminAuthenticated ? '(Unlocked)' : '(Locked 🔒)'}
          </Link>
        </div>
      )}
    </header>
  );
}
