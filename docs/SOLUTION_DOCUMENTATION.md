# SOLUTION DOCUMENTATION: NEXORA System Architecture & Technical Design

## 1. System Architecture Overview

NEXORA is built on the **MERN Stack** (MongoDB, Express.js, React 19, Node.js) integrated with **Google Gemini AI** (`@google/genai` / `gemini-2.5-flash`).

```
+-------------------------------------------------------------------------------+
|                            CLIENT FRONTEND (React + Vite)                      |
|                                                                               |
|  [HomePage]  [ProductsPage]  [ProductDetail]  [Smart Cart]  [Checkout]        |
|  [AIShop]    [CompareMatrix] [Architecture]   [AdminStats]                    |
|                                                                               |
|  - UI: Tailwind CSS, Framer Motion, Lucide Icons                              |
|  - State Management: Zustand Global Store (`useStore.js`)                      |
+------------------------------------+------------------------------------------+
                                     |
                                REST API (HTTP JSON)
                                     v
+------------------------------------+------------------------------------------+
|                            SERVER BACKEND (Node.js + Express)                  |
|                                                                               |
|  Routes (/api/products, /api/ai/chat, /api/ai/cart-health, /api/orders)       |
|  Controllers & Middleware                                                     |
|                                                                               |
|  +---------------------------+             +-------------------------------+  |
|  | Google Gemini AI Service  | <---------> | Deterministic AI Fallback     |  |
|  | (@google/genai)          |             | Engine (Zero API Key Failover)|  |
|  +---------------------------+             +-------------------------------+  |
+------------------------------------+------------------------------------------+
                                     |
                                     v
+------------------------------------+------------------------------------------+
|                     DATA LAYER (MongoDB / Mongoose / In-Memory)               |
|                                                                               |
|  Models: Product, Order, Coupon, User, Inventory                             |
+-------------------------------------------------------------------------------+
```

---

## 2. Gemini AI Integration & Prompt Engineering Strategy

### AI Communication Contract:
When a user submits a shopping query (e.g. *"Build me a coding setup under ₹50,000"*), the backend invokes `processAIChat(prompt, cart)`.

The prompt sends the catalog JSON summary and expects a **strict JSON response** matching:

```json
{
  "message": "Friendly markdown response explaining the setup",
  "intent": "BUILD_SETUP",
  "recommendedProducts": [
    {
      "id": "prod-101",
      "name": "NexaBook Pro 15 - AI Developer Edition",
      "price": 58999,
      "image": "https://...",
      "reason": "Core i7 13th Gen, 16GB RAM for fast compilation"
    }
  ],
  "proposedCartActions": [
    {
      "type": "ADD",
      "product": { "id": "prod-101", "name": "...", "price": 58999 },
      "reason": "Essential base laptop for CSE programming workload"
    }
  ],
  "totalImpact": 58999,
  "explanation": "Rationale for hardware selection"
}
```

### Deterministic Fallback Mechanism:
If the `GEMINI_API_KEY` environment variable is not defined or if network quotas are reached, `geminiService.js` automatically invokes `fallbackAIEngine()`. This engine uses intent keyword matching (budget numbers, use cases like "coding", "gaming", "cheaper") to generate structured JSON matching the exact same schema. This ensures the application **never breaks** during live hackathon judging!

---

## 3. AI Cart Health Scoring Algorithm

The Smart Cart calculates a real-time Health Score ($S$) between 0 and 100 based on four weighted factors:

$$S = (0.35 \times B) + (0.25 \times R) + (0.40 \times C)$$

Where:
- **Budget Compliance Score ($B$)**:
  - If $Total \le Budget$: $B = 100$
  - If $Total > Budget$: $B = \max(20, 100 - \frac{Total - Budget}{Budget} \times 100)$
- **Redundancy Check Score ($R$)**:
  - Penalizes multiple items within identical product categories: $R = \max(30, 100 - (Duplicates \times 25))$
- **Peripheral Compatibility Score ($C$)**:
  - Starts at 90. If a laptop is in the cart without an ergonomic laptop stand, subtracts 15 points. If a laptop is without an external keyboard, subtracts 10 points.

---

## 4. AI Pre-Checkout Guardian Pipeline

Before authorizing payment, `runCheckoutGuardian()` performs five checks:

1. **Warehouse Inventory Check**: Verifies `stock > 0` for every item in the cart.
2. **Peripheral & Cable Port Compatibility**: Verifies USB-C display bandwidth and power wattage requirements.
3. **Coupon Code Savings Protection**: Checks if valid promo codes (e.g. `NEXORA10`) can save additional money.
4. **Delivery Pincode Availability**: Validates pin code logistics.
5. **Price Locking Guarantee**: Locks item rates for 15 minutes.

---

## 5. Live Architecture View State Sync

The global Zustand store tracks `activeArchNode` state:
- Adding item to cart $\rightarrow$ triggers node `'cart'`
- Sending AI prompt $\rightarrow$ triggers node `'ai-copilot'`
- Executing checkout $\rightarrow$ animates `'checkout'` $\rightarrow$ `'payment-simulator'` $\rightarrow$ `'order-service'`.
