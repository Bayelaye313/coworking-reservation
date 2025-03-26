const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Middleware d'authentification à implémenter
const auth = require('../middleware/auth');

// Routes publiques
router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservation);

// Routes protégées
router.post('/', reservationController.createReservation);
router.put('/:id', auth, reservationController.updateReservation);
router.patch('/:id/cancel', auth, reservationController.cancelReservation);

module.exports = router;
