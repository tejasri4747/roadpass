/* =========================================================
   AUTHENTICATION SYSTEM
========================================================= */

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authTabs = document.querySelectorAll(".auth-tab");
const authForms = document.querySelectorAll(".auth-form");

// Tab switching
authTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    authTabs.forEach(t => t.classList.remove("active"));
    authForms.forEach(f => f.classList.remove("active"));
    tab.classList.add("active");
    const tabName = tab.dataset.tab;
    document.getElementById(tabName + "-form").classList.add("active");
  });
});

// LOGIN
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (password !== "123") {
    alert("Invalid password (use '123' for demo)");
    return;
  }

  const user = {
    email: email,
    name: email.split("@")[0],
    phone: "9999999999",
    loginTime: new Date().toISOString()
  };

  localStorage.setItem("roadpass_user", JSON.stringify(user));
  window.location.href = "dashboard.html";
});

// SIGNUP
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const phone = document.getElementById("signup-phone").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (password !== confirm) {
    alert("Passwords don't match");
    return;
  }

  const user = {
    name: name,
    email: email,
    phone: phone,
    joinDate: new Date().toISOString()
  };

  localStorage.setItem("roadpass_user", JSON.stringify(user));
  localStorage.setItem("roadpass_bookings", JSON.stringify([]));
  localStorage.setItem("roadpass_reviews", JSON.stringify([]));
  localStorage.setItem("roadpass_docs", JSON.stringify({}));

  alert("Account created! Redirecting...");
  window.location.href = "dashboard.html";
});
