# BASE CODE & DEVELOPER DOCUMENTATION: NEXORA

## 1. Directory Structure

```
codex 1/
├── package.json                   # Root scripts for running client & server concurrently
├── README.md                      # Project setup & hackathon guide
├── docs/                          # Comprehensive Documentation Suite
│   ├── IDEA_DOCUMENTATION.md      # Product vision, problem statement, key differentiators
│   ├── SOLUTION_DOCUMENTATION.md  # Architecture, Gemini AI prompts, Cart Health math
│   └── BASE_CODE_DOCUMENTATION.md # Developer guide & API reference
├── server/                        # Node.js + Express Backend Server
│   ├── package.json               # Backend dependencies (express, cors, @google/genai, dotenv)
│   ├── index.js                   # Express server entry point (Port 5000)
│   ├── data/
│   │   └── products.js            # 25+ realistic products dataset (in ₹ INR) & coupons
│   ├── services/
│   │   └── geminiService.js       # Google Gemini AI Client & Deterministic Fallback Engine
│   ├── controllers/
│   │   ├── aiController.js        # AI Chat, Cart Health, Compare, Guardian endpoints
│   │   ├── productController.js   # Product catalog filtering & Coupon validation
│   │   └── orderController.js     # Order placement & Admin stats analytics
│   └── routes/
│       └── api.js                 # Express REST API router
└── client/                        # MERN Frontend (React 19 + Vite + Tailwind CSS)
    ├── package.json               # Frontend dependencies (react-router-dom, zustand, lucide-react)
    ├── vite.config.js             # Vite configuration with API proxy to port 5000
    ├── index.html                 # HTML entry point with Google Fonts
    └── src/
        ├── index.css              # Custom styling, Glassmorphism, animations, scrollbars
        ├── main.jsx               # React DOM root renderer
        ├── App.jsx                # Router setup & main layout structure
        ├── store/
        │   └── useStore.js        # Global Zustand state (Cart, AI drawer, Demo runner, Compare)
        ├── services/
        │   └── api.js             # Client API service & mock data fallbacks
        ├── components/
        │   ├── Navbar.jsx         # Glassmorphism header with search & Hackathon Demo trigger
        │   ├── Footer.jsx         # Footer with tech stack badges & live status
        │   ├── ProductCard.jsx    # Card with AI badge, ratings, quick add & compare
        │   ├── AICopilotDrawer.jsx# Floating drawer with proposed actions (Accept/Reject)
        │   ├── AICartHealth.jsx   # AI Cart Health score gauge (0-100) & auto-optimization
        │   ├── CheckoutGuardian.jsx# AI Pre-Checkout Guardian pre-flight review modal
        │   └── DemoScenarioRunner.jsx # Top bar runner for 1-click hackathon demo
        └── pages/
            ├── HomePage.jsx       # Hero section, AI prompt input, categories & trending
            ├── ProductsPage.jsx   # Catalog discovery with price sliders & filter pills
            ├── ProductDetailPage.jsx# Product specs, compatibility, AI suitability rating
            ├── CartPage.jsx       # Smart Cart page featuring Cart Health & coupon box
            ├── CheckoutPage.jsx   # Multi-step checkout & payment simulator (UPI, Card, COD)
            ├── OrderConfirmationPage.jsx# Receipt details & animated 5-stage lifecycle tracker
            ├── AIShopPage.jsx     # Conversational AI shopping hub route
            ├── ComparePage.jsx    # Side-by-side product comparison matrix (2-4 products)
            ├── ArchitecturePage.jsx# Interactive live microservices pipeline flow diagram
            └── AdminPage.jsx      # Admin store intelligence dashboard & AI insights
```

---

## 2. Environment Setup & Configuration

### Environment Variables (`server/.env`):
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/nexora
NODE_ENV=development
```

> **Note**: If `GEMINI_API_KEY` is omitted, NEXORA seamlessly operates using its built-in **Deterministic AI Engine**, providing 100% feature coverage without any API errors.

---

## 3. Installation & How to Run

### Step 1: Install Dependencies
From the root workspace directory, run:

```bash
npm run install-all
```

*(This installs root, server, and client package dependencies)*.

### Step 2: Start Development Server (Client + Server Concurrently)
Run:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend Express API**: `http://localhost:5000`

---

## 4. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve catalog with filters (`category`, `search`, `minPrice`, `maxPrice`, `sort`) |
| `GET` | `/api/products/:id` | Get product by ID along with related accessories |
| `POST` | `/api/coupons/validate` | Validate promo code (e.g., `NEXORA10`) and calculate discount |
| `POST` | `/api/ai/chat` | Send user prompt to Gemini AI assistant & return proposed cart actions |
| `POST` | `/api/ai/cart-health` | Calculate Cart Health Score (0-100), insights, and optimization swaps |
| `POST` | `/api/ai/compare` | Compare 2-4 products with AI winner rationale |
| `POST` | `/api/ai/guardian-check` | Execute AI pre-checkout safety check |
| `POST` | `/api/orders` | Place simulated order & return order receipt |
| `GET` | `/api/orders/:id` | Get order details & status tracking |
| `GET` | `/api/admin/stats` | Fetch store intelligence telemetry, revenue, and AI business insights |

---

## 5. Zustand Global State Model (`useStore.js`)

- `cart`: Array of `{ ...product, quantity }`. Automatically saved in `localStorage`.
- `userBudget`: Target budget limit set by user (Default: ₹75,000).
- `aiCopilotOpen`: Boolean drawer visibility state.
- `aiMessages`: Array of chat messages with sender (`user` or `ai`).
- `proposedActions`: Array of AI suggested modifications waiting for explicit **[Accept] / [Reject]**.
- `compareList`: Array of product IDs being compared.
- `activeArchNode`: Currently highlighted node ID in the Live Architecture View (`/architecture`).
- `demoState`: State tracker for the 1-click 2-min Hackathon Demo scenario runner.
