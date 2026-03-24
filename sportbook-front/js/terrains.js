const terrainsContainer = document.getElementById("terrainsList");
const searchInput = document.getElementById("searchInput");
const sportFilter = document.getElementById("sportFilter");
const cityFilter = document.getElementById("cityFilter");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");

let allTerrains = [];

function normalizeTerrain(terrain) {
  return {
    id: terrain.id,
    nom: terrain.nom,
    sport: terrain.sport,
    ville: terrain.localisation,
    prix: parseFloat(terrain.prix_heure),
    image: terrain.image_url || "img/terrain1.jpg",
    description: terrain.description || "Aucune description disponible."
  };
}

function renderTerrains(list) {
  if (!terrainsContainer) return;

  if (resultsCount) {
    resultsCount.textContent = list.length;
  }

  if (!list.length) {
    terrainsContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  terrainsContainer.innerHTML = list.map(terrain => `
    <div class="terrain-card">
      <div class="terrain-image">
        <img src="${terrain.image}" alt="${terrain.nom}">
      </div>
      <div class="terrain-body">
        <div class="terrain-top">
          <h3>${terrain.nom}</h3>
          <div class="price-badge">${terrain.prix} € / h</div>
        </div>

        <div class="terrain-meta">
          <span class="meta-chip">${terrain.sport}</span>
          <span class="meta-chip">${terrain.ville}</span>
        </div>

        <p class="terrain-desc">${terrain.description}</p>

        <div class="terrain-actions">
          <a href="terrain-detail.html?id=${terrain.id}" class="btn btn-primary">Voir le détail</a>
        </div>
      </div>
    </div>
  `).join("");
}

function filterTerrains() {
  let filtered = [...allTerrains];

  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const sportValue = sportFilter ? sportFilter.value.trim().toLowerCase() : "";
  const cityValue = cityFilter ? cityFilter.value.trim().toLowerCase() : "";

  if (searchValue) {
    filtered = filtered.filter(terrain =>
      terrain.nom.toLowerCase().includes(searchValue) ||
      terrain.sport.toLowerCase().includes(searchValue) ||
      terrain.ville.toLowerCase().includes(searchValue)
    );
  }

  if (sportValue) {
    filtered = filtered.filter(terrain =>
      terrain.sport.toLowerCase() === sportValue
    );
  }

  if (cityValue) {
    filtered = filtered.filter(terrain =>
      terrain.ville.toLowerCase().includes(cityValue)
    );
  }

  renderTerrains(filtered);
}

async function loadTerrains() {
  try {
    terrainsContainer.innerHTML = "<p>Chargement des terrains...</p>";

    const response = await fetch(`${API_URL}/terrains`);
    const data = await response.json();

    if (!response.ok) {
      terrainsContainer.innerHTML = "<p>Impossible de charger les terrains.</p>";
      return;
    }

    allTerrains = data.map(normalizeTerrain);
    renderTerrains(allTerrains);
  } catch (error) {
    console.error("Erreur loadTerrains :", error);
    terrainsContainer.innerHTML = "<p>Erreur serveur lors du chargement des terrains.</p>";
  }
}

if (searchInput) {
  searchInput.addEventListener("input", filterTerrains);
}

if (sportFilter) {
  sportFilter.addEventListener("change", filterTerrains);
}

if (cityFilter) {
  cityFilter.addEventListener("input", filterTerrains);
}

loadTerrains();