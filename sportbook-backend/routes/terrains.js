const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const {
  getAllTerrains,
  getTerrainById,
  getCreneauxByTerrainId,
  createTerrain,
  updateTerrain,
  deleteTerrain
} = require('../controllers/terrainController');

router.get('/', getAllTerrains);
router.get('/:id', getTerrainById);
router.get('/:id/creneaux', getCreneauxByTerrainId);

router.post('/', authMiddleware, isAdmin, createTerrain);
router.put('/:id', authMiddleware, isAdmin, updateTerrain);
router.delete('/:id', authMiddleware, isAdmin, deleteTerrain);

module.exports = router;