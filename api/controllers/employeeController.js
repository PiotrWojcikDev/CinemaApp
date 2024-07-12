const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/error');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const WorkScheduleEntry = require('../models/WorkScheduleEntry');


class EmployeeController {
    async getAllEmployees(req, res, next) {
        try {
            const employees = await User.find({ role: 'Employee' });
            return next(CreateSuccess(200, "Wszyscy pracownicy:", employees));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }

    async addEmployee(req, res, next) {
        try {
            const salt = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newEmployee = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                salary: req.body.salary,
                email: req.body.email,
                password: hashedPassword,
                role: 'Employee'
            });
            await newEmployee.save();
    
            return next(CreateSuccess(200, "Dodano pracownika!"));
    
        } catch (error) {
            if (error.code === 11000) { //błąd unikalności
                return next(CreateError(400, "Użytkownik o podanym mailu już istnieje!"));
            } else {
                return next(CreateError(500, "Wewnętrzny błąd serwera!"));
            }
        }
    }

    async updateEmployeeSalary(req, res, next) {
        try {
            const updatedEmployee = await User.findByIdAndUpdate(
                { _id: req.params.id},
                { salary: req.body.salary },
                { new: true }
            );        
            if (!updatedEmployee) 
                return next(CreateError(404, "Pracownik nie został znaleziony!"));
            
            return next(CreateSuccess(200, "Pomyślnie zmieniono pensje pracownika na: " + updatedEmployee.salary));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    };

    async deleteEmployee(req, res, next) {
        try {
            const employeeToRemove = await User.findByIdAndDelete(req.params.id);
            if(!employeeToRemove) 
                return next(CreateError(404, "Podany użytkownik nie istnieje"));     
            const emptyEmployee = await User.findOne({ lastName: 'Pracownik' });
            const workScheduleEntriesOfDeletedEmployee = await WorkScheduleEntry.find({
                $or: [
                    { firstEmployee: req.params.id },
                    { secondEmployee: req.params.id }
                ]
            });
    
            for(entry of workScheduleEntriesOfDeletedEmployee) {
                if(entry.firstEmployee == req.params.id) {
                    console.log(typeof entry.firstEmployee)
                    console.log(emptyEmployee._id);
    
                    const workUpdated = await WorkScheduleEntry.findByIdAndUpdate(
                        entry._id,  
                        { firstEmployee: emptyEmployee._id },
                        { new: true }
                    );
                    console.log(workUpdated)
                } else {
                    await WorkScheduleEntry.findByIdAndUpdate(
                        entry._id, 
                        { secondEmployee: emptyEmployee._id },
                        { new: true }
                    );
                }
            }
            
            return next(CreateSuccess(200, "Pomyślnie usunięto pracownika: ", employeeToRemove.firstName + ' ' + employeeToRemove.lastName));
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }
}


module.exports = EmployeeController;