const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'roadpass-dev-secret';

const router = express.Router();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
}

router.post('/', async (req, res) => {
  // create booking (no auth required for demo)
  const b = req.body;
  if (!b || !b.invoiceId) return res.status(400).json({ error: 'Missing booking data' });
  await db.createBooking(b);
  res.json({ ok: true });
});

router.get('/', authMiddleware, async (req, res) => {
  const phone = req.user.phone;
  const list = await db.getBookingsByPhone(phone);
  res.json(list);
});

module.exports = router;
