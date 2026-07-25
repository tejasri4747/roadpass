/* =========================================================
   VEHICLE DATA
   Replace the "img" links and names with your own shop's
   real photos and vehicle names whenever you're ready.
========================================================= */
const VEHICLES = [
  { id: "RP-0101", name: "Royal Cruiser 350",   category: "bike",  img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80" },
  { id: "RP-0102", name: "Street Sport 150",     category: "bike",  img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&q=80" },
  { id: "RP-0103", name: "Trail Runner 200",     category: "bike",  img: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&q=80" },
  { id: "RP-0201", name: "City Scoot Pro",       category: "scooty",img: "https://images.unsplash.com/photo-1607460753797-c9df8ffceb87?w=500&q=80" },
  { id: "RP-0202", name: "Urban Glide 110",      category: "scooty",img: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=500&q=80" },
  { id: "RP-0301", name: "Sedan Comfort",        category: "car",   img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80" },
  { id: "RP-0302", name: "Hatchback Easy",       category: "car",   img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&q=80" },
  { id: "RP-0303", name: "SUV Explorer",         category: "car",   img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80" },
  { id: "RP-0401", name: "Mini Bus 12-Seater",   category: "bus",   img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80" },
  { id: "RP-0402", name: "Mini Bus 20-Seater",   category: "bus",   img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&q=80" },
];

const CATEGORY_LABEL = { bike: "BIKE", scooty: "SCOOTY", car: "CAR", bus: "MINI BUS" };

const grid = document.getElementById("fleet-grid");
const statCount = document.getElementById("stat-count");
const tabs = document.querySelectorAll(".tab");

function renderFleet(filter = "all") {
  grid.innerHTML = "";
  const list = filter === "all" ? VEHICLES : VEHICLES.filter(v => v.category === filter);

  list.forEach(v => {
    const card = document.createElement("div");
    card.className = "ticket-card";
    card.innerHTML = `
      <div class="ticket-top">
        <span class="ticket-label">RoadPass</span>
        <span class="ticket-code">${v.id}</span>
      </div>
      <img src="${v.img}" alt="${v.name}" loading="lazy">
      <div class="ticket-mid">
        <h3>${v.name}</h3>
        <p class="tag">${CATEGORY_LABEL[v.category]}</p>
      </div>
      <div class="ticket-perforation"></div>
      <div class="ticket-stub">
        <div>
          <span class="stub-label">From</span>
          <span class="stub-value">₹500/day</span>
        </div>
        <div>
          <span class="stub-label">Status</span>
          <span class="stub-value">Available</span>
        </div>
      </div>
      <button class="book-btn" data-id="${v.id}">Book this ${v.category}</button>
    `;
    grid.appendChild(card);
  });

  let n = 0;
  const target = list.length;
  const timer = setInterval(() => {
    n++;
    statCount.textContent = n;
    if (n >= target) clearInterval(timer);
  }, 40);
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderFleet(tab.dataset.filter);
  });
});

renderFleet();

/* =========================================================
   BOOKING MODAL
========================================================= */
const overlay = document.getElementById("modal-overlay");
const modalTicket = document.getElementById("modal-ticket-content");
const modalClose = document.getElementById("modal-close");
const tripType = document.getElementById("trip-type");
const numDays = document.getElementById("num-days");
const totalAmount = document.getElementById("total-amount");

let currentVehicle = null;

grid.addEventListener("click", (e) => {
  if (!e.target.classList.contains("book-btn")) return;
  const id = e.target.dataset.id;
  currentVehicle = VEHICLES.find(v => v.id === id);
  openModal(currentVehicle);
});

function openModal(v) {
  modalTicket.innerHTML = `
    <h3>${v.name}</h3>
    <p class="tag">${CATEGORY_LABEL[v.category]} · ${v.id}</p>
  `;
  updateTotal();
  overlay.classList.add("open");
}

modalClose.addEventListener("click", () => overlay.classList.remove("open"));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.remove("open");
});

function updateTotal() {
  const rate = Number(tripType.value);
  const days = Math.max(1, Number(numDays.value) || 1);
  totalAmount.textContent = `₹${rate * days}`;
}
tripType.addEventListener("change", updateTotal);
numDays.addEventListener("input", updateTotal);

/* =========================================================
   PAYMENT — Demo mode (client-side prototype)
   Stores bookings and reviews in localStorage; generates a simple invoice window
========================================================= */

const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");
const aadharFile = document.getElementById("aadhar-file");
const licenseFile = document.getElementById("license-file");
const ratingInput = document.getElementById("rating");
const reviewInput = document.getElementById("review");

const loginBtn = document.getElementById("login-btn");
const accountBtn = document.getElementById("account-btn");
const accountOverlay = document.getElementById("account-overlay");
const accountClose = document.getElementById("account-close");
const bookingsList = document.getElementById("bookings-list");
const shopReviews = document.getElementById("shop-reviews");

function loadUser() {
  const u = localStorage.getItem('roadpass_user');
  if (u) return JSON.parse(u);
  return null;
}

function saveUser(u) { localStorage.setItem('roadpass_user', JSON.stringify(u)); }

function updateUserUI() {
  const u = loadUser();
  if (u) {
    loginBtn.textContent = `Hi, ${u.name}`;
    accountBtn.style.display = 'inline-block';
  } else {
    loginBtn.textContent = 'Login';
    accountBtn.style.display = 'none';
  }
}

loginBtn.addEventListener('click', () => {
  let u = loadUser();
  if (u) {
    const ok = confirm('Log out ' + u.name + '?');
    if (ok) { localStorage.removeItem('roadpass_user'); currentUser = null; updateUserUI(); }
    return;
  }
  const name = prompt('Enter your name (demo)');
  if (!name) return;
  const phone = prompt('Enter your phone (10 digits)');
  if (!phone) return;
  const user = { name, phone };
  saveUser(user);
  currentUser = user;
  updateUserUI();
});

accountBtn.addEventListener('click', () => {
  renderBookings();
  renderShopReviews();
  accountOverlay.classList.add('open');
});
accountClose.addEventListener('click', () => accountOverlay.classList.remove('open'));
accountOverlay.addEventListener('click', (e) => { if (e.target === accountOverlay) accountOverlay.classList.remove('open'); });

function parseDaysFromDates() {
  if (startDate && endDate && startDate.value && endDate.value) {
    const s = new Date(startDate.value);
    const e = new Date(endDate.value);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return Math.max(1, diff);
  }
  return Math.max(1, Number(numDays.value) || 1);
}

function updateTotal() {
  const rate = Number(tripType.value);
  const days = parseDaysFromDates();
  numDays.value = days;
  totalAmount.textContent = `₹${rate * days}`;
}

tripType.addEventListener("change", updateTotal);
numDays.addEventListener("input", updateTotal);
startDate?.addEventListener('change', updateTotal);
endDate?.addEventListener('change', updateTotal);

function saveBookingRecord(b) {
  const key = 'roadpass_bookings';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(b);
  localStorage.setItem(key, JSON.stringify(existing));
}

function saveReviewRecord(r) {
  const key = 'roadpass_reviews';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(r);
  localStorage.setItem(key, JSON.stringify(existing));
}

function generateInvoice(booking) {
  const w = window.open('', '_blank');
  const html = `
    <html><head><title>Invoice ${booking.invoiceId}</title>
    <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111}h1{color:#333}</style>
    </head><body>
    <h1>RoadPass Invoice</h1>
    <p><strong>Invoice:</strong> ${booking.invoiceId}</p>
    <p><strong>Name:</strong> ${booking.name}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <p><strong>Vehicle:</strong> ${booking.vehicleName} (${booking.vehicleId})</p>
    <p><strong>Trip:</strong> ${booking.tripLabel}</p>
    <p><strong>Dates:</strong> ${booking.startDate} → ${booking.endDate} (${booking.days} days)</p>
    <p><strong>Amount:</strong> ${booking.amount}</p>
    <hr>
    <p>Thank you for using RoadPass (demo). This is a client-side generated invoice.</p>
    <script>window.print()</script>
    </body></html>
  `;
  w.document.write(html);
  w.document.close();
}

function renderBookings() {
  const key = 'roadpass_bookings';
  const all = JSON.parse(localStorage.getItem(key) || '[]');
  const u = loadUser();
  const list = all.filter(b => u && b.phone === u.phone);
  if (!list.length) {
    bookingsList.innerHTML = '<p>No bookings yet. Book a ride to see it here.</p>';
    return;
  }
  bookingsList.innerHTML = '';
  list.reverse().forEach(b => {
    const el = document.createElement('div');
    el.style.border = '1px dashed rgba(255,255,255,0.06)';
    el.style.padding = '10px';
    el.style.marginBottom = '10px';
    el.innerHTML = `<strong>${b.vehicleName} (${b.vehicleId})</strong><br>
      ${b.startDate} → ${b.endDate} · ${b.days} days · ${b.amount}<br>
      <small>Booked: ${new Date(b.createdAt).toLocaleString()}</small>
      <div style="margin-top:8px"><button class="btn btn-ghost small" data-invoice="${b.invoiceId}">Download Invoice</button></div>`;
    const btn = el.querySelector('button[data-invoice]');
    btn.addEventListener('click', () => generateInvoice(b));
    bookingsList.appendChild(el);
  });
}

function renderShopReviews() {
  const key = 'roadpass_reviews';
  const all = JSON.parse(localStorage.getItem(key) || '[]');
  if (!all.length) { shopReviews.innerHTML = '<p>No reviews yet.</p>'; return; }
  const avg = (all.reduce((s,r)=>s+Number(r.rating),0)/all.length).toFixed(1);
  shopReviews.innerHTML = `<p>Average rating: ${avg} / 5 (${all.length} reviews)</p>`;
  const container = document.createElement('div');
  all.slice(-5).reverse().forEach(r => {
    const d = document.createElement('div');
    d.style.borderTop = '1px solid rgba(255,255,255,0.04)';
    d.style.padding = '8px 0';
    d.innerHTML = `<strong>${r.name}</strong> · ${r.rating}/5<br><small>${r.text || ''}</small>`;
    container.appendChild(d);
  });
  shopReviews.appendChild(container);
}

// Payment handling: collect fields, mock success, persist booking & review, generate invoice
document.getElementById("pay-btn").addEventListener("click", () => {
  const user = loadUser();
  const name = document.getElementById("cust-name").value;
  const phone = document.getElementById("cust-phone").value;
  if (!name || !phone) { alert("Please fill in your name and phone number first."); return; }
  if (!currentVehicle) { alert('No vehicle selected.'); return; }
  // collect dates and days
  const sDate = startDate.value || '';
  const eDate = endDate.value || '';
  const days = parseDaysFromDates();
  const tripLabel = tripType.options[tripType.selectedIndex].text;
  const amount = totalAmount.textContent;

  // demo: record filenames only
  const aadharName = aadharFile.files && aadharFile.files[0] ? aadharFile.files[0].name : '';
  const licenceName = licenseFile.files && licenseFile.files[0] ? licenseFile.files[0].name : '';

  const invoiceId = 'INV-' + Date.now().toString(36).toUpperCase();
  const booking = {
    invoiceId,
    vehicleId: currentVehicle.id,
    vehicleName: currentVehicle.name,
    name, phone,
    tripLabel,
    startDate: sDate, endDate: eDate, days,
    amount,
    aadharName, licenceName,
    createdAt: Date.now()
  };

  // mock payment success
  alert(`✓ Demo Payment Successful!\n\nName: ${name}\nPhone: ${phone}\nAmount: ${amount}`);

  saveBookingRecord(booking);

  // save review if provided
  const rating = ratingInput && ratingInput.value ? ratingInput.value : null;
  const text = reviewInput && reviewInput.value ? reviewInput.value.trim() : '';
  if (rating || text) {
    saveReviewRecord({ vehicleId: currentVehicle.id, name, rating: rating || 5, text, createdAt: Date.now() });
  }

  // Close the booking modal
  document.getElementById("modal-overlay").classList.remove("open");

  // ensure user stored
  if (!user) { saveUser({ name, phone }); currentUser = { name, phone }; updateUserUI(); }

  // open invoice
  generateInvoice(booking);

  // update account UI
  updateUserUI();
});

// On load: bind account UI
let currentUser = loadUser();
updateUserUI();
renderShopReviews();

// Expose a small helper to open booking modal from ticket
function openModal(v) {
  modalTicket.innerHTML = `
    <h3>${v.name}</h3>
    <p class="tag">${CATEGORY_LABEL[v.category]} · ${v.id}</p>
  `;
  // prefill user details if available
  const u = loadUser();
  if (u) {
    document.getElementById('cust-name').value = u.name;
    document.getElementById('cust-phone').value = u.phone;
  }
  updateTotal();
  overlay.classList.add("open");
}

// replace previous grid click handler to use new openModal
grid.addEventListener("click", (e) => {
  if (!e.target.classList.contains("book-btn")) return;
  const id = e.target.dataset.id;
  currentVehicle = VEHICLES.find(v => v.id === id);
  openModal(currentVehicle);
});
