const paymentForm = document.getElementById("payment-form");
const paymentMessage = document.getElementById("payment-message");

function showPaymentMessage(text, type) {
  if (!paymentMessage) return;
  paymentMessage.textContent = text;
  paymentMessage.className = "message " + type;
}

function getToken() {
  return localStorage.getItem("sportbook_token");
}

function getReservationIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("reservationId") || localStorage.getItem("selectedReservationId");
}

function loadReservationSummary() {
  const terrain = JSON.parse(localStorage.getItem("selectedTerrain"));
  const slot = localStorage.getItem("selectedSlot");

  if (!terrain) return;

  const summaryTerrain = document.getElementById("summary-terrain");
  const summarySport = document.getElementById("summary-sport");
  const summaryDate = document.getElementById("summary-date");
  const summarySlot = document.getElementById("summary-slot");
  const summaryPrice = document.getElementById("summary-price");

  if (summaryTerrain) summaryTerrain.textContent = `${terrain.nom} - ${terrain.ville}`;
  if (summarySport) summarySport.textContent = terrain.sport;
  if (summaryDate) summaryDate.textContent = slot ? slot.split("•")[0].trim() : "-";
  if (summarySlot) summarySlot.textContent = slot || "-";
  if (summaryPrice) summaryPrice.textContent = `${terrain.prix} €`;
}

function formatCardNumber(value) {
  return value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
}

function formatDate(value) {
  value = value.replace(/\D/g, "");
  if (value.length >= 3) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  return value;
}

const cardNumberInput = document.getElementById("card-number");
const cardDateInput = document.getElementById("card-date");

if (cardNumberInput) {
  cardNumberInput.addEventListener("input", function () {
    this.value = formatCardNumber(this.value).slice(0, 19);
  });
}

if (cardDateInput) {
  cardDateInput.addEventListener("input", function () {
    this.value = formatDate(this.value).slice(0, 5);
  });
}

if (paymentForm) {
  paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = getToken();
    const reservationId = getReservationIdFromUrl();

    const cardName = document.getElementById("card-name").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const cardDate = document.getElementById("card-date").value.trim();
    const cardCvv = document.getElementById("card-cvv").value.trim();

    if (!token) {
      showPaymentMessage("Vous devez être connecté pour payer.", "error");
      return;
    }

    if (!reservationId) {
      showPaymentMessage("Aucune réservation à payer.", "error");
      return;
    }

    if (!cardName || !cardNumber || !cardDate || !cardCvv) {
      showPaymentMessage("Veuillez remplir tous les champs de paiement.", "error");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16) {
      showPaymentMessage("Le numéro de carte semble incomplet.", "error");
      return;
    }

    if (cardCvv.length < 3) {
      showPaymentMessage("Le CVV semble invalide.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/paiements/${reservationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          moyen_paiement: "carte"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showPaymentMessage(data.message || "Erreur lors du paiement.", "error");
        return;
      }

      showPaymentMessage("Paiement validé avec succès. Votre réservation est confirmée.", "success");

      localStorage.removeItem("selectedReservationId");
      localStorage.removeItem("selectedTerrain");
      localStorage.removeItem("selectedSlot");

      setTimeout(() => {
        window.location.href = "reservations.html";
      }, 1500);
    } catch (error) {
      console.error("Erreur paiement :", error);
      showPaymentMessage("Impossible de contacter le serveur.", "error");
    }
  });
}

loadReservationSummary();