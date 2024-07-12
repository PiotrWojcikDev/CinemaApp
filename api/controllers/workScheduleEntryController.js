const WorkScheduleEntry = require('../models/WorkScheduleEntry');
const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/success');

class WorkScheduleEntryController {
    async getAllWorkScheduleEntries(req, res, next) {
        try {
            const entries = await WorkScheduleEntry.find({})
                .populate('firstEmployee', 'firstName lastName')
                .populate('secondEmployee', 'firstName lastName');
            return next(CreateSuccess(200, "Wszystkie wpisy pracy: ", entries));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }
    
    async addWorkScheduleEntry(req, res, next) {
        try {
            const newEntry = new WorkScheduleEntry(req.body);
            await newEntry.save();
            return next(CreateSuccess(200, "Dodano wpis pracy z powodzeniem!"));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }
    
    async updateWorkScheduleEntry(req, res, next) {
        try {
            const updatedEntry = await WorkScheduleEntry.findByIdAndUpdate(
                req.params.id,
                { 
                    firstEmployee: req.body.firstEmployee,
                    secondEmployee: req.body.secondEmployee,
                },
                { new: true, fields: ['firstEmployee', 'secondEmployee'] }
            );
            if (!updatedEntry)
                return next(CreateError(404, "Wpis nie został znaleziony!"));
            
            return next(CreateSuccess(200, "Pomyślnie zmieniono wpis pracy!"));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }
}



module.exports = WorkScheduleEntryController;