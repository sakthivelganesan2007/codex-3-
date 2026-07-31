// In-memory persistent order storage for high speed hackathon demonstration
const orders = [];

export const createOrder = (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod, coupon } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart cannot be empty for checkout" });
    }

    const orderId = `NEX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      items,
      total,
      shippingAddress: shippingAddress || { fullName: "Alex Rivera", address: "Tech Park, HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102" },
      paymentMethod: paymentMethod || "UPI",
      coupon: coupon || null,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })
    };

    orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = (req, res) => {
  try {
    const order = orders.find(o => o.orderId === req.params.id);
    if (!order) {
      // Fallback demo order if refreshed directly
      const mockOrder = {
        orderId: req.params.id,
        items: [
          { name: "NexaBook Pro 15 - AI Developer Edition", price: 58999, quantity: 1, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
          { name: "KeyMech Pro RGB Mechanical Keyboard", price: 4499, quantity: 1, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
          { name: "Ergonomic Aluminium Laptop Stand with Cooling", price: 1999, quantity: 1, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" }
        ],
        total: 65497,
        shippingAddress: { fullName: "Alex Rivera", address: "142 Innovation Way, CSE Wing", city: "Bengaluru", state: "Karnataka", pincode: "560102" },
        paymentMethod: "UPI (Google Pay)",
        coupon: { code: "NEXORA10", discount: 3000 },
        status: "Confirmed",
        createdAt: new Date().toISOString(),
        estimatedDelivery: "Monday, Aug 3"
      };
      return res.json({ success: true, order: mockOrder });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = (req, res) => {
  try {
    const totalOrdersCount = orders.length + 142;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 8450000;
    
    res.json({
      success: true,
      stats: {
        totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        totalOrders: totalOrdersCount,
        conversionRate: "4.82%",
        avgCartValue: "₹42,850",
        cartAbandonmentRate: "18.4%",
        aiOptimizationsAccepted: 289,
        topProducts: [
          { name: "NexaBook Pro 15 - AI Developer Edition", sales: 84, revenue: "₹49,55,916" },
          { name: "Titan Beast G15 RTX Gaming Laptop", sales: 62, revenue: "₹49,59,938" },
          { name: "KeyMech Pro RGB Mechanical Keyboard", sales: 145, revenue: "₹6,52,355" },
          { name: "NexaVision 27\" 4K IPS Ergonomic Monitor", sales: 51, revenue: "₹12,74,949" }
        ],
        recentOrders: orders.slice(0, 5),
        aiInsights: [
          { type: "opportunity", title: "Cart Abandonment Drop", text: "Cart abandonment dropped by 14% after implementing the AI Pre-Checkout Guardian savings notification." },
          { type: "trending", title: "High Bundle Conversion", text: "Customers purchasing 'Coding Setup under ₹50k' accept AI Stand & Hub recommendations 88% of the time." },
          { type: "inventory", title: "Low Stock Alert", text: "SmartDesk Motorized Standing Desk stock is down to 7 units. Reorder recommended." }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
