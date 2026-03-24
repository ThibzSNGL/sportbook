const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const {
  createReservation,
  getMyReservations,
  cancelReservation
} = require('../controllers/reservationController');

router.post('/', authMiddleware, createReservation);
router.get('/me', authMiddleware, getMyReservations);
router.delete('/:id', authMiddleware, cancelReservation);

module.exports = router;