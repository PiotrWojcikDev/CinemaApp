const express = require('express');
const SeanceController = require('../controllers/seanceController');
const checkToken = require('../utils/checkToken');

const router = express.Router();
const seanceController = new SeanceController();

//Get all seances
router.get('/getAll', (req, res, next) => seanceController.getAllSeances(req, res, next));

router.get('/:id', (req, res, next) => seanceController.getSeanceById(req, res, next));


router.get('/:seanceId/seats', (req, res, next) => seanceController.getReservedSeatsForSeance(req, res, next));

//Adding new seance
router.post('/', (req, res, next) => seanceController.addSeance(req, res, next));

//Updating seance price
router.put('/:id', (req, res, next) => seanceController.updateSeancePrice(req, res, next));

router.delete('/:id', (req, res, next) => seanceController.deleteSeance(req, res, next));


module.exports = router; 