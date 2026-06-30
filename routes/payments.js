// Payment integration with Razorpay.
//
// HOW TO ACTIVATE REAL PAYMENTS:
// 1. Sign up at https://razorpay.com and complete business KYC (PAN, bank details).
// 2. Get your Key ID and Key Secret from the Razorpay dashboard (Settings > API Keys).
// 3. Create a .env file in this project (copy .env.example) and paste your keys in.
// 4. Run: npm install razorpay
// 5. Uncomment the real implementation below and remove the "DEMO MODE" block.
//
// Until you do that, this route runs in DEMO MODE: it doesn't move any real
// money, but lets you test the full checkout flow end-to-end.

const express = require('express');
const router = express.Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const DEMO_MODE = !RAZORPAY_KEY_ID;

// POST /api/payments/create-order
// Body: { amount } -- amount in rupees
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'A valid amount is required' });
  }

  if (DEMO_MODE) {
    // Fake order so you can build/test your checkout UI before going live.
    return res.json({
      demoMode: true,
      orderId: 'demo_order_' + Date.now(),
      amount,
      message:
        'Running in demo mode. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env to process real payments.'
    });
  }

  // ---- REAL RAZORPAY IMPLEMENTATION (uncomment once you have keys) ----
  // const Razorpay = require('razorpay');
  // const instance = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET
  // });
  // const order = await instance.orders.create({
  //   amount: amount * 100, // Razorpay needs paise, not rupees
  //   currency: 'INR',
  //   receipt: 'order_' + Date.now()
  // });
  // res.json({ demoMode: false, orderId: order.id, amount, key: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
