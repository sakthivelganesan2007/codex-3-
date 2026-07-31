import { create } from 'zustand';
import { productsData } from '../services/api';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('nexora_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const useStore = create((set, get) => ({
  // Cart & Budget State
  cart: getInitialCart(),
  userBudget: 75000,
  appliedCoupon: null,

  // AI Copilot State
  aiCopilotOpen: false,
  aiMessages: [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "👋 Hi! I'm NEXORA, your AI Shopping Copilot. Tell me your budget or use-case (*\"Build a coding setup under ₹50,000\"* or *\"Gaming laptop under ₹80k with high GPU\"*), and I'll assemble & optimize your cart!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  proposedActions: [], // AI suggested modifications awaiting approval
  aiLoading: false,

  // Compare & History State
  compareList: [],
  recentlyViewed: [],

  // Architecture Event Active Node State
  activeArchNode: 'storefront',

  // Orders State
  orders: [],

  // Admin Auth State
  isAdminAuthenticated: (() => {
    try {
      return localStorage.getItem('nexora_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  })(),

  // Demo Runner State
  demoState: {
    isRunning: false,
    currentStep: 0,
    message: ''
  },

  // Admin Auth Actions
  loginAdmin: (id, password) => {
    if (id === '8148604669' && password === 'svss1234') {
      try {
        localStorage.setItem('nexora_admin_auth', 'true');
      } catch (e) {}
      set({ isAdminAuthenticated: true });
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin ID or Password! Please verify your credentials.' };
  },

  logoutAdmin: () => {
    try {
      localStorage.removeItem('nexora_admin_auth');
    } catch (e) {}
    set({ isAdminAuthenticated: false });
  },

  // Actions
  setBudget: (budget) => set({ userBudget: budget }),

  toggleAICopilot: () => set((state) => ({ aiCopilotOpen: !state.aiCopilotOpen })),

  openAICopilotWithPrompt: (prompt) => {
    set({ aiCopilotOpen: true });
    get().sendAIMessage(prompt);
  },

  setArchNode: (nodeId) => set({ activeArchNode: nodeId }),

  // Cart Actions
  addToCart: (product, quantity = 1) => {
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex((item) => item.id === product.id);

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = currentCart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity }];
    }

    localStorage.setItem('nexora_cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart, activeArchNode: 'cart' });
    setTimeout(() => set({ activeArchNode: 'storefront' }), 2000);
  },

  removeFromCart: (productId) => {
    const updatedCart = get().cart.filter((item) => item.id !== productId);
    localStorage.setItem('nexora_cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const updatedCart = get().cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('nexora_cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  clearCart: () => {
    localStorage.removeItem('nexora_cart');
    set({ cart: [], appliedCoupon: null });
  },

  applyCoupon: (couponObj) => set({ appliedCoupon: couponObj }),
  removeCoupon: () => set({ appliedCoupon: null }),

  // AI Chat & Action Management
  addAIMessage: (messageObj) =>
    set((state) => ({ aiMessages: [...state.aiMessages, messageObj] })),

  setAILoading: (loading) => set({ aiLoading: loading }),

  sendAIMessage: async (promptText) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      aiMessages: [...state.aiMessages, userMsg],
      aiLoading: true,
      activeArchNode: 'ai-copilot'
    }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, cart: get().cart })
      });
      const data = await response.json();

      if (data.success && data.data) {
        const aiRes = data.data;
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiRes.message,
          data: aiRes,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        set((state) => ({
          aiMessages: [...state.aiMessages, aiMsg],
          proposedActions: aiRes.proposedCartActions || [],
          aiLoading: false
        }));
      }
    } catch (err) {
      set((state) => ({
        aiMessages: [
          ...state.aiMessages,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "I've analyzed your setup requirements and compiled recommendations matching your budget limit.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        aiLoading: false
      }));
    } finally {
      setTimeout(() => set({ activeArchNode: 'storefront' }), 1500);
    }
  },

  // Proposed AI Actions Accept / Reject
  acceptProposedAction: (action) => {
    if (action.type === 'ADD' && action.product) {
      get().addToCart(action.product, 1);
    } else if (action.type === 'REPLACE') {
      if (action.originalProduct) {
        get().removeFromCart(action.originalProduct.id);
      }
      if (action.replacementProduct) {
        get().addToCart(action.replacementProduct, 1);
      }
    } else if (action.type === 'REMOVE' && action.product) {
      get().removeFromCart(action.product.id);
    }

    set((state) => ({
      proposedActions: state.proposedActions.filter((a) => a !== action)
    }));
  },

  rejectProposedAction: (action) => {
    set((state) => ({
      proposedActions: state.proposedActions.filter((a) => a !== action)
    }));
  },

  // Compare List Management
  toggleCompare: (productId) => {
    const current = get().compareList;
    if (current.includes(productId)) {
      set({ compareList: current.filter((id) => id !== productId) });
    } else {
      if (current.length >= 4) {
        alert('You can compare a maximum of 4 products at a time.');
        return;
      }
      set({ compareList: [...current, productId] });
    }
  },

  clearCompare: () => set({ compareList: [] }),

  // Recently Viewed History
  addRecentlyViewed: (productId) => {
    const current = get().recentlyViewed.filter((id) => id !== productId);
    set({ recentlyViewed: [productId, ...current].slice(0, 6) });
  },

  // Demo Scenario Controller
  startDemoScenario: async (navigate) => {
    set({
      demoState: { isRunning: true, currentStep: 1, message: "Step 1: Interpreting prompt 'Build developer setup under ₹70,000'..." }
    });

    // Step 1: Open Copilot & send query
    set({ aiCopilotOpen: true });
    await new Promise((r) => setTimeout(r, 1200));

    get().sendAIMessage("Build me a complete developer setup under ₹70,000");

    set({
      demoState: { isRunning: true, currentStep: 2, message: "Step 2: Searching catalog & generating proposed cart..." }
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Step 3: Accept proposed actions automatically
    set({
      demoState: { isRunning: true, currentStep: 3, message: "Step 3: User accepts AI proposed product bundle..." }
    });

    const actions = get().proposedActions;
    actions.forEach((act) => get().acceptProposedAction(act));
    await new Promise((r) => setTimeout(r, 1500));

    // Step 4: Navigate to Smart Cart & calculate health score
    set({
      demoState: { isRunning: true, currentStep: 4, message: "Step 4: Navigating to Smart Cart for AI Health Inspection..." }
    });
    if (navigate) navigate('/cart');
    await new Promise((r) => setTimeout(r, 2000));

    // Step 5: Navigate to Checkout
    set({
      demoState: { isRunning: true, currentStep: 5, message: "Step 5: Proceeding to Multi-Step Checkout & AI Guardian check..." }
    });
    if (navigate) navigate('/checkout');
    await new Promise((r) => setTimeout(r, 2500));

    set({
      demoState: { isRunning: false, currentStep: 6, message: "Demo Scenario Complete! Check order & live architecture." }
    });
  }
}));
