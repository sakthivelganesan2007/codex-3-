import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import CheckoutGuardian from '../components/CheckoutGuardian';
import { submitOrderAPI } from '../services/api';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  RotateCcw
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, appliedCoupon, clearCart, setArchNode } = useStore();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: AI Guardian, 4: Processing
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [address, setAddress] = useState({
    fullName: 'Alex Rivera',
    phone: '+91 98765 43210',
    street: '142 Innovation Way, CSE Wing',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102'
  });

  const [paymentState, setPaymentState] = useState('idle'); // idle, processing, success, failure

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal > 10000 || subtotal === 0 ? 0 : 250;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const handleExecutePayment = async () => {
    setStep(4);
    setPaymentState('processing');
    setArchNode('checkout');

    setTimeout(async () => {
      setArchNode('payment-simulator');

      setTimeout(async () => {
        setArchNode('order-service');
        const orderPayload = {
          items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
          total: finalTotal,
          shippingAddress: address,
          paymentMethod: `${paymentMethod} (${paymentMethod === 'UPI' ? upiId : 'Simulated Card'})`,
          coupon: appliedCoupon
        };

        const res = await submitOrderAPI(orderPayload);
        setPaymentState('success');
        setArchNode('confirmation');
        clearCart();

        setTimeout(() => {
          if (res.success && res.order) {
            navigate(`/order/${res.order.orderId}`);
          }
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header & Steps */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-cyan-400" />
            NEXORA Checkout
          </h1>
          <p className="text-xs text-slate-400 mt-1">Multi-step order completion & payment simulator</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {[
            { num: 1, name: 'Shipping' },
            { num: 2, name: 'Payment' },
            { num: 3, name: 'AI Guardian' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                step === s.num
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <span>{s.num}.</span>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Layout */}
      {step === 4 ? (
        // Payment Processing Overlay
        <div className="p-12 glass-panel border border-cyan-500/40 rounded-3xl text-center space-y-6 max-w-xl mx-auto">
          {paymentState === 'processing' && (
            <>
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-slate-100 font-mono">Processing Simulated Payment...</h3>
              <p className="text-xs text-slate-400">
                Verifying bank authentication tokens & reserving warehouse inventory items.
              </p>
            </>
          )}

          {paymentState === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto text-2xl animate-bounce">
                ✓
              </div>
              <h3 className="text-xl font-bold text-emerald-400 font-mono">Payment Successful!</h3>
              <p className="text-xs text-slate-300">
                Order generated successfully. Redirecting to live order tracking timeline...
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Left 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
                <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Step 1: Shipping Address & Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Phone Number</label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-slate-400 font-medium">Street Address / Campus Building</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Pincode</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Continue to Payment Selection →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
                <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Step 2: Payment Simulator Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'UPI', label: 'UPI (Instant)', icon: QrCode },
                    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'COD', label: 'Cash on Delivery', icon: ShieldCheck }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <label className="text-xs text-slate-400">Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-[10px] text-slate-500">Supports Google Pay, PhonePe, Paytm simulation.</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to Shipping Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Run AI Guardian Check →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <CheckoutGuardian
                onApprove={handleExecutePayment}
                onReview={() => setStep(1)}
              />
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
            <h3 className="text-base font-extrabold text-slate-100 font-mono">
              Cart Items ({cart.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-950" />
                    <div>
                      <div className="font-bold text-slate-200 line-clamp-1 max-w-[150px]">{item.name}</div>
                      <div className="text-slate-500 font-mono">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-100">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-cyan-400 pt-2 border-t border-slate-800">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
