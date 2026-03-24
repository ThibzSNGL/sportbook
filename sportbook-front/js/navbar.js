const user = JSON.parse(localStorage.getItem("sportbook_user") || "null");
const adminLink = document.getElementById("admin-link");
const loginBtn = document.getElementById("login-btn");

if (user && user.role === "admin" && adminLink) {
  adminLink.style.display = "inline-flex";
}

if (user && loginBtn) {
  loginBtn.textContent = "Se déconnecter";
  loginBtn.href = "#";

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("sportbook_token");
    localStorage.removeItem("sportbook_user");
    window.location.href = "login.html";
  });
}