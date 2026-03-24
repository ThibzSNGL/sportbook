const pool = require('../db');

const getAllTerrains = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nom, sport, description, localisation, prix_heure, image_url, created_at
      FROM terrains
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getAllTerrains :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getTerrainById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT id, nom, sport, description, localisation, prix_heure, image_url, created_at
      FROM terrains
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Terrain introuvable' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur getTerrainById :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getCreneauxByTerrainId = async (req, res) => {
  try {
    const { id } = req.params;

    const terrainExists = await pool.query(
      'SELECT id FROM terrains WHERE id = $1',
      [id]
    );

    if (terrainExists.rows.length === 0) {
      return res.status(404).json({ message: 'Terrain introuvable' });
    }

    const result = await pool.query(
      `
      SELECT id, terrain_id, date, heure_debut, heure_fin, disponible
      FROM creneaux
      WHERE terrain_id = $1
      ORDER BY date, heure_debut
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getCreneauxByTerrainId :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const createTerrain = async (req, res) => {
  try {
    const {
      nom,
      sport,
      description,
      localisation,
      prix_heure,
      image_url
    } = req.body;

    if (!nom || !sport || !localisation || !prix_heure) {
      return res.status(400).json({
        message: 'nom, sport, localisation et prix_heure sont obligatoires'
      });
    }

    const result = await pool.query(
      `
      INSERT INTO terrains (nom, sport, description, localisation, prix_heure, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [nom, sport, description || null, localisation, prix_heure, image_url || null]
    );

    res.status(201).json({
      message: 'Terrain créé avec succès',
      terrain: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur createTerrain :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateTerrain = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      sport,
      description,
      localisation,
      prix_heure,
      image_url
    } = req.body;

    const terrainExists = await pool.query(
      'SELECT * FROM terrains WHERE id = $1',
      [id]
    );

    if (terrainExists.rows.length === 0) {
      return res.status(404).json({ message: 'Terrain introuvable' });
    }

    const terrainActuel = terrainExists.rows[0];

    const result = await pool.query(
      `
      UPDATE terrains
      SET
        nom = $1,
        sport = $2,
        description = $3,
        localisation = $4,
        prix_heure = $5,
        image_url = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        nom ?? terrainActuel.nom,
        sport ?? terrainActuel.sport,
        description ?? terrainActuel.description,
        localisation ?? terrainActuel.localisation,
        prix_heure ?? terrainActuel.prix_heure,
        image_url ?? terrainActuel.image_url,
        id
      ]
    );

    res.json({
      message: 'Terrain mis à jour avec succès',
      terrain: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur updateTerrain :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteTerrain = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM terrains WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Terrain introuvable' });
    }

    res.json({ message: 'Terrain supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteTerrain :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllTerrains,
  getTerrainById,
  getCreneauxByTerrainId,
  createTerrain,
  updateTerrain,
  deleteTerrain
};