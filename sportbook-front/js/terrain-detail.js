function getToken() {
  return localStorage.getItem("sportbook_token");
}

function getTerrainIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"), 10);
}

let currentTerrain = null;

async function loadTerrainDetail() {
  const terrainId = getTerrainIdFromUrl();

  if (!terrainId) {
    alert("Terrain introuvable.");
    return;
  }

  const detailImage = document.getElementById("terrainImage");
  const detailName = document.getElementById("terrainName");
  const detailSport = document.getElementById("terrainSport");
  const detailCity = document.getElementById("terrainCity");
  const detailPrice = document.getElementById("terrainPrice");
  const detailDescription = document.getElementById("terrainDescription");
  const detailType = document.getElementById("terrainType");
  const slotsContainer = document.getElementById("slotList");
  const detailMessage = document.getElementById("detailMessage");

  try {
    const [terrainResponse, creneauxResponse] = await Promise.all([
      fetch(`${API_URL}/terrains/${terrainId}`),
      fetch(`${API_URL}/terrains/${terrainId}/creneaux`)
    ]);

    const terrainData = await terrainResponse.json();
    const creneauxData = await creneauxResponse.json();

    if (!terrainResponse.ok) {
      alert(terrainData.message || "Terrain introuvable.");
      return;
    }

    currentTerrain = {
      id: terrainData.id,
      nom: terrainData.nom,
      sport: terrainData.sport,
      ville: terrainData.localisation,
      prix: parseFloat(terrainData.prix_heure),
      image: terrainData.image_url || "img/terrain1.jpg",
      description: terrainData.description || "Aucune description disponible."
    };

    if (detailImage) detailImage.src = currentTerrain.image;
    if (detailName) detailName.textContent = currentTerrain.nom;
    if (detailSport) detailSport.textContent = currentTerrain.sport;
    if (detailCity) detailCity.textContent = currentTerrain.ville;
    if (detailPrice) detailPrice.textContent = `${currentTerrain.prix} € / heure`;
    if (detailDescription) detailDescription.textContent = currentTerrain.description;
    if (detailType) detailType.textContent = currentTerrain.sport;

    if (slotsContainer) {
      const availableSlots = Array.isArray(creneauxData)
        ? creneauxData.filter(creneau => creneau.disponible)
        : [];

      if (!availableSlots.length) {
        slotsContainer.innerHTML = "<p>Aucun créneau disponible pour ce terrain.</p>";
        return;
      }

      slotsContainer.innerHTML = availableSlots.map(creneau => {
        const label = `${creneau.date} • ${creneau.heure_debut.slice(0, 5)} - ${creneau.heure_fin.slice(0, 5)}`;
        return `
          <div class="slot-item">
            <div class="slot-info">
              <strong>${creneau.date}</strong>
              <span>${creneau.heure_debut.slice(0, 5)} - ${creneau.heure_fin.slice(0, 5)}</span>
            </div>
            <button class="reserve-slot-btn" data-id="${creneau.id}" data-label="${label}">
              Réserver
            </button>
          </div>
        `;
      }).join("");

      const reserveButtons = document.querySelectorAll(".reserve-slot-btn");

      reserveButtons.forEach(btn => {
        btn.addEventListener("click", async function () {
          const token = getToken();

          if (!token) {
            alert("Vous devez être connecté pour réserver.");
            window.location.href = "login.html";
            return;
          }

          const creneauId = parseInt(this.dataset.id, 10);
          const slotLabel = this.dataset.label;

          try {
            const response = await fetch(`${API_URL}/reservations`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                terrain_id: currentTerrain.id,
                creneau_id: creneauId
              })
            });

            const data = await response.json();

            if (!response.ok) {
              if (detailMessage) {
                detailMessage.textContent = data.message || "Erreur lors de la réservation.";
                detailMessage.className = "message error";
              }
              return;
            }

            localStorage.setItem("selectedReservationId", data.reservation.id);
            localStorage.setItem("selectedTerrain", JSON.stringify(currentTerrain));
            localStorage.setItem("selectedSlot", slotLabel || "");

            if (detailMessage) {
              detailMessage.textContent = "Réservation créée. Redirection vers le paiement...";
              detailMessage.className = "message success";
            }

            setTimeout(() => {
              window.location.href = "paiement.html";
            }, 1000);
          } catch (error) {
            console.error("Erreur réservation :", error);
            if (detailMessage) {
              detailMessage.textContent = "Impossible de contacter le serveur.";
              detailMessage.className = "message error";
            }
          }
        });
      });
    }
  } catch (error) {
    console.error("Erreur loadTerrainDetail :", error);
    alert("Erreur lors du chargement du terrain.");
  }
}

loadTerrainDetail();