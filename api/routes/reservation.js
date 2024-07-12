const express = require('express');
const ReservationController = require('../controllers/reservationController');
const checkToken = require('../utils/checkToken');

const router = express.Router();
const reservationController = new ReservationController();

//Get all reservations
router.get('/getAll', checkToken, (req, res, next) => reservationController.getAllReservations(req, res, next));

//Adding reservation
router.post('/', checkToken, (req, res, next) => reservationController.addReservation(req, res, next));

//Deleting reservation
router.delete('/:id', checkToken, (req, res, next) => reservationController.deleteReservation(req, res, next));


module.exports = router;