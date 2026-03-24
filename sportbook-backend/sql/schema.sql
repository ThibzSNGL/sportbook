DROP TABLE IF EXISTS paiements CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS creneaux CASCADE;
DROP TABLE IF EXISTS terrains CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE terrains (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    description TEXT,
    localisation VARCHAR(150) NOT NULL,
    prix_heure NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creneaux (
    id SERIAL PRIMARY KEY,
    terrain_id INTEGER NOT NULL REFERENCES terrains(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    terrain_id INTEGER NOT NULL REFERENCES terrains(id) ON DELETE CASCADE,
    creneau_id INTEGER NOT NULL REFERENCES creneaux(id) ON DELETE CASCADE,
    statut VARCHAR(30) DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paiements (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    montant NUMERIC(10,2) NOT NULL,
    statut VARCHAR(30) DEFAULT 'en_attente',
    moyen_paiement VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);