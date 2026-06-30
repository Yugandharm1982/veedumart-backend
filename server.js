const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const bannersRouter = require('./routes/banners');
const addressesRouter = require('./routes/addresses');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Simple password protection for the admin area ---
// Set ADMIN_USER and ADMIN_PASSWORD as environment variables (Render: Environment tab).
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'veedumart123';

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="VeeduMart Admin"');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [user, password] = credentials.split(':');

  if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="VeeduMart Admin"');
  return res.status(401).send('Invalid credentials.');
}

// Protect the admin page itself
app.get('/admin.html', requireAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Products: anyone can GET or submit a review, only admin can add/edit/delete
app.use('/api/products', (req, res, next) => {
  if (req.method === 'GET') return next();
  if (req.method === 'POST' && req.path.endsWith('/reviews')) return next();
  return requireAdminAuth(req, res, next);
});

// Orders: anyone can place an order (POST), only admin can view/update orders
app.use('/api/orders', (req, res, next) => {
  if (req.method === 'POST') return next();
  return requireAdminAuth(req, res, next);
});

// Banners: anyone can view active banners, only admin can manage them
app.use('/api/banners', (req, res, next) => {
  if (req.method === 'GET') return next();
  return requireAdminAuth(req, res, next);
});

// Addresses: fully open to customers (tied to their own phone number, no admin needed)
// No auth middleware needed here.

// Serve the rest of the public files (shop page, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/addresses', addressesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`VeeduMart backend running at http://localhost:${PORT}`);
  console.log(`Shop:  http://localhost:${PORT}/`);
  console.log(`Admin: http://localhost:${PORT}/admin.html`);
});
