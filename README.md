# SportBook

SportBook est une application web de réservation de terrains sportifs réalisée dans le cadre d’un projet UML.  
Elle permet à un utilisateur de consulter des terrains, visualiser les créneaux disponibles, effectuer une réservation, payer en ligne et gérer ses réservations.  
Une partie administrateur permet également de gérer les terrains.

---

## Fonctionnalités principales

### Côté utilisateur
- Inscription
- Connexion
- Consultation des terrains
- Consultation du détail d’un terrain
- Affichage des créneaux disponibles
- Réservation d’un créneau
- Paiement d’une réservation
- Consultation de ses réservations
- Annulation d’une réservation

### Côté administrateur
- Ajout d’un terrain
- Modification d’un terrain
- Suppression d’un terrain

---

## Stack technique

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Base de données
- PostgreSQL

### Déploiement
- Render

---

## Structure du projet

```bash
sportbook/
│
├── sportbook-backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── sql/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
└── sportbook-front/
    ├── img/
    ├── js/
    │   ├── config.js
    │   ├── auth.js
    │   ├── terrains.js
    │   ├── terrain-detail.js
    │   ├── reservations.js
    │   └── paiement.js
    ├── index.html
    ├── login.html
    ├── register.html
    ├── terrains.html
    ├── terrain-detail.html
    ├── reservations.html
    └── paiement.html