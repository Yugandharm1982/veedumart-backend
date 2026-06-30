const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve the customer shop page and admin panel as static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);

// Health check - useful when deploying, to confirm the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`VeeduMart backend running at http://localhost:${PORT}`);
  console.log(`Shop:  http://localhost:${PORT}/`);
  console.log(`Admin: http://localhost:${PORT}/admin.html`);
});
