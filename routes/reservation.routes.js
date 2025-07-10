const express = require('express');
const reservationController = require('../controllers/reservation.controller');

const router = express.Router();

router.post('/', reservationController.createReservation);
router.post('/verify', reservationController.getReservation);

module.exports = router;
