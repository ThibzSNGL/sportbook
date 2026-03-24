const reservationsContainer = document.getElementById("reservations-list");

function getToken() {
  return localStorage.getItem("sportbook_token");
}

async function loadReservations() {
  const token = getToken();

  if (!token) {
    if (reservationsContainer) {
      reservationsContainer.innerHTML = `
        <div class="empty-state">
          <h3>Connexion requise</h3>
          <p>Vous devez être connecté pour voir vos réservations.</p>
          <a href="login.html" class="btn btn-primary">Se connecter</a>
        </div>
      `;
    }
    return;
  }

  try {
    const response = await fetch(`${API_URL}/reservations/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      reservationsContainer.innerHTML = "<p>Impossible de charger vos réservations.</p>";
      return;
    }

    renderReservations(data);
  } catch (error) {
    console.error("Erreur loadReservations :", error);
    reservationsContainer.innerHTML = "<p>Erreur serveur lors du chargement des réservations.</p>";
  }
}

function renderReservations(reservations) {
  if (!reservationsContainer) return;

  if (!reservations.length) {
    reservationsContainer.innerHTML = `
      <div class="empty-state">
        <h3>Aucune réservation</h3>
        <p>Vous n’avez encore aucune réservation sur SportBook.</p>
        <a href="terrains.html" class="btn btn-primary">Voir les terrains</a>
      </div>
    `;
    return;
  }

  reservationsContainer.innerHTML = reservations.map(reservation => `
    <div class="reservation-card">
      <div class="reservation-top">
        <div>
          <div class="reservation-badge">${reservation.sport}</div>
          <h3>${reservation.terrain_nom}</h3>
        </div>
        <div class="reservation-status">${reservation.statut}</div>
      </div>

      <div class="reservation-info">
        <div><strong>Ville :</strong> ${reservation.localisation}</div>
        <div><strong>Date :</strong> ${reservation.date}</div>
        <div><strong>Créneau :</strong> ${reservation.heure_debut.slice(0, 5)} - ${reservation.heure_fin.slice(0, 5)}</div>
        <div><strong>Prix :</strong> ${reservation.prix_heure} €</div>
      </div>

      <div class="reservation-actions">
        ${reservation.statut !== "confirmee" ? `<a href="paiement.html?reservationId=${reservation.id}" class="btn btn-outline">Voir le paiement</a>` : ""}
        <button class="btn btn-primary cancel-btn" data-id="${reservation.id}">Annuler</button>
      </div>
    </div>
  `).join("");

  const cancelButtons = document.querySelectorAll(".cancel-btn");

  cancelButtons.forEach(btn => {
    btn.addEventListener("click", async function () {
      const token = getToken();
      const reservationId = this.dataset.id;

      if (!confirm("Voulez-vous vraiment annuler cette réservation ?")) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Erreur lors de l'annulation.");
          return;
        }

        loadReservations();
      } catch (error) {
        console.error("Erreur annulation :", error);
        alert("Impossible de contacter le serveur.");
      }
    });
  });
}

loadReservations();