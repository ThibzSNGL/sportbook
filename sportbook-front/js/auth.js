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

function saveUser(user) {
  localStorage.setItem("sportbook_user", JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem("sportbook_user");
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem("sportbook_token");
  localStorage.removeItem("sportbook_user");
  window.location.href = "login.html";
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const mot_de_passe = document.getElementById("password").value.trim();

    if (!email || !mot_de_passe) {
      showAuthMessage("Veuillez remplir tous les champs.", "error");
      return;
    }

    try {
      showAuthMessage("Connexion en cours...", "success");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, mot_de_passe })
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthMessage(data.message || "Erreur lors de la connexion.", "error");
        return;
      }

      saveToken(data.token);
      saveUser(data.user);

      showAuthMessage("Connexion réussie. Redirection...", "success");

      setTimeout(() => {
        window.location.href = "terrains.html";
      }, 1200);
    } catch (error) {
      console.error("Erreur login :", error);
      showAuthMessage("Impossible de contacter le serveur.", "error");
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const nom = `${firstName} ${lastName}`.trim();

    const email = document.getElementById("email").value.trim();
    const mot_de_passe = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!firstName || !lastName || !email || !mot_de_passe || !confirmPassword) {
      showAuthMessage("Veuillez remplir tous les champs.", "error");
      return;
    }

    if (mot_de_passe !== confirmPassword) {
      showAuthMessage("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (mot_de_passe.length < 6) {
      showAuthMessage("Le mot de passe doit contenir au moins 6 caractères.", "error");
      return;
    }

    try {
      showAuthMessage("Inscription en cours...", "success");

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nom, email, mot_de_passe })
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthMessage(data.message || "Erreur lors de l'inscription.", "error");
        return;
      }

      showAuthMessage("Inscription réussie. Redirection vers la connexion...", "success");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } catch (error) {
      console.error("Erreur register :", error);
      showAuthMessage("Impossible de contacter le serveur.", "error");
    }
  });
}