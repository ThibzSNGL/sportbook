const pool = require('../db');

const createReservation = async (req, res) => {
  const client = await pool.connect();

  try {
    const { terrain_id, creneau_id } = req.body;
    const utilisateur_id = req.user.id;

    if (!terrain_id || !creneau_id) {
      return res.status(400).json({ message: 'terrain_id et creneau_id sont requis' });
    }

    await client.query('BEGIN');

    const creneauResult = await client.query(
      `
      SELECT id, terrain_id, disponible
      FROM creneaux
      WHERE id = $1
      FOR UPDATE
      `,
      [creneau_id]
    );

    if (creneauResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Créneau introuvable' });
    }

    const creneau = creneauResult.rows[0];

    if (Number(creneau.terrain_id) !== Number(terrain_id)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Le créneau ne correspond pas au terrain' });
    }

    if (!creneau.disponible) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Créneau déjà réservé' });
    }

    const reservationResult = await client.query(
      `
      INSERT INTO reservations (utilisateur_id, terrain_id, creneau_id, statut)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [utilisateur_id, terrain_id, creneau_id, 'en_attente']
    );

    await client.query(
      `
      UPDATE creneaux
      SET disponible = FALSE
      WHERE id = $1
      `,
      [creneau_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: reservationResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur createReservation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    client.release();
  }
};

const getMyReservations = async (req, res) => {
  try {
    const utilisateur_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.statut,
        r.created_at,
        t.nom AS terrain_nom,
        t.sport,
        t.localisation,
        t.prix_heure,
        c.id AS creneau_id,
        c.date,
        c.heure_debut,
        c.heure_fin
      FROM reservations r
      JOIN terrains t ON r.terrain_id = t.id
      JOIN creneaux c ON r.creneau_id = c.id
      WHERE r.utilisateur_id = $1
      ORDER BY c.date, c.heure_debut
      `,
      [utilisateur_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getMyReservations :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const cancelReservation = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const utilisateur_id = req.user.id;

    await client.query('BEGIN');

    const reservationResult = await client.query(
      `
      SELECT *
      FROM reservations
      WHERE id = $1 AND utilisateur_id = $2
      FOR UPDATE
      `,
      [id, utilisateur_id]
    );

    if (reservationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    const reservation = reservationResult.rows[0];

    await client.query(
      `
      DELETE FROM reservations
      WHERE id = $1
      `,
      [id]
    );

    await client.query(
      `
      UPDATE creneaux
      SET disponible = TRUE
      WHERE id = $1
      `,
      [reservation.creneau_id]
    );

    await client.query('COMMIT');

    res.json({ message: 'Réservation annulée avec succès' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur cancelReservation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    client.release();
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation
};