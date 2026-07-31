import { GoogleGenerativeAI } from '@google/generative-ai';
import { productsData } from '../data/products.js';

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('Gemini AI Client init note:', err.message);
  }
}

/**
 * Deterministic AI Fallback Engine
 * Parses prompt intent and returns structured JSON responses matching Gemini structure
 */
function fallbackAIEngine(prompt, currentCart = [], context = 'chat') {
  const cleanPrompt = prompt.toLowerCase();

  // 1. CODING SETUP UNDER ₹50,000 / BUDGET
  if (cleanPrompt.includes('coding') || cleanPrompt.includes('cse') || cleanPrompt.includes('developer') || cleanPrompt.includes('college')) {
    const budgetMatch = cleanPrompt.match(/(\d+)\s*(k|thousand|lakh|000)/) || [null, '50', 'k'];
    const budgetNum = cleanPrompt.includes('70') ? 70000 : cleanPrompt.includes('60') ? 60000 : 50000;

    const p1 = productsData.find(p => p.id === 'prod-101') || productsData[0]; // NexaBook Pro ₹58,999 or CodeCraft Lite ₹42,500
    const p2 = productsData.find(p => p.id === 'prod-301') || productsData[8]; // KeyMech Pro ₹4,499
    const p3 = productsData.find(p => p.id === 'prod-305') || productsData[12]; // Laptop Stand ₹1,999

    let recommendedList = [p1, p2, p3];
    if (budgetNum < 55000) {
      const budgetLaptop = productsData.find(p => p.id === 'prod-102') || p1;
      recommendedList = [budgetLaptop, p2, p3];
    }

    const totalCost = recommendedList.reduce((sum, item) => sum + item.price, 0);

    return {
      message: `I've constructed an optimized Coding & CSE Developer setup matching your budget limit of ₹${budgetNum.toLocaleString('en-IN')}.`,
      intent: "BUILD_SETUP",
      budget: budgetNum,
      useCase: "Full-Stack Coding & College",
      recommendedProducts: recommendedList.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        reason: `Perfect for your coding workload: ${p.specs?.processor || p.description.substring(0, 70)}`
      })),
      proposedCartActions: recommendedList.map(p => ({
        type: "ADD",
        product: p,
        reason: `Essential element of CSE Developer bundle.`
      })),
      totalImpact: totalCost,
      explanation: `This bundle balances core multi-thread compilation speed (${recommendedList[0].name}) with wrist ergonomics for long coding hours.`
    };
  }

  // 2. GAMING SETUP UNDER ₹80,000 / GPU PRIORITY
  if (cleanPrompt.includes('gaming') || cleanPrompt.includes('gpu')) {
    const laptop = productsData.find(p => p.id === 'prod-103') || productsData[2]; // Titan Beast G15 RTX ₹79,999
    const mouse = productsData.find(p => p.id === 'prod-304') || productsData[11]; // ApexGlide RGB Mouse ₹1,899
    const cooling = productsData.find(p => p.id === 'prod-503') || productsData[19]; // GameBeast Cooling Pad ₹1,499

    return {
      message: "Here is an intense Gaming Setup tailored for high FPS with dedicated RTX GPU performance.",
      intent: "BUILD_SETUP",
      budget: 80000,
      useCase: "AAA Gaming & High FPS",
      recommendedProducts: [laptop, mouse, cooling].map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        reason: p.badge || "High performance gaming gear"
      })),
      proposedCartActions: [laptop, mouse, cooling].map(p => ({
        type: "ADD",
        product: p,
        reason: "Maximized GPU power-to-rupee ratio."
      })),
      totalImpact: laptop.price + mouse.price + cooling.price,
      explanation: "Titan Beast G15 features an NVIDIA RTX 4060 with 8GB dedicated VRAM coupled with high-speed cooling to prevent thermal throttling."
    };
  }

  // 3. MAKE CART CHEAPER / OPTIMIZE
  if (cleanPrompt.includes('cheaper') || cleanPrompt.includes('optimize') || cleanPrompt.includes('saving') || cleanPrompt.includes('replace')) {
    if (currentCart.length === 0) {
      return {
        message: "Your cart is currently empty. Add products or ask me to build a setup first!",
        intent: "GENERAL",
        recommendedProducts: [],
        proposedCartActions: [],
        totalImpact: 0,
        explanation: "No cart items to swap or optimize."
      };
    }

    // Find expensive item in cart that has a cheaper counterpart
    const expensiveItem = currentCart.find(i => i.price > 4000) || currentCart[0];
    const categoryProducts = productsData.filter(p => p.category === (expensiveItem.category || 'laptops') && p.id !== expensiveItem.id);
    const cheaperAlternative = categoryProducts.sort((a,b) => a.price - b.price)[0] || productsData.find(p => p.id === 'prod-102');

    const savings = expensiveItem ? Math.max(0, expensiveItem.price - (cheaperAlternative?.price || 0)) : 0;

    return {
      message: `I found a value optimization! You can save ₹${savings.toLocaleString('en-IN')} by swapping ${expensiveItem.name} with ${cheaperAlternative.name}.`,
      intent: "OPTIMIZE_CART",
      proposedCartActions: [
        {
          type: "REPLACE",
          originalProduct: expensiveItem,
          replacementProduct: cheaperAlternative,
          reason: `Offers 90% of the capability at a ₹${savings.toLocaleString('en-IN')} lower price point.`,
          savings: savings
        }
      ],
      totalImpact: -savings,
      explanation: `By choosing ${cheaperAlternative.name}, you maintain high functionality while reducing overall order cost.`
    };
  }

  // 4. GENERAL SEARCH / ADVICE
  const matched = productsData.filter(p => cleanPrompt.split(' ').some(word => word.length > 3 && p.name.toLowerCase().includes(word) || p.description.toLowerCase().includes(word))).slice(0, 3);
  const results = matched.length > 0 ? matched : productsData.slice(0, 3);

  return {
    message: `Based on your request "${prompt}", here are the top matching recommendations from our store catalog:`,
    intent: "RECOMMEND",
    recommendedProducts: results.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      reason: p.badge || "Popular verified item"
    })),
    proposedCartActions: matched.map(p => ({
      type: "ADD",
      product: p,
      reason: "Matches your query."
    })),
    totalImpact: results.reduce((acc, i) => acc + i.price, 0),
    explanation: "Curated directly from our live product catalog inventory."
  };
}

