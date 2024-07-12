const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/error');
const Movie = require('../models/Movie'); // Import modelu Movie
const Seance = require('../models/Seance'); // Import modelu Movie
const Reservation = require('../models/Reservation'); // Import modelu Reservation


const monthsMap = {
    "01": "styczeń",
    "02": "luty",
    "03": "marzec",
    "04": "kwiecień",
    "05": "maj",
    "06": "czerwiec",
    "07": "lipiec",
    "08": "sierpień",
    "09": "wrzesień",
    "10": "październik",
    "11": "listopad",
    "12": "grudzień"
};


class StatisticController {
    async getMonthlyReserervationsSummary(req, res, next) {
        try {
            const currentYear = new Date().getFullYear(); // Pobierz bieżący rok
            // Utwórz listę miesięcy, które chcesz uwzględnić
            const orderedMonths = Object.keys(monthsMap)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(month => ({
                month: monthsMap[month],
                monthNumber: parseInt(month),
                count: 0
            }));
            
            Reservation.aggregate([
                {
                    $lookup: {
                        from: 'seances',
                        localField: 'seance',
                        foreignField: '_id',
                        as: 'seanceDetails'
                    }
                },
                {
                    $unwind: "$seanceDetails"
                },
                {
                    $match: {
                        "seanceDetails.dateOfSeance": {
                            $lt: new Date(`${currentYear}-01-01T00:00:00.000Z`) // Filtrowanie rezerwacji sprzed początku bieżącego roku
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$seanceDetails.dateOfSeance" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ])
            .exec()
            .then(result => {
                const monthlyReservationCounts = orderedMonths.map(monthItem => {
                    const match = result.find(item => item._id === monthItem.monthNumber);
                    return {
                        month: monthItem.month,
                        count: match ? match.count : 0
                    };
                });
    
                return next(CreateSuccess(200, "Liczba rezerwacji w poszczególnych miesiącach: ", monthlyReservationCounts));
            })
            .catch(err => {
                console.error(err);
            });
        } catch (error) {
            console.log(error)
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async getMostViewedGenres(req, res, next) {
        try {
            const genreCounts = await Reservation.aggregate([
                {
                    $lookup: {
                        from: 'seances', // Nazwa kolekcji Seance w bazie danych
                        localField: 'seance',
                        foreignField: '_id',
                        as: 'seanceInfo'
                    }
                },
                {
                    $unwind: '$seanceInfo'
                },
                {
                    $lookup: {
                        from: 'movies', // Nazwa kolekcji Movie w bazie danych
                        localField: 'seanceInfo.movie',
                        foreignField: '_id',
                        as: 'movieInfo'
                    }
                },
                {
                    $unwind: '$movieInfo'
                },
                {
                    $group: {
                        _id: '$movieInfo.movieGenre',
                        count: { $sum: 1 },
                        minDate: { $min: '$seanceInfo.dateOfSeance' },  
                        maxDate: { $max: '$seanceInfo.dateOfSeance' }  
                    }
                },
                {
                    $project: {
                        _id: 0,
                        genre: '$_id',
                        count: 1,
                        minDate: 1,
                        maxDate: 1
                    }
                }
            ]);
            genreCounts.sort((a, b) => b.count - a.count);

            const allMinDates = genreCounts.map(movie => movie.minDate);
            const allMaxDates = genreCounts.map(movie => movie.maxDate);

            const globalMinDate = new Date(Math.min(...allMinDates));
            const globalMaxDate = new Date(Math.max(...allMaxDates));

            const result = {
                genreCounts,
                globalMinDate,
                globalMaxDate
            };

            return next(CreateSuccess(200, "Gatunki i liczba rezerwacji: ", result));
    
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async getMostViewedMovies(req, res, next) {
        try {
            const top5Movies = await Reservation.aggregate([
                {
                    $lookup: {
                        from: 'seances', // Kolekcja Seance w bazie danych
                        localField: 'seance',
                        foreignField: '_id',
                        as: 'seanceInfo'
                    }
                },
                {
                    $unwind: '$seanceInfo'
                },
                {
                    $lookup: {
                        from: 'movies', // Kolekcja Movie w bazie danych
                        localField: 'seanceInfo.movie',
                        foreignField: '_id',
                        as: 'movieInfo'
                    }
                },
                {
                    $unwind: '$movieInfo'
                },
                {
                    $group: {
                        _id: '$movieInfo._id',
                        title: { $first: '$movieInfo.title' },
                        count: { $sum: 1 },
                        minDate: { $min: '$seanceInfo.dateOfSeance' },  
                        maxDate: { $max: '$seanceInfo.dateOfSeance' }  
                
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                },
                {
                    $project: {
                        _id: 0,
                        title: 1,
                        count: 1,
                        minDate: 1,
                        maxDate: 1
                    }
                }
            ]);
            const allMinDates = top5Movies.map(movie => movie.minDate);
            const allMaxDates = top5Movies.map(movie => movie.maxDate);

            const globalMinDate = new Date(Math.min(...allMinDates));
            const globalMaxDate = new Date(Math.max(...allMaxDates));

            const result = {
                top5Movies,
                globalMinDate,
                globalMaxDate
            };

            return next(CreateSuccess(200, "Top 5 filmów według gatunku: ", result));
    
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    
    };
}

module.exports = StatisticController;