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
   PAYMENT — Razorpay integration
   See README.md "Step 7: Add a real payment gateway".
========================================================= */
document.getElementById("pay-btn").addEventListener("click", () => {
  const name = document.getElementById("cust-name").value;
  const phone = document.getElementById("cust-phone").value;
  const amount = totalAmount.textContent.replace("₹", "");
  
  if (!name || !phone) {
    alert("Please fill in your name and phone number first.");
    return;
  }

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID", // Replace with your key from Razorpay dashboard
    amount: amount * 100, // Convert to paise
    currency: "INR",
    name: "RoadPass",
    description: "Vehicle Rental Booking",
    prefill: {
      name: name,
      contact: phone
    },
    handler: function(response) {
      alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    },
    modal: {
      ondismiss: function() {
        alert("Payment cancelled.");
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});

// Load Razorpay script
const script = document.createElement("script");
script.src = "https://checkout.razorpay.com/v1/checkout.js";
document.head.appendChild(script);
