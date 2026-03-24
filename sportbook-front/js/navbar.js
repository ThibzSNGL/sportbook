const user = JSON.parse(localStorage.getItem("sportbook_user") || "null");
const adminLink = document.getElementById("admin-link");

if (user && user.role === "admin" && adminLink) {
  adminLink.style.display = "inline-flex";
}