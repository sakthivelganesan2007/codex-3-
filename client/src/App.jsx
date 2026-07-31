import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AICopilotDrawer from './components/AICopilotDrawer';
import DemoScenarioRunner from './components/DemoScenarioRunner';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AIShopPage from './pages/AIShopPage';
import ComparePage from './pages/ComparePage';
import ArchitecturePage from './pages/ArchitecturePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-slate-900 to-blue-950 text-white selection:bg-cyan-500 selection:text-slate-950 font-sans">
        <Navbar />
        <DemoScenarioRunner />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderConfirmationPage />} />
            <Route path="/ai-shop" element={<AIShopPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        <AICopilotDrawer />
        <Footer />
      </div>
    </Router>
  );
}
