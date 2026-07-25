const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  const r = req.body;
  if (!r || !r.name) return res.status(400).json({ error: 'Missing review fields' });
  r.createdAt = Date.now();
  await db.saveReview(r);
  res.json({ ok: true });
});

router.get('/', async (req, res) => {
  const list = await db.getReviews(100);
  res.json(list);
});

module.exports = router;
