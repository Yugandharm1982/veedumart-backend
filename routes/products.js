const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/products - list all products (optionally filter by category or search)
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let products = db.get('products').value();

  if (category) {
    products = products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q));
  }
  res.json(products);
});

// GET /api/products/:id - get a single product
router.get('/:id', (req, res) => {
  const product = db.get('products').find({ id: Number(req.params.id) }).value();
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /api/products - add a new product (used by admin panel)
router.post('/', (req, res) => {
  const { name, category, price, mrp, stock, description, image } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'name, category and price are required' });
  }

  const id = db.get('nextProductId').value();
  const product = {
    id,
    name,
    category,
    price: Number(price),
    mrp: Number(mrp || price),
    stock: Number(stock || 0),
    description: description || '',
    image: image || ''
  };

  db.get('products').push(product).write();
  db.set('nextProductId', id + 1).write();

  res.status(201).json(product);
});

// PUT /api/products/:id - edit a product (used by admin panel)
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = db.get('products').find({ id }).value();
  if (!product) return res.status(404).json({ error: 'Product not found' });

  db.get('products')
    .find({ id })
    .assign(req.body)
    .write();

  res.json(db.get('products').find({ id }).value());
});

// DELETE /api/products/:id - remove a product
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('products').remove({ id }).write();
  res.json({ success: true });
});

module.exports = router;
