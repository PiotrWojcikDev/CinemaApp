const express = require('express');
const WorkScheduleEntryController = require('../controllers/workScheduleEntryController')
const checkToken = require('../utils/checkToken');
const router  = express.Router();
const workScheduleEntryController = new WorkScheduleEntryController();

// Get all work schedule entries
router.get('/getAll', (req, res, next) => workScheduleEntryController.getAllWorkScheduleEntries(req, res, next));

// Add work schedule entry
router.post('/', checkToken, (req, res, next) => workScheduleEntryController.addWorkScheduleEntry(req, res, next));

// Update work schedule entry
router.put('/:id', checkToken, (req, res, next) => workScheduleEntryController.updateWorkScheduleEntry(req, res, next));


module.exports = router; 