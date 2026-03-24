const terrains = [
{
id: 1,
nom: "Five Arena",
sport: "Football",
ville: "Paris 13",
prix: 25,
image: "img/terrain1.jpg",
description: "Un terrain de football moderne et accessible pour vos matchs entre amis."
},
{
id: 2,
nom: "Padel Club",
sport: "Padel",
ville: "Cergy",
prix: 18,
image: "img/terrain2.jpg",
description: "Des installations récentes pour des sessions de padel dynamiques."
},
{
id: 3,
nom: "Basket Center",
sport: "Basketball",
ville: "Créteil",
prix: 20,
image: "img/terrain3.jpg",
description: "Un terrain indoor parfait pour vos entraînements et matchs."
},
{
id: 4,
nom: "Tennis Park",
sport: "Tennis",
ville: "Nanterre",
prix: 22,
image: "img/terrain1.jpg",
description: "Réservez votre court de tennis en quelques clics."
}
];

const terrainsContainer = document.getElementById("terrains-list");
const searchInput = document.getElementById("search");
const sportFilter = document.getElementById("sport-filter");
const cityFilter = document.getElementById("city-filter");

function renderTerrains(list) {
if (!terrainsContainer) return;

if (list.length === 0) {
terrainsContainer.innerHTML = `
<div class="empty-state">
<h3>Aucun terrain trouvé</h3>
<p>Essayez de modifier vos filtres pour voir plus de résultats.</p>
</div>
`;
return;
}

terrainsContainer.innerHTML = list.map(terrain => `
<div class="terrain-card">
<img src="${terrain.image}" alt="${terrain.nom}">
<div class="terrain-card-content">
<div class="terrain-badge">${terrain.sport}</div>
<h3>${terrain.nom}</h3>
<p>${terrain.description}</p>
<div class="terrain-meta">
<span>${terrain.ville}</span>
<span>${terrain.prix} € / heure</span>
</div>
<a href="terrain-detail.html?id=${terrain.id}" class="btn btn-primary">Voir le détail</a>
</div>
</div>
`).join("");
}

function filterTerrains() {
let filtered = [...terrains];

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

if (searchInput) {
searchInput.addEventListener("input", filterTerrains);
}

if (sportFilter) {
sportFilter.addEventListener("change", filterTerrains);
}

if (cityFilter) {
cityFilter.addEventListener("input", filterTerrains);
}

renderTerrains(terrains);