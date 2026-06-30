const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/orders - place a new order
// Expected body: { customerName, phone, address, items: [{ productId, qty }] }
router.post('/', (req, res) => {
  const { customerName, phone, address, items } = req.body;

  if (!customerName || !phone || !address || !items || !items.length) {
    return res.status(400).json({
      error: 'customerName, phone, address and at least one item are required'
    });
  }

  const products = db.get('products').value();
  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = products.find(p => p.id === Number(item.productId));
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.qty) {
      return res.status(400).json({ error: `${product.name} is out of stock` });
    }
    const lineTotal = product.price * item.qty;
    total += lineTotal;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
      lineTotal
    });
  }

  // Reduce stock for each ordered product
  orderItems.forEach(item => {
    const product = db.get('products').find({ id: item.productId }).value();
    db.get('products')
      .find({ id: item.productId })
      .assign({ stock: product.stock - item.qty })
      .write();
  });

  const id = db.get('nextOrderId').value();
  const order = {
    id,
    customerName,
    phone,
    address,
    items: orderItems,
    total,
    status: 'pending', // pending -> confirmed -> delivered
    createdAt: new Date().toISOString()
  };

  db.get('orders').push(order).write();
  db.set('nextOrderId', id + 1).write();

  res.status(201).json(order);
});

// GET /api/orders - list all orders (used by admin panel)
router.get('/', (req, res) => {
  const orders = db.get('orders').value().slice().reverse(); // newest first
  res.json(orders);
});

// GET /api/orders/:id - get one order
router.get('/:id', (req, res) => {
  const order = db.get('orders').find({ id: Number(req.params.id) }).value();
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// PUT /api/orders/:id/status - update order status (used by admin panel)
router.put('/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
  }

  const order = db.get('orders').find({ id }).value();
  if (!order) return res.status(404).json({ error: 'Order not found' });

  db.get('orders').find({ id }).assign({ status }).write();
  res.json(db.get('orders').find({ id }).value());
});

module.exports = router;
