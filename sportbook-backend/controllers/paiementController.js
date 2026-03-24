const pool = require('../db');

const createPaiement = async (req, res) => {
  const client = await pool.connect();

  try {
    const { reservationId } = req.params;
    const { moyen_paiement } = req.body;
    const utilisateur_id = req.user.id;

    await client.query('BEGIN');

    const reservationResult = await client.query(
      `
      SELECT
        r.*,
        t.prix_heure
      FROM reservations r
      JOIN terrains t ON r.terrain_id = t.id
      WHERE r.id = $1 AND r.utilisateur_id = $2
      FOR UPDATE
      `,
      [reservationId, utilisateur_id]
    );

    if (reservationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    const reservation = reservationResult.rows[0];

    const paiementExiste = await client.query(
      `
      SELECT id
      FROM paiements
      WHERE reservation_id = $1
      `,
      [reservationId]
    );

    if (paiementExiste.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Paiement déjà effectué pour cette réservation' });
    }

    const paiementResult = await client.query(
      `
      INSERT INTO paiements (reservation_id, montant, statut, moyen_paiement)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        reservationId,
        reservation.prix_heure,
        'valide',
        moyen_paiement || 'carte'
      ]
    );

    await client.query(
      `
      UPDATE reservations
      SET statut = 'confirmee'
      WHERE id = $1
      `,
      [reservationId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Paiement effectué avec succès',
      paiement: paiementResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur createPaiement :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    client.release();
  }
};

module.exports = {
  createPaiement
};