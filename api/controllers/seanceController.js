const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/error');
const Seance = require('../models/Seance');
const Reservation = require('../models/Reservation');
const ReservationController = require('./reservationController');

class SeanceController {
    async addSeance(req, res, next) {
        try {
            const combinedDateTime = new Date(`${req.body.dateOfSeance}T${req.body.time}`);
            const newSeance = new Seance({
                movie: req.body.movie,
                dateOfSeance: combinedDateTime,
                room: req.body.room
            });
            await newSeance.save();
            return next(CreateSuccess(200, "Dodano seans z powodzeniem!"));
        } catch (error) {
            console.log(error);
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async getAllSeances(req, res, next) {
        try {
            const seances = await Seance.find({})
                .populate('movie', 'title yearOfProduction');
            return next(CreateSuccess(200, "Wszystkie seanse: ", seances));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async getSeanceById(req, res, next) {
        try {
            const seance = await Seance.findById({_id: req.params.id});
            if(!seance) 
                return next(CreateError(404, "Nieznaleziono takiego seansu!"));
    
            return next(CreateSuccess(200, "Seance:", seance));
        } catch (error) {
          return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async getReservedSeatsForSeance(req, res, next) {
        try {
            const seanceId = req.params.seanceId;
            const reservationsForSeance = await Reservation.find({seance: seanceId});
            const reservedSeats = reservationsForSeance.map(reservation => reservation.seatNumber);
            
            return next(CreateSuccess(200, "Lista zajętych siedzeń:", reservedSeats));
        } catch (error) {
          return next(CreateError(500, "Wewnętrzny błąd serwera!"));
    
        }
    };

    async updateSeancePrice(req, res, next) {
        try {
    
            const updatedSeance = await Seance.findByIdAndUpdate(
                { _id: req.params.id},
                { price: req.body.price },
                { new: true }
            );        
            console.log(updatedSeance);
            if (!updatedSeance) 
                return next(CreateError(404, "Seans nie został znaleziony!"));
            
            return next(CreateSuccess(200, "Pomyślnie zmieniono cenę seansu na: " + updatedSeance.price));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async deleteSeance(req, res, next) {
        try {
            const seanceToRemove = await Seance.findByIdAndDelete(req.params.id);
            if(!seanceToRemove) 
                return next(CreateError(404, "Podany seans nie istnieje"));
            
            return next(CreateSuccess(200, "Pomyślnie usunięto seans: ", seanceToRemove._id));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };
}

module.exports = SeanceController;