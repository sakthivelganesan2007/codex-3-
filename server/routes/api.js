import express from 'express';
import { getProducts, getProductById, validateCoupon } from '../controllers/productController.js';
import { handleAIChat, getCartHealth, compareProducts, guardianCheck } from '../controllers/aiController.js';
import { createOrder, getOrderById, getAdminStats } from '../controllers/orderController.js';

const router = express.Router();

// Products API
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/coupons/validate', validateCoupon);

// AI Copilot & Intelligence API
router.post('/ai/chat', handleAIChat);
router.post('/ai/cart-health', getCartHealth);
router.post('/ai/compare', compareProducts);
router.post('/ai/guardian-check', guardianCheck);

// Orders & Checkout API
router.post('/orders', createOrder);
router.get('/orders/:id', getOrderById);

// Admin Analytics API
router.get('/admin/stats', getAdminStats);

export default router;
