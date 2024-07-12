const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/error');
const Reservation = require('../models/Reservation');
const { sendDeleteReservationConfirmation } = require('../utils/mailHandler');


class ReservationController {
    async addReservation(req, res, next) {
        try {
            const seanceId = req.body.seance;
            const selectedSeat = +req.body.seatNumber;
            const reservationsForSeance = await Reservation.find({seance: seanceId});
            const reservedSeats = reservationsForSeance.map(reservation => reservation.seatNumber);
    
            if(reservedSeats.includes(selectedSeat)) 
                return next(CreateError(409, "Podane miejsce jest już zajęte!"));
    
            const newReservation = new Reservation(req.body);
            await newReservation.save();
            return next(CreateSuccess(200, "Dodano rezerwację z powodzeniem!"));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async getAllReservations(req, res, next) {
        try {
            console.log('test');
            const reservations = await Reservation.find({})
            .populate('user', 'firstName lastName')
            .populate({
                path: 'seance',
                select: 'movie dateOfSeance',
                populate: {
                    path: 'movie',
                    select: 'title'
                }
            });
    
            return next(CreateSuccess(200, "Wszystkie rezerwacje: ", reservations));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async deleteReservation(req, res, next) {
        try {
            const reservation = req.body;
            const reservationToRemove = await Reservation.findByIdAndDelete(req.params.id);
            if(!reservationToRemove) 
                return next(CreateError(404, "Podana rezerwacja nie istnieje"));
          
            await sendDeleteReservationConfirmation(reservation);
    
            return next(CreateSuccess(200, "Pomyślnie usunięto rezerwację: "));
        } catch (error) {
            console.log(error)
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }
}


module.exports = ReservationController;