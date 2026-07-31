import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Cpu,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(0); // 0: Confirmed, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  // Automated stage transition simulation for hackathon demonstration
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStage(1), 3000);
    const timer2 = setTimeout(() => setCurrentStage(2), 7000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const stages = [
    { title: "Confirmed", icon: CheckCircle2, desc: "Order details verified & warehouse notified" },
    { title: "Packed", icon: Package, desc: "Items boxed & serial numbers registered" },
    { title: "Shipped", icon: Truck, desc: "Handed over to Express Courier partner" },
    { title: "Out for Delivery", icon: MapPin, desc: "Delivery executive assigned & en route" },
    { title: "Delivered", icon: Sparkles, desc: "Package signed & delivered to customer" }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">Generating official order confirmation receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Order not found</h2>
        <Link to="/products" className="text-xs text-cyan-400 underline">Return to storefront</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950 border border-emerald-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto text-3xl animate-pulse">
          ✓
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
            ORDER CONFIRMED & RESERVED
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-mono mt-1">
            Order ID: #{order.orderId}
          </h1>
          <p className="text-xs text-slate-300 mt-2">
            Thank you for shopping with NEXORA! A receipt has been dispatched to your email.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono pt-2 text-slate-300">
          <span>Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
          <span>•</span>
          <span>Payment: {order.paymentMethod}</span>
          <span>•</span>
          <span className="text-emerald-400">Est. Delivery: {order.estimatedDelivery}</span>
        </div>
      </div>

      {/* Animated Order Lifecycle Tracker */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-100 font-mono">
              Live Order Lifecycle Tracker
            </h3>
          </div>
          <button
            onClick={() => setCurrentStage((currentStage + 1) % 5)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
          >
            Advance Lifecycle State →
          </button>
        </div>

        {/* Timeline Bar */}
        <div className="relative">
          <div className="hidden md:flex items-center justify-between relative z-10">
            {stages.map((stg, index) => {
              const Icon = stg.icon;
              const isPassed = index <= currentStage;
              const isCurrent = index === currentStage;

              return (
                <div key={index} className="flex flex-col items-center text-center max-w-[140px] space-y-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/40 animate-bounce'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-600 border-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold font-mono ${isPassed ? 'text-slate-100' : 'text-slate-500'}`}>
                      {stg.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                      {stg.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="md:hidden space-y-4">
            {stages.map((stg, index) => {
              const Icon = stg.icon;
              const isPassed = index <= currentStage;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isPassed ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isPassed ? 'text-slate-100' : 'text-slate-500'}`}>{stg.title}</div>
                    <div className="text-[10px] text-slate-400">{stg.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Item Details & Address */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="md:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 font-mono border-b border-slate-800 pb-3">
            Purchased Item Manifest ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                  <div>
                    <div className="text-xs font-bold text-slate-100">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className="text-xs font-bold font-mono text-cyan-400">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Total Paid</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Shipping Address & Architecture Shortcut */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" /> Shipping Destination
            </h3>
            <div className="text-slate-300 font-medium">
              <p className="font-bold text-slate-100">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
              <Cpu className="w-4 h-4" /> Live Architecture Event
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Want to see how this order traversed NEXORA microservices in real time?
            </p>
            <Link
              to="/architecture"
              className="inline-flex items-center gap-1 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              View System Pipeline →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
