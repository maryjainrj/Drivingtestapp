const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: {
        type: String, 
        required: true
    },
    time: {
        type: String, 
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isTimeSlotAvailable: {
        type: Boolean,
        default: true
    },
    userId: {    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    }
});
appointmentSchema.pre('save', async function (next) {
    if (!this.userId) {
      this.isTimeSlotAvailable = true;   // Make slot available again if no user
    }
    next();
  });
  
module.exports = mongoose.model('Appointment', appointmentSchema);