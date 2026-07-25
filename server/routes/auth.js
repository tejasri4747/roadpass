const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'roadpass-dev-secret';

router.post('/register', async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ error: 'Missing fields' });
  const existing = await db.findUserByPhone(phone);
  if (existing) return res.status(400).json({ error: 'Phone already registered' });
  const hash = await bcrypt.hash(password, 10);
  await db.createUser(name, phone, hash);
  res.json({ ok: true });
});

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = await db.findUserByPhone(phone);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, phone: user.phone, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, name: user.name, phone: user.phone });
});

module.exports = router;
