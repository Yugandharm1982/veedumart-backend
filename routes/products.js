const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let products = db.get('products').value();

  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q));
  }
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = db.get('products').find({ id: Number(req.params.id) }).value();
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', (req, res) => {
  const { name, category, price, mrp, stock, description, image, pros, cons, videoUrl } = req.body;
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
    image: image || '',
    pros: pros || [],
    cons: cons || [],
    videoUrl: videoUrl || '',
    reviews: []
  };

  db.get('products').push(product).write();
  db.set('nextProductId', id + 1).write();
  res.status(201).json(product);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = db.get('products').find({ id }).value();
  if (!product) return res.status(404).json({ error: 'Product not found' });

  db.get('products').find({ id }).assign(req.body).write();
  res.json(db.get('products').find({ id }).value());
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('products').remove({ id }).write();
  res.json({ success: true });
});

// POST /api/products/:id/reviews - customer submits a review (open to public)
router.post('/:id/reviews', (req, res) => {
  const id = Number(req.params.id);
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ error: 'name, rating and comment are required' });
  }
  const product = db.get('products').find({ id }).value();
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const review = {
    name,
    rating: Math.max(1, Math.min(5, Number(rating))),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  db.get('products').find({ id }).get('reviews').push(review).write();
  res.status(201).json(review);
});

module.exports = router;
