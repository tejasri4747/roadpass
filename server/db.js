const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbPromise = open({ filename: path.join(__dirname, 'roadpass.db'), driver: sqlite3.Database });

async function init() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT UNIQUE,
      password_hash TEXT
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceId TEXT UNIQUE,
      vehicleId TEXT,
      vehicleName TEXT,
      name TEXT,
      phone TEXT,
      tripLabel TEXT,
      startDate TEXT,
      endDate TEXT,
      days INTEGER,
      amount TEXT,
      aadharName TEXT,
      licenceName TEXT,
      createdAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleId TEXT,
      name TEXT,
      rating INTEGER,
      text TEXT,
      createdAt INTEGER
    );
  `);
}

async function createUser(name, phone, passwordHash) {
  const db = await dbPromise;
  const res = await db.run('INSERT INTO users (name,phone,password_hash) VALUES (?,?,?)', [name, phone, passwordHash]);
  return res.lastID;
}

async function findUserByPhone(phone) {
  const db = await dbPromise;
  return db.get('SELECT * FROM users WHERE phone = ?', phone);
}

async function createBooking(b) {
  const db = await dbPromise;
  await db.run(
    `INSERT INTO bookings (invoiceId,vehicleId,vehicleName,name,phone,tripLabel,startDate,endDate,days,amount,aadharName,licenceName,createdAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [b.invoiceId,b.vehicleId,b.vehicleName,b.name,b.phone,b.tripLabel,b.startDate,b.endDate,b.days,b.amount,b.aadharName,b.licenceName,b.createdAt]
  );
}

async function getBookingsByPhone(phone) {
  const db = await dbPromise;
  return db.all('SELECT * FROM bookings WHERE phone = ? ORDER BY createdAt DESC', phone);
}

async function getBookingByInvoice(invoiceId) {
  const db = await dbPromise;
  return db.get('SELECT * FROM bookings WHERE invoiceId = ?', invoiceId);
}

async function saveReview(r) {
  const db = await dbPromise;
  await db.run('INSERT INTO reviews (vehicleId,name,rating,text,createdAt) VALUES (?,?,?,?,?)', [r.vehicleId,r.name,r.rating,r.text,r.createdAt]);
}

async function getReviews(limit = 50) {
  const db = await dbPromise;
  return db.all('SELECT * FROM reviews ORDER BY createdAt DESC LIMIT ?', limit);
}

init();

module.exports = { createUser, findUserByPhone, createBooking, getBookingsByPhone, getBookingByInvoice, saveReview, getReviews };
