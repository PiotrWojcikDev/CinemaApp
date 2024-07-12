const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const checkToken = require('../utils/checkToken');

const router = express.Router();
const employeeController = new EmployeeController();

//Get all employees
router.get('/getAll', checkToken, (req, res, next) => employeeController.getAllEmployees(req, res, next));

//Adding new employee
router.post('/', checkToken, (req, res, next) => employeeController.addEmployee(req, res, next));

//Updating employee salary
router.put('/:id', checkToken, (req, res, next) => employeeController.updateEmployeeSalary(req, res, next));

//Deleting employee
router.delete('/:id', checkToken, (req, res, next) => employeeController.deleteEmployee(req, res, next));


module.exports = router; 
