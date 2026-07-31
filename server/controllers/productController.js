import { productsData, couponsData } from '../data/products.js';

export const getProducts = (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let list = [...productsData];

    if (category && category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }

    if (minPrice) {
      list = list.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      list = list.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price-low') {
      list.sort((a,b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a,b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a,b) => b.rating - a.rating);
    }

    res.json({ success: true, count: list.length, products: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = (req, res) => {
  try {
    const product = productsData.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const related = productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    res.json({ success: true, product, related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = couponsData.find(c => c.code.toUpperCase() === (code || '').toUpperCase());

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid promo coupon code' });
    }

    if (cartTotal < coupon.minCartValue) {
      return res.status(400).json({ success: false, message: `Minimum cart value of ₹${coupon.minCartValue.toLocaleString('en-IN')} required for this coupon` });
    }

    let discount = 0;
    if (coupon.discountPercent > 0) {
      discount = Math.min(coupon.maxDiscount, Math.round(cartTotal * (coupon.discountPercent / 100)));
    } else if (coupon.flatDiscount > 0) {
      discount = coupon.flatDiscount;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount,
        description: coupon.description
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
