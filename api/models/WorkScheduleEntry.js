const mongoose = require('mongoose');

const workScheduleEntrySchema = new mongoose.Schema(
  {
    dayOfWeek: String, 
    timeSlot: String, 
    firstEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    secondEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  }
);

module.exports = mongoose.model('WorkScheduleEntry', workScheduleEntrySchema);

