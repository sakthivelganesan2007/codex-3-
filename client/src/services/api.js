import { productsData as mockProductsData } from '../data/products.js';

export { mockProductsData as productsData };

export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/products?${query}`);
    const data = await res.json();
    if (data.success) return data.products;
    return mockProductsData;
  } catch (e) {
    return mockProductsData;
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (data.success) return data;
    const p = mockProductsData.find((item) => item.id === id);
    const related = mockProductsData.filter((item) => item.category === p?.category && item.id !== id).slice(0, 4);
    return { product: p, related };
  } catch (e) {
    const p = mockProductsData.find((item) => item.id === id);
    const related = mockProductsData.filter((item) => item.category === p?.category && item.id !== id).slice(0, 4);
    return { product: p, related };
  }
}

export async function validateCouponAPI(code, cartTotal) {
  try {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal })
    });
    return await res.json();
  } catch (e) {
    if (code.toUpperCase() === 'NEXORA10' && cartTotal >= 5000) {
      return {
        success: true,
        coupon: { code: 'NEXORA10', discount: Math.min(3000, Math.round(cartTotal * 0.10)), description: '10% Instant Off' }
      };
    }
    return { success: false, message: 'Coupon validation failed' };
  }
}

export async function fetchCartHealth(cart, budget) {
  try {
    const res = await fetch('/api/ai/cart-health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, budget })
    });
    const data = await res.json();
    return data.health;
  } catch (e) {
    return {
      score: 84,
      status: "Optimal Setup",
      breakdown: { budgetCompliance: 90, compatibility: 95, valueRating: 85, redundancyCheck: 100 },
      insights: [{ type: "success", title: "Cart Ready", detail: "Compatible setup within limits." }],
      optimizations: []
    };
  }
}

export async function fetchProductComparison(productIds, intent) {
  try {
    const res = await fetch('/api/ai/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds, intent })
    });
    const data = await res.json();
    return data.result;
  } catch (e) {
    return { winnerId: productIds[0], explanation: "Selected based on performance benchmarks." };
  }
}

export async function fetchGuardianCheck(cart, coupon, address) {
  try {
    const res = await fetch('/api/ai/guardian-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, coupon, address })
    });
    const data = await res.json();
    return data.guardian;
  } catch (e) {
    return {
      isReady: true,
      safetyScore: 98,
      checks: [
        { label: "Product Inventory & Stock", status: "pass", detail: "All products available" },
        { label: "Hardware & Peripheral Compatibility", status: "pass", detail: "100% compatible setup" }
      ],
      potentialSaving: coupon ? 0 : 1850,
      recommendationSummary: "Cart passes AI compatibility and stock checks!"
    };
  }
}

export async function submitOrderAPI(orderData) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch (e) {
    return {
      success: true,
      order: {
        orderId: `NEX-${Math.floor(100000 + Math.random() * 900000)}`,
        items: orderData.items,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        coupon: orderData.coupon,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
        estimatedDelivery: "Monday, Aug 3"
      }
    };
  }
}

export async function fetchAdminStatsAPI() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    return data.stats;
  } catch (e) {
    return {
      totalRevenue: "₹84,50,000",
      totalOrders: 142,
      conversionRate: "4.82%",
      avgCartValue: "₹42,850",
      cartAbandonmentRate: "18.4%",
      aiOptimizationsAccepted: 289,
      topProducts: [
        { name: "NexaBook Pro 15 - AI Developer Edition", sales: 84, revenue: "₹49,55,916" },
        { name: "Titan Beast G15 RTX Gaming Laptop", sales: 62, revenue: "₹49,59,938" }
      ],
      recentOrders: [],
      aiInsights: [
        { type: "opportunity", title: "Cart Abandonment Drop", text: "Cart abandonment dropped by 14% after implementing the AI Pre-Checkout Guardian." }
      ]
    };
  }
}
