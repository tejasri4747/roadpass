/* =========================================================
   DASHBOARD & USER MANAGEMENT
========================================================= */

const user = JSON.parse(localStorage.getItem("roadpass_user")) || null;

if (!user) {
  window.location.href = "auth.html";
}

// Display user info
document.getElementById("user-name").textContent = user.name || user.email.split("@")[0];
document.getElementById("user-email").textContent = user.email;

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("roadpass_user");
  window.location.href = "index.html";
});

// Tab switching
const dashTabs = document.querySelectorAll(".dash-tab");
const dashContents = document.querySelectorAll(".dash-content");

dashTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    dashTabs.forEach(t => t.classList.remove("active"));
    dashContents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    const section = tab.dataset.section + "-section";
    document.getElementById(section).classList.add("active");
  });
});

/* =========================================================
   BOOKINGS
========================================================= */

function renderBookings() {
  const bookings = JSON.parse(localStorage.getItem("roadpass_bookings")) || [];
  const bookingsList = document.getElementById("bookings-list");
  
  if (bookings.length === 0) {
    bookingsList.innerHTML = "<p>No bookings yet. <a href='index.html'>Book a vehicle now!</a></p>";
    return;
  }

  bookingsList.innerHTML = bookings.map(b => `
    <div class="booking-card">
      <div class="booking-header">
        <h3>${b.vehicleName}</h3>
        <span class="status ${b.status}">${b.status}</span>
      </div>
      <img src="${b.vehicleImg}" alt="${b.vehicleName}" style="height: 150px; object-fit: cover; width: 100%; border-radius: 8px; margin: 10px 0;">
      <div class="booking-details">
        <p><strong>ID:</strong> ${b.bookingId}</p>
        <p><strong>Dates:</strong> ${new Date(b.startDate).toLocaleDateString()} to ${new Date(b.endDate).toLocaleDateString()}</p>
        <p><strong>Days:</strong> ${b.days}</p>
        <p><strong>Total:</strong> ${b.total}</p>
        <p><strong>Booked:</strong> ${new Date(b.bookedDate).toLocaleString()}</p>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button class="btn btn-amber small" onclick="downloadInvoice('${b.bookingId}')">📄 Invoice</button>
        <button class="btn btn-ghost small" onclick="reviewBooking('${b.vehicleName}')">⭐ Review</button>
      </div>
    </div>
  `).join("");
}

/* =========================================================
   DOCUMENTS
========================================================= */

function loadDocumentPreviews() {
  const docs = JSON.parse(localStorage.getItem("roadpass_docs")) || {};
  
  if (docs.aadhar) {
    document.getElementById("aadhar-preview").innerHTML = `<img src="${docs.aadhar}" style="max-height: 200px;">`;
  }
  if (docs.license) {
    document.getElementById("license-preview").innerHTML = `<img src="${docs.license}" style="max-height: 200px;">`;
  }
}

document.getElementById("aadhar-input").addEventListener("change", (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("aadhar-preview").innerHTML = `<img src="${reader.result}" style="max-height: 200px;">`;
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("license-input").addEventListener("change", (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("license-preview").innerHTML = `<img src="${reader.result}" style="max-height: 200px;">`;
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("save-docs-btn").addEventListener("click", () => {
  const aadharImg = document.getElementById("aadhar-preview").querySelector("img");
  const licenseImg = document.getElementById("license-preview").querySelector("img");
  
  const docs = {
    aadhar: aadharImg ? aadharImg.src : "",
    license: licenseImg ? licenseImg.src : "",
    uploadDate: new Date().toISOString()
  };

  localStorage.setItem("roadpass_docs", JSON.stringify(docs));
  alert("Documents saved successfully!");
});

/* =========================================================
   REVIEWS
========================================================= */

document.getElementById("review-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const rating = document.querySelector("input[name='rating']:checked").value;
  const text = document.getElementById("review-text").value;

  const reviews = JSON.parse(localStorage.getItem("roadpass_reviews")) || [];
  reviews.push({
    id: Date.now(),
    rating: rating,
    text: text,
    author: user.name,
    date: new Date().toISOString()
  });

  localStorage.setItem("roadpass_reviews", JSON.stringify(reviews));
  document.getElementById("review-form").reset();
  renderReviews();
  alert("Review posted!");
});

function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem("roadpass_reviews")) || [];
  const reviewsList = document.getElementById("reviews-list");

  if (reviews.length === 0) {
    reviewsList.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
    return;
  }

  reviewsList.innerHTML = reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map(r => `
    <div class="review-card">
      <div class="review-header">
        <strong>${r.author}</strong>
        <span class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
      </div>
      <p>${r.text}</p>
      <small>${new Date(r.date).toLocaleDateString()}</small>
    </div>
  `).join("");
}

/* =========================================================
   INVOICE GENERATION
========================================================= */

function downloadInvoice(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("roadpass_bookings")) || [];
  const booking = bookings.find(b => b.bookingId === bookingId);

  if (!booking) return;

  const invoiceContent = `
ROADPASS VEHICLE RENTAL INVOICE
================================

Invoice #: ${bookingId}
Date: ${new Date().toLocaleDateString()}
Customer: ${user.name}
Email: ${user.email}
Phone: ${user.phone}

BOOKING DETAILS
===============
Vehicle: ${booking.vehicleName}
Category: ${booking.category}
Booking ID: ${booking.bookingId}

RENTAL PERIOD
=============
From: ${new Date(booking.startDate).toLocaleDateString()}
To: ${new Date(booking.endDate).toLocaleDateString()}
Days: ${booking.days}

PAYMENT
=======
Rate per day: ₹${booking.ratePerDay}
Total Amount: ${booking.total}
Status: ${booking.status}

Booking Date: ${new Date(booking.bookedDate).toLocaleString()}

Thank you for choosing RoadPass!
  `;

  const blob = new Blob([invoiceContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${bookingId}.txt`;
  a.click();
}

/* =========================================================
   SETTINGS
========================================================= */

document.getElementById("settings-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("settings-name").value;
  const email = document.getElementById("settings-email").value;
  const phone = document.getElementById("settings-phone").value;

  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  localStorage.setItem("roadpass_user", JSON.stringify(user));
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("user-email").textContent = user.email;
  alert("Settings updated!");
});

// Load settings form
document.getElementById("settings-name").value = user.name || "";
document.getElementById("settings-email").value = user.email || "";
document.getElementById("settings-phone").value = user.phone || "";

// Initialize
renderBookings();
loadDocumentPreviews();
renderReviews();
