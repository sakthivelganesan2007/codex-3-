import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import AICartHealth from '../components/AICartHealth';
import { validateCouponAPI } from '../services/api';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    userBudget,
    setBudget 
  } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal > 10000 || subtotal === 0 ? 0 : 250;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    const res = await validateCouponAPI(couponInput.trim(), subtotal);
    setValidatingCoupon(false);

    if (res.success && res.coupon) {
      applyCoupon(res.coupon);
      setCouponInput('');
    } else {
      setCouponError(res.message || 'Invalid coupon code');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-cyan-400" />
            NEXORA Smart Cart
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time health score, budget analysis, and AI component auto-optimization
          </p>
        </div>

        {/* User Target Budget Setting */}
        <div className="flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <span className="text-slate-400 font-mono font-medium">Target Budget:</span>
          <select
            value={userBudget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="bg-slate-950 text-cyan-400 font-bold border border-slate-800 rounded-lg px-2 py-1 focus:outline-none cursor-pointer font-mono"
          >
            <option value="50000">₹50,000</option>
            <option value="75000">₹75,000</option>
            <option value="100000">₹1,00,000</option>
            <option value="150000">₹1,50,000</option>
          </select>
        </div>
      </div>

      {/* Main Cart Health Diagnostic Engine */}
      <AICartHealth />

      {/* Cart Content Layout */}
      {cart.length === 0 ? (
        <div className="p-12 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">Your Smart Cart is empty</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Discover catalog hardware or ask AI Copilot to build a complete coding setup tailored to your budget!
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/products"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs shadow-md"
            >
              Browse Products
            </Link>
            <Link
              to="/ai-shop"
              className="px-6 py-2.5 bg-slate-800 text-cyan-400 border border-cyan-500/30 font-bold rounded-xl text-xs hover:bg-slate-700"
            >
              Build with AI Copilot
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2">
              <span>ITEMS IN CART ({cart.length})</span>
              <button
                onClick={clearCart}
                className="text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
            </div>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                    />
                    <div>
                      <Link to={`/product/${item.id}`} className="text-sm font-bold text-slate-100 hover:text-cyan-400">
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-slate-100 font-mono">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 Col: Summary & Promo Coupon */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
              <h3 className="text-base font-extrabold text-slate-100 font-mono">
                Order Total Summary
              </h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" /> Promo / Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-300 font-mono">{appliedCoupon.code} Applied</div>
                      <div className="text-[10px] text-emerald-400">{appliedCoupon.description}</div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-400 hover:underline font-mono"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Promo Coupon Code (NEXORA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 uppercase font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={validatingCoupon}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-xl text-xs font-mono cursor-pointer"
                    >
                      {validatingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                <p className="text-[10px] text-slate-500 italic">Try sample code 'NEXORA10' for 10% off!</p>
              </div>

              {/* Line Items Calculation */}
              <div className="space-y-3 text-xs border-t border-b border-slate-800 py-4 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${shippingFee}`}</span>
                </div>
              </div>

              {/* Final Amount */}
              <div className="flex justify-between items-center text-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider">Final Total</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
