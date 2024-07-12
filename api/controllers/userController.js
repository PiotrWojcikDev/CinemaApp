const User = require('../models/User');
const Reservation = require('../models/Reservation');
const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/error');


class UserController {
    async getUserById(req, res, next) {
        try {
            const user = await User.findById({_id: req.params.id});
            if(!user) 
                return next(CreateError(404, "Nieznaleziono takiego użytkownika!"));
    
            return next(CreateSuccess(200, "Użytkownik:", user));
        } catch (error) {
          return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }

    async getUserReservations(req, res, next)  {
        try {
            const userId = req.params.id;
            const reservations = await Reservation.find({ user: userId })
            .populate('user', 'firstName lastName')
            .populate({
                path: 'seance',
                select: 'movie dateOfSeance',
                populate: {
                    path: 'movie',
                    select: 'title'
                }
            })
            .sort({ 'seance.dateOfSeance': 1 });
            return next(CreateSuccess(200, "Rezerwacje użytkownika:", reservations));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }
}





module.exports = UserController;