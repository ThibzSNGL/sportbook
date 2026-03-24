const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authMessage = document.getElementById("auth-message");

function showAuthMessage(text, type) {
if (!authMessage) return;
authMessage.textContent = text;
authMessage.className = "message " + type;
}

function saveToken(token) {
localStorage.setItem("sportbook_token", token);
}

function getToken() {
return localStorage.getItem("sportbook_token");
}

function logout() {
localStorage.removeItem("sportbook_token");
window.location.href = "login.html";
}

if (loginForm) {
loginForm.addEventListener("submit", function(e) {
e.preventDefault();

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

if (!email || !password) {
showAuthMessage("Veuillez remplir tous les champs.", "error");
return;
}

showAuthMessage("Connexion simulée réussie. Vous pouvez maintenant continuer votre navigation.", "success");

saveToken("fake-jwt-token");
setTimeout(() => {
window.location.href = "terrains.html";
}, 1200);
});
}

if (registerForm) {
registerForm.addEventListener("submit", function(e) {
e.preventDefault();

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const confirmPassword = document.getElementById("confirm-password").value.trim();

if (!name || !email || !password || !confirmPassword) {
showAuthMessage("Veuillez remplir tous les champs.", "error");
return;
}

if (password !== confirmPassword) {
showAuthMessage("Les mots de passe ne correspondent pas.", "error");
return;
}

if (password.length < 6) {
showAuthMessage("Le mot de passe doit contenir au moins 6 caractères.", "error");
return;
}

showAuthMessage("Inscription simulée réussie. Vous allez être redirigé.", "success");

setTimeout(() => {
window.location.href = "login.html";
}, 1200);
});
}