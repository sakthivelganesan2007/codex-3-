import React, { useState, useEffect } from 'react';
import { fetchAdminStatsAPI } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Sparkles, 
  AlertTriangle, 
  ArrowUpRight, 
  Package,
  Users
} from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const data = await fetchAdminStatsAPI();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">Fetching NEXORA store intelligence telemetry...</p>
      </div>
    );
  }

  if (!stats) return null;

  const kpis = [
    { title: "Gross Store Revenue", value: stats.totalRevenue, change: "+18.4% vs last month", icon: DollarSign, color: "text-emerald-400" },
    { title: "Total Executed Orders", value: stats.totalOrders, change: "+32 orders today", icon: ShoppingCart, color: "text-cyan-400" },
    { title: "Store Conversion Rate", value: stats.conversionRate, change: "+1.2% AI boost", icon: TrendingUp, color: "text-indigo-400" },
    { title: "Average Cart Value (AOV)", value: stats.avgCartValue, change: "+₹6,200 via AI Bundles", icon: Sparkles, color: "text-amber-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> ADMIN STORE INTELLIGENCE
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            NEXORA Analytics & AI Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time business performance metrics, AI cart conversion telemetry, and inventory alerts
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{kpi.title}</span>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-100 font-mono">{kpi.value}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">{kpi.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Business Insights Panel */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950 border border-cyan-500/30 space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          <h3 className="text-base font-extrabold text-slate-100 font-mono">
            AI Automated Business Insights & Diagnostic Telemetry
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.aiInsights.map((insight, idx) => (
            <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                {insight.title}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products & Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 font-mono border-b border-slate-800 pb-3">
            Top Performing Catalog Hardware
          </h3>
          <div className="space-y-3">
            {stats.topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-slate-200 line-clamp-1">{p.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{p.sales} Units Sold</div>
                </div>
                <div className="font-mono font-bold text-emerald-400">{p.revenue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Warehouse Inventory Alerts
            </h3>
            <span className="text-[10px] font-mono text-amber-400 font-bold">2 Items Low</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-200">SmartDesk Motorized Standing Desk</div>
                <div className="text-[10px] text-amber-300">Remaining Stock: 7 Units</div>
              </div>
              <button className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[10px]">Reorder</button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Apex Ultra 16 Creator Laptop</div>
                <div className="text-[10px] text-slate-400">Remaining Stock: 8 Units</div>
              </div>
              <button className="px-3 py-1 bg-slate-800 text-slate-300 font-bold rounded-lg text-[10px]">Reorder</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
