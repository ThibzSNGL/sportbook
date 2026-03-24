const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { createPaiement } = require('../controllers/paiementController');

router.post('/:reservationId', authMiddleware, createPaiement);

module.exports = router;