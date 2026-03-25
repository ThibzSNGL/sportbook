const adminMessage = document.getElementById("admin-message");
const accessDenied = document.getElementById("access-denied");
const adminContent = document.getElementById("admin-content");

const terrainForm = document.getElementById("terrain-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const terrainsAdminList = document.getElementById("terrains-admin-list");
const logoutBtn = document.getElementById("logout-btn");

const terrainIdInput = document.getElementById("terrain-id");
const nomInput = document.getElementById("nom");
const sportInput = document.getElementById("sport");
const localisationInput = document.getElementById("localisation");
const prixHeureInput = document.getElementById("prix_heure");
const imageUrlInput = document.getElementById("image_url");
const descriptionInput = document.getElementById("description");

function showAdminMessage(text, type) {
  if (!adminMessage) return;
  adminMessage.textContent = text;
  adminMessage.className = "message " + type;
}

function getToken() {
  return localStorage.getItem("sportbook_token");
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

function isAdmin() {
  const user = getUser();
  return user && user.role === "admin";
}

function resetForm() {
  terrainIdInput.value = "";
  nomInput.value = "";
  sportInput.value = "";
  localisationInput.value = "";
  prixHeureInput.value = "";
  imageUrlInput.value = "";
  descriptionInput.value = "";

  formTitle.textContent = "Ajouter un terrain";
  submitBtn.textContent = "Ajouter le terrain";
  cancelEditBtn.style.display = "none";
}

function fillFormForEdit(terrain) {
  terrainIdInput.value = terrain.id;
  nomInput.value = terrain.nom || "";
  sportInput.value = terrain.sport || "";
  localisationInput.value = terrain.localisation || "";
  prixHeureInput.value = terrain.prix_heure || "";
  imageUrlInput.value = terrain.image_url || "";
  descriptionInput.value = terrain.description || "";

  formTitle.textContent = "Modifier le terrain";
  submitBtn.textContent = "Mettre à jour le terrain";
  cancelEditBtn.style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTerrains(terrains) {
  if (!terrainsAdminList) return;

  if (!terrains.length) {
    terrainsAdminList.innerHTML = "<p>Aucun terrain disponible.</p>";
    return;
  }

  terrainsAdminList.innerHTML = terrains.map(terrain => `
    <div class="terrain-admin-card" data-id="${terrain.id}">
      <h3>${terrain.nom}</h3>

      <div class="terrain-admin-meta">
        <span class="meta-chip">${terrain.sport}</span>
        <span class="meta-chip">${terrain.localisation}</span>
        <span class="meta-chip">${terrain.prix_heure} € / h</span>
      </div>

      <p><strong>Description :</strong> ${terrain.description || "Aucune description"}</p>
      <p><strong>Image :</strong> ${terrain.image_url || "Aucune image"}</p>

      <div class="terrain-admin-actions">
        <button class="edit-btn" data-id="${terrain.id}">Modifier</button>
        <button class="delete-btn" data-id="${terrain.id}">Supprimer</button>
      </div>
    </div>
  `).join("");

  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach(btn => {
    btn.addEventListener("click", async function () {
      const terrainId = this.dataset.id;
      await loadTerrainForEdit(terrainId);
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", async function () {
      const terrainId = this.dataset.id;
      await deleteTerrain(terrainId);
    });
  });
}

async function loadTerrains() {
  try {
    const response = await fetch(`${API_URL}/terrains`);
    const data = await response.json();

    if (!response.ok) {
      showAdminMessage("Impossible de charger les terrains.", "error");
      return;
    }

    renderTerrains(data);
  } catch (error) {
    console.error("Erreur loadTerrains :", error);
    showAdminMessage("Erreur serveur lors du chargement des terrains.", "error");
  }
}

async function loadTerrainForEdit(id) {
  try {
    const response = await fetch(`${API_URL}/terrains/${id}`);
    const data = await response.json();

    if (!response.ok) {
      showAdminMessage(data.message || "Terrain introuvable.", "error");
      return;
    }

    fillFormForEdit(data);
  } catch (error) {
    console.error("Erreur loadTerrainForEdit :", error);
    showAdminMessage("Erreur serveur lors du chargement du terrain.", "error");
  }
}

async function createTerrain(payload) {
  const token = getToken();

  const response = await fetch(`${API_URL}/terrains`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return response.json().then(data => ({ ok: response.ok, data }));
}

async function updateTerrain(id, payload) {
  const token = getToken();

  const response = await fetch(`${API_URL}/terrains/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return response.json().then(data => ({ ok: response.ok, data }));
}

async function deleteTerrain(id) {
  const token = getToken();

  const confirmDelete = confirm("Voulez-vous vraiment supprimer ce terrain ?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/terrains/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      showAdminMessage(data.message || "Erreur lors de la suppression.", "error");
      return;
    }

    showAdminMessage("Terrain supprimé avec succès.", "success");
    resetForm();
    loadTerrains();
  } catch (error) {
    console.error("Erreur deleteTerrain :", error);
    showAdminMessage("Impossible de contacter le serveur.", "error");
  }
}

if (terrainForm) {
  terrainForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = terrainIdInput.value.trim();

    const payload = {
      nom: nomInput.value.trim(),
      sport: sportInput.value.trim(),
      localisation: localisationInput.value.trim(),
      prix_heure: parseFloat(prixHeureInput.value),
      image_url: imageUrlInput.value.trim(),
      description: descriptionInput.value.trim()
    };

    if (!payload.nom || !payload.sport || !payload.localisation || isNaN(payload.prix_heure)) {
      showAdminMessage("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    try {
      let result;

      if (id) {
        result = await updateTerrain(id, payload);
      } else {
        result = await createTerrain(payload);
      }

      if (!result.ok) {
        showAdminMessage(result.data.message || "Erreur lors de l'enregistrement.", "error");
        return;
      }

      showAdminMessage(
        id ? "Terrain mis à jour avec succès." : "Terrain ajouté avec succès.",
        "success"
      );

      resetForm();
      loadTerrains();
    } catch (error) {
      console.error("Erreur submit terrain :", error);
      showAdminMessage("Impossible de contacter le serveur.", "error");
    }
  });
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", function () {
    resetForm();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

function initAdminPage() {
  const token = getToken();
  const user = getUser();

  if (!token || !user || user.role !== "admin") {
    if (accessDenied) accessDenied.style.display = "block";
    if (adminContent) adminContent.style.display = "none";
    return;
  }

  if (accessDenied) accessDenied.style.display = "none";
  if (adminContent) adminContent.style.display = "block";

  loadTerrains();
}

initAdminPage();