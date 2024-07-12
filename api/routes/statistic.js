const express = require('express');
const StatisticController = require('../controllers/statisticController');
const checkToken = require('../utils/checkToken');

const router = express.Router();
const statisticController = new StatisticController();

router.get('/monthlyReservationsSummary', (req, res, next) => statisticController.getMonthlyReserervationsSummary(req, res, next));

router.get('/mostViewedGenres', (req, res, next) => statisticController.getMostViewedGenres(req, res, next));

router.get('/mostViewedMovies', checkToken, (req, res, next) => statisticController.getMostViewedMovies(req, res, next));


module.exports = router;