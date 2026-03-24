const fakeTerrains = [
{
id: 1,
nom: "Five Arena",
sport: "Football",
ville: "Paris 13",
prix: 25,
image: "img/terrain1.jpg",
description: "Un terrain moderne, spacieux et idéal pour organiser vos matchs entre amis dans de très bonnes conditions."
},
{
id: 2,
nom: "Padel Club",
sport: "Padel",
ville: "Cergy",
prix: 18,
image: "img/terrain2.jpg",
description: "Un espace moderne pensé pour les amateurs de padel, avec une réservation rapide et simple."
},
{
id: 3,
nom: "Basket Center",
sport: "Basketball",
ville: "Créteil",
prix: 20,
image: "img/terrain3.jpg",
description: "Un terrain de basket accessible et agréable pour vos matchs et entraînements."
},
{
id: 4,
nom: "Tennis Park",
sport: "Tennis",
ville: "Nanterre",
prix: 22,
image: "img/terrain1.jpg",
description: "Réservez facilement votre terrain de tennis selon les créneaux disponibles."
}
];

const fakeSlots = [
"09:00 - 10:00",
"10:00 - 11:00",
"14:00 - 15:00",
"16:00 - 17:00",
"18:00 - 19:00",
"20:00 - 21:00"
];

function getTerrainIdFromUrl() {
const params = new URLSearchParams(window.location.search);
return parseInt(params.get("id")) || 1;
}

function renderTerrainDetail() {
const terrainId = getTerrainIdFromUrl();
const terrain = fakeTerrains.find(t => t.id === terrainId) || fakeTerrains[0];

const detailImage = document.getElementById("detail-image");
const detailName = document.getElementById("detail-name");
const detailSport = document.getElementById("detail-sport");
const detailCity = document.getElementById("detail-city");
const detailPrice = document.getElementById("detail-price");
const detailDescription = document.getElementById("detail-description");
const slotsContainer = document.getElementById("slots-list");

if (detailImage) detailImage.src = terrain.image;
if (detailName) detailName.textContent = terrain.nom;
if (detailSport) detailSport.textContent = terrain.sport;
if (detailCity) detailCity.textContent = terrain.ville;
if (detailPrice) detailPrice.textContent = terrain.prix + " € / heure";
if (detailDescription) detailDescription.textContent = terrain.description;

if (slotsContainer) {
slotsContainer.innerHTML = fakeSlots.map(slot => `
<button class="slot-btn" data-slot="${slot}">
${slot}
</button>
`).join("");

const slotButtons = document.querySelectorAll(".slot-btn");
slotButtons.forEach(btn => {
btn.addEventListener("click", function() {
slotButtons.forEach(b => b.classList.remove("active"));
this.classList.add("active");

localStorage.setItem("selectedTerrain", JSON.stringify(terrain));
localStorage.setItem("selectedSlot", this.dataset.slot);
});
});
}
}

const reserveButton = document.getElementById("reserve-btn");

if (reserveButton) {
reserveButton.addEventListener("click", function() {
const selectedSlot = localStorage.getItem("selectedSlot");

if (!selectedSlot) {
alert("Veuillez sélectionner un créneau avant de continuer.");
return;
}

window.location.href = "paiement.html";
});
}

renderTerrainDetail();