const express = require('express');
const UserController = require('../controllers/userController');
const checkToken = require('../utils/checkToken');

const router = express.Router();
const userController = new UserController();


router.get('/:id', checkToken, (req, res, next) => userController.getUserById(req, res, next));

router.get('/:id/reservations', checkToken, (req, res, next) => userController.getUserReservations(req, res, next));



module.exports = router; 