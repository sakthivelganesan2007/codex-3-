# ⚡ NEXORA — AI-Native Adaptive Commerce

> **Hackathon Submission Theme**: *"E-commerce storefront featuring cart and checkout"*  
> **Tech Stack**: MERN (MongoDB / Express.js / React 19 / Node.js) + Google Gemini AI + Tailwind CSS + Framer Motion + Zustand

---

## 🌟 Overview

**NEXORA** is a hackathon-ready full-stack application that reimagines traditional e-commerce into an intelligent, goal-driven shopping experience. Instead of endlessly browsing static catalogs, customers can converse with an **AI Shopping Assistant** to generate complete, compatible hardware rigs within strict budget constraints (in ₹ INR), diagnose cart quality using an **AI Cart Health Score (0–100)**, execute **1-Click Auto-Optimizations**, and pass through an **AI Pre-Checkout Guardian**.

---

## ✨ Key Features

1. **Natural Language Setup Builder**: e.g., *"Build me a complete CSE coding setup under ₹50,000"* or *"Gaming rig under ₹80k, prioritize GPU"*.
2. **AI Proposed Cart Actions**: Visual proposed modifications with clear cost impacts and explicit **Accept / Reject** approval controls.
3. **Smart Cart & Cart Health Score (0–100)**: Real-time diagnostic engine evaluating budget compliance, component compatibility, duplicates, and savings.
4. **"Optimize My Cart"**: Automatically identifies spec-matched lower-cost hardware replacements.
5. **Product Comparison Matrix (`/compare`)**: Side-by-side spec comparison for 2–4 products with **"Ask AI which one is better for me"**.
6. **Multi-Step Checkout & AI Checkout Guardian (`/checkout`)**: Pre-payment safety review checking inventory, ports compatibility, pincode delivery, and missed coupons.
7. **Order Confirmation & Animated Lifecycle Tracker (`/order/:id`)**: Real-time status transitions (*Confirmed → Packed → Shipped → Out for Delivery → Delivered*).
8. **Live Commerce Architecture View (`/architecture`)**: Interactive microservice pipeline visualization with active node highlighting.
9. **Admin Intelligence Dashboard (`/admin`)**: Store metrics, cart abandonment insights, and AI recommendations.
10. **1-Click Hackathon Demo Mode**: Visual end-to-end user story walkthrough executable in 2–3 minutes.

---

## 🚀 Quick Start Guide

### 1. Install All Dependencies
```bash
npm run install-all
```

### 2. Start Application (Client + Server Concurrently)
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend Express API**: `http://localhost:5000`

---

## 📚 Documentation Suite

Check the [`docs/`](./docs/) directory for detailed project specifications:
- [`docs/IDEA_DOCUMENTATION.md`](./docs/IDEA_DOCUMENTATION.md) — Product vision, target audience, problem statement, key differentiators.
- [`docs/SOLUTION_DOCUMENTATION.md`](./docs/SOLUTION_DOCUMENTATION.md) — System architecture, Gemini AI prompt strategy & JSON contracts, Cart Health math.
- [`docs/BASE_CODE_DOCUMENTATION.md`](./docs/BASE_CODE_DOCUMENTATION.md) — File structure, API contracts, environment setup, state model.
