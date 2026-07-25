const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// simple file upload endpoint
const upload = multer({ dest: path.join(__dirname, 'uploads') });
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ filename: req.file.filename, original: req.file.originalname });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// simple invoice endpoint - generates a tiny PDF
app.get('/api/invoice/:invoiceId', async (req, res) => {
  const invoiceId = req.params.invoiceId;
  const booking = await db.getBookingByInvoice(invoiceId);
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceId}.pdf`);
  doc.text('RoadPass Invoice', { align: 'center' });
  doc.moveDown();
  doc.text(`Invoice: ${invoiceId}`);
  doc.text(`Name: ${booking.name}`);
  doc.text(`Phone: ${booking.phone}`);
  doc.text(`Vehicle: ${booking.vehicleName} (${booking.vehicleId})`);
  doc.text(`Dates: ${booking.startDate} → ${booking.endDate} (${booking.days} days)`);
  doc.text(`Amount: ${booking.amount}`);
  doc.end();
  doc.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
