const Movie = require('../models/Movie');
const Seance = require('../models/Seance');
const Reservation = require('../models/Reservation');
const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/success');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    },
});
const upload = multer({ storage: storage });


class MovieController {
    async addMovie(req, res, next) {
      try {
          if (!req.file) {
            return next(CreateError(400, "Nie załączono zdjęć!"));
          }
          const imagePath = `http://localhost:${process.env.SERVER_PORT}/uploads/` + req.file.filename;
          const movie = new Movie({ 
            title: req.body.title,
            yearOfProduction: req.body.yearOfProduction,
            director: req.body.director,
            description: req.body.description,
            movieGenre: req.body.movieGenre,
            image: imagePath
          });
          await movie.save();
          return next(CreateSuccess(201, "Dodano film"));
        } catch (error) {
          return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async getAllMovies(req, res, next) {
      try {
          const movies = await Movie.find({}).sort({ title: 1 });
          return next(CreateSuccess(200, "Wszystkie filmy: ", movies));
      } catch (error) {
        return next(CreateError(500, "Wewnętrzny błąd serwera!"));
      }
    };
    
    async getMovieById(req, res, next) {
        try {
            const movie = await Movie.findById({_id: req.params.id});
            if(!movie) 
                return next(CreateError(404, "Nieznaleziono takiego filmu!"));
    
            return next(CreateSuccess(200, "Film:", movie));
        } catch (error) {
          return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };
    
    async getMovieSeances(req, res, next) {
        try {
            const movieId = req.params.id;
            const seances = await Seance.find({movie: movieId});
            return next(CreateSuccess(200, "Lista seansów na film: ", seances));
    
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };
}

module.exports = {
    MovieController,
    upload
};