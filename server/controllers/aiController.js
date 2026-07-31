import { processAIChat, calculateCartHealth, compareProductsAI, runCheckoutGuardian } from '../services/geminiService.js';

export const handleAIChat = async (req, res) => {
  try {
    const { prompt, cart = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    const result = await processAIChat(prompt, cart);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCartHealth = (req, res) => {
  try {
    const { cart = [], budget = 75000 } = req.body;
    const health = calculateCartHealth(cart, Number(budget));
    res.json({ success: true, health });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const compareProducts = (req, res) => {
  try {
    const { productIds = [], intent = 'coding' } = req.body;
    const result = compareProductsAI(productIds, intent);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const guardianCheck = (req, res) => {
  try {
    const { cart = [], coupon = null, address = {} } = req.body;
    const guardian = runCheckoutGuardian(cart, coupon, address);
    res.json({ success: true, guardian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
