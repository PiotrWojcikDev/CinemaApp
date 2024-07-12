const express = require('express');
const { MovieController, upload } = require('../controllers/movieController');
const checkToken = require('../utils/checkToken');

const router  = express.Router();
const movieController = new MovieController();

//Get all movies
router.get('/getAll', (req, res, next) => movieController.getAllMovies(req, res, next));

//Get single movie
router.get('/:id', (req, res, next) => movieController.getMovieById(req, res, next));

router.get('/:id/seances', (req, res, next) => movieController.getMovieSeances(req, res, next));


//Adding new movie
router.post('/', checkToken, upload.single('image'), (req, res, next) => movieController.addMovie(req, res, next));


module.exports = router; 