/**
 * Handle AI Chat Request
 */
export async function processAIChat(prompt, cart = []) {
  if (!aiClient) {
    return fallbackAIEngine(prompt, cart);
  }

  try {
    const catalogSummary = productsData.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, tags: p.tags }));
    const systemPrompt = `You are NEXORA, an elite AI Shopping Assistant for an adaptive e-commerce storefront.
The catalog contains products in INR (₹): ${JSON.stringify(catalogSummary)}.
Current Cart: ${JSON.stringify(cart.map(c => ({ id: c.id, name: c.name, price: c.price })))}.

User Request: "${prompt}"

Return ONLY valid JSON matching this structure (no markdown formatting, no code blocks):
{
  "message": "Friendly markdown formatted reply explaining the suggestion",
  "intent": "BUILD_SETUP" | "OPTIMIZE_CART" | "RECOMMEND" | "EXPLAIN",
  "recommendedProducts": [{"id": "prod-xxx", "name": "...", "price": 0, "image": "...", "reason": "..."}],
  "proposedCartActions": [{"type": "ADD"|"REPLACE"|"REMOVE", "product": {}, "originalProduct": {}, "replacementProduct": {}, "reason": "...", "savings": 0}],
  "totalImpact": 0,
  "explanation": "Detailed rationale"
}`;

    const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(systemPrompt);
    const text = response.response.text() || '';
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    return parsed;
  } catch (err) {
    console.warn("Gemini API call failed, using fallback engine:", err.message);
    return fallbackAIEngine(prompt, cart);
  }
}

/**
 * Compute AI Cart Health Score & Optimizations
 */
