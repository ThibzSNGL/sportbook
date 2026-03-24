INSERT INTO utilisateurs (nom, email, mot_de_passe, role)
VALUES
('Admin SportBook', 'admin@sportbook.com', '$2b$10$123456789012345678901uQzK6G7w8e9rT0yU1iO2pA3sD4fG5h6', 'admin');

INSERT INTO terrains (nom, sport, description, localisation, prix_heure, image_url)
VALUES
('Five Paris 13', 'Football', 'Terrain de football indoor 5v5', 'Paris', 25.00, 'https://example.com/five.jpg'),
('Padel Arena Créteil', 'Padel', 'Terrain de padel moderne', 'Créteil', 18.00, 'https://example.com/padel.jpg'),
('Basket Center Ivry', 'Basketball', 'Terrain indoor pour matchs et entraînements', 'Ivry-sur-Seine', 20.00, 'https://example.com/basket.jpg');

INSERT INTO creneaux (terrain_id, date, heure_debut, heure_fin, disponible)
VALUES
(1, '2026-03-25', '18:00:00', '19:00:00', TRUE),
(1, '2026-03-25', '19:00:00', '20:00:00', TRUE),
(1, '2026-03-26', '20:00:00', '21:00:00', TRUE),

(2, '2026-03-25', '17:00:00', '18:00:00', TRUE),
(2, '2026-03-25', '18:00:00', '19:00:00', TRUE),
(2, '2026-03-26', '19:00:00', '20:00:00', TRUE),

(3, '2026-03-25', '16:00:00', '17:00:00', TRUE),
(3, '2026-03-26', '18:00:00', '19:00:00', TRUE),
(3, '2026-03-26', '19:00:00', '20:00:00', TRUE);