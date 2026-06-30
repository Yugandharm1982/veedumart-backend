const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/banners - public: only active banners. Admin can pass ?all=true to see hidden ones too.
router.get('/', (req, res) => {
  const all = req.query.all === 'true';
  let banners = db.get('banners').value();
  if (!all) {
    banners = banners.filter(b => b.active);
  }
  res.json(banners);
});

// POST /api/banners - add a new banner (admin only)
router.post('/', (req, res) => {
  const { title, subtitle, bgColor, textColor, imageUrl, active } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const id = db.get('nextBannerId').value();
  const banner = {
    id,
    title,
    subtitle: subtitle || '',
    bgColor: bgColor || '#0F6E56',
    textColor: textColor || '#FFFFFF',
    imageUrl: imageUrl || '',
    active: active !== undefined ? active : true
  };

  db.get('banners').push(banner).write();
  db.set('nextBannerId', id + 1).write();
  res.status(201).json(banner);
});

// PUT /api/banners/:id - edit a banner (admin only)
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const banner = db.get('banners').find({ id }).value();
  if (!banner) return res.status(404).json({ error: 'Banner not found' });

  db.get('banners').find({ id }).assign(req.body).write();
  res.json(db.get('banners').find({ id }).value());
});

// DELETE /api/banners/:id - remove a banner (admin only)
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('banners').remove({ id }).write();
  res.json({ success: true });
});

module.exports = router;