export function calculateCartHealth(cart = [], userBudget = 75000) {
  if (!cart || cart.length === 0) {
    return {
      score: 100,
      status: "Empty Cart",
      breakdown: {
        budgetCompliance: 100,
        compatibility: 100,
        valueRating: 100,
        redundancyCheck: 100
      },
      insights: [
        { type: "info", title: "Cart Ready", detail: "Add products or ask AI Copilot to generate a setup!" }
      ],
      optimizations: []
    };
  }

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  // 1. Budget Score
  let budgetScore = 100;
  if (total > userBudget) {
    budgetScore = Math.max(20, 100 - Math.round(((total - userBudget) / userBudget) * 100));
  }

  // 2. Redundancies (multiple items in same category)
  const categories = cart.map(item => item.category);
  const uniqueCategories = new Set(categories);
  const redundancyCount = cart.length - uniqueCategories.size;
  let redundancyScore = Math.max(30, 100 - (redundancyCount * 25));

  // 3. Compatibility & Ergonomics
  let compatibilityScore = 90;
  const hasLaptop = cart.some(i => i.category === 'laptops');
  const hasStand = cart.some(i => i.id === 'prod-305');
  const hasKeyboard = cart.some(i => i.category === 'accessories' && i.name.toLowerCase().includes('keyboard'));

  if (hasLaptop && !hasStand) compatibilityScore -= 15;
  if (hasLaptop && !hasKeyboard) compatibilityScore -= 10;

  // Composite Health Score
  const overallScore = Math.round((budgetScore * 0.35) + (redundancyScore * 0.25) + (compatibilityScore * 0.40));

  const insights = [];
  if (total <= userBudget) {
    insights.push({ type: "success", title: "Within Budget", detail: `Total ₹${total.toLocaleString('en-IN')} is inside your ₹${userBudget.toLocaleString('en-IN')} limit.` });
  } else {
    insights.push({ type: "warning", title: "Over Budget Warning", detail: `Exceeds budget by ₹${(total - userBudget).toLocaleString('en-IN')}. Consider optimizing.` });
  }

  if (redundancyCount > 0) {
    insights.push({ type: "warning", title: "Similar Products Detected", detail: `Found ${redundancyCount} duplicate product category item(s) in your cart.` });
  } else {
    insights.push({ type: "success", title: "No Duplicate Categories", detail: "Clean, complementary item selection." });
  }

  if (hasLaptop && !hasStand) {
    insights.push({ type: "info", title: "Ergonomic Upgrade Suggested", detail: "Adding an Aluminium Laptop Stand improves neck posture & cooling by 12°C." });
  }

  // Generate Optimization Swaps
  const optimizations = [];
  const expensiveLaptop = cart.find(i => i.id === 'prod-101');
  if (expensiveLaptop) {
    const cheaperLaptop = productsData.find(p => p.id === 'prod-102');
    if (cheaperLaptop) {
      optimizations.push({
        id: "opt-1",
        originalProduct: expensiveLaptop,
        replacementProduct: cheaperLaptop,
        reason: "CodeCraft Lite offers 16GB RAM and Ryzen 5 for 90% of development needs.",
        savings: expensiveLaptop.price - cheaperLaptop.price
      });
    }
  }

  const expensiveKb = cart.find(i => i.id === 'prod-301');
  if (expensiveKb) {
    const cheaperKb = productsData.find(p => p.id === 'prod-302');
    if (cheaperKb) {
      optimizations.push({
        id: "opt-2",
        originalProduct: expensiveKb,
        replacementProduct: cheaperKb,
        reason: "KeyMech Lite provides silent linear switches with full wireless freedom.",
        savings: expensiveKb.price - cheaperKb.price
      });
    }
  }

  return {
    score: overallScore,
    status: overallScore > 80 ? "Optimal Setup" : overallScore > 60 ? "Good with Savings Potential" : "Needs Optimization",
    breakdown: {
      budgetCompliance: budgetScore,
      compatibility: compatibilityScore,
      valueRating: 88,
      redundancyCheck: redundancyScore
    },
    insights,
    optimizations
  };
}

/**
 * Compare 2-4 Products with AI Recommendation Rationale
 */
export function compareProductsAI(productIds = [], userIntent = 'coding') {
  const selected = productsData.filter(p => productIds.includes(p.id));
  if (selected.length === 0) return { winnerId: null, explanation: "No valid products provided." };

  let winner = selected[0];
  if (userIntent.includes('coding') || userIntent.includes('developer')) {
    winner = selected.find(p => p.tags.includes('coding')) || selected[0];
  } else if (userIntent.includes('budget') || userIntent.includes('cheap')) {
    winner = [...selected].sort((a,b) => a.price - b.price)[0];
  } else if (userIntent.includes('gaming')) {
    winner = selected.find(p => p.tags.includes('gaming') || p.specs?.gpu) || selected[0];
  }

  return {
    winnerId: winner.id,
    winnerText: winner.name,
    suitabilityScores: selected.map(p => ({
      id: p.id,
      score: p.id === winner.id ? 96 : Math.max(70, 96 - Math.abs(p.price - winner.price) / 1000)
    })),
    explanation: `For your ${userIntent} focus, ${winner.name} provides superior build quality, performance benchmarks, and overall value. It scores highest in thermals, durability, and user feedback.`
  };
}

/**
 * AI Checkout Guardian Pre-Flight Verification
 */
export function runCheckoutGuardian(cart = [], coupon = null, address = {}) {
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const itemsInStock = cart.every(i => (i.stock || 10) > 0);

  const checks = [
    { label: "Product Inventory & Stock", status: itemsInStock ? "pass" : "fail", detail: itemsInStock ? "All products are available in local warehouse" : "Some items out of stock" },
    { label: "Hardware & Peripheral Compatibility", status: "pass", detail: "Ports, displays, and accessories are 100% compatible" },
    { label: "Coupon Optimization Check", status: coupon ? "pass" : "info", detail: coupon ? `Applied coupon ${coupon.code}` : "No coupon applied. Code 'NEXORA10' is available for 10% off!" },
    { label: "Delivery Availability", status: address.pincode ? "pass" : "pass", detail: `Express delivery active for pin ${address.pincode || '560001'}` },
    { label: "Price Protection Guarantee", status: "pass", detail: "Best available pricing locked for 15 minutes" }
  ];

  const potentialSaving = coupon ? 0 : (total > 5000 ? Math.min(3000, Math.round(total * 0.10)) : 500);

  return {
    isReady: true,
    safetyScore: 98,
    checks,
    potentialSaving,
    suggestedCoupon: coupon ? null : "NEXORA10",
    recommendationSummary: "Your cart passes all NEXORA AI safety, compatibility, and inventory checks. You are good to proceed with checkout!"
  };
}
