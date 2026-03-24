const reservationsContainer = document.getElementById("reservations-list");

let fakeReservations = [
{
id: 1,
terrain: "Five Arena",
sport: "Football",
date: "25 mars 2026",
slot: "18:00 - 19:00",
price: "25 €",
status: "Confirmée"
},
{
id: 2,
terrain: "Padel Club",
sport: "Padel",
date: "28 mars 2026",
slot: "20:00 - 21:00",
price: "18 €",
status: "En attente"
}
];

function renderReservations() {
if (!reservationsContainer) return;

if (fakeReservations.length === 0) {
reservationsContainer.innerHTML = `
<div class="empty-state">
<h3>Aucune réservation</h3>
<p>Vous n’avez encore aucune réservation sur SportBook.</p>
<a href="terrains.html" class="btn btn-primary">Voir les terrains</a>
</div>
`;
return;
}

reservationsContainer.innerHTML = fakeReservations.map(reservation => `
<div class="reservation-card">
<div class="reservation-top">
<div>
<div class="reservation-badge">${reservation.sport}</div>
<h3>${reservation.terrain}</h3>
</div>
<div class="reservation-status">${reservation.status}</div>
</div>

<div class="reservation-info">
<div><strong>Date :</strong> ${reservation.date}</div>
<div><strong>Créneau :</strong> ${reservation.slot}</div>
<div><strong>Prix :</strong> ${reservation.price}</div>
</div>

<div class="reservation-actions">
<a href="paiement.html" class="btn btn-outline">Voir le paiement</a>
<button class="btn btn-primary cancel-btn" data-id="${reservation.id}">Annuler</button>
</div>
</div>
`).join("");

const cancelButtons = document.querySelectorAll(".cancel-btn");

cancelButtons.forEach(btn => {
btn.addEventListener("click", function() {
const reservationId = parseInt(this.dataset.id);
fakeReservations = fakeReservations.filter(r => r.id !== reservationId);
renderReservations();
});
});
}

renderReservations();