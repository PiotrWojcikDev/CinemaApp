const mongoose = require('mongoose');

const ReservationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        type: {
            type: String,
            enum: ["Normalny", "Ulgowy"],
            required: true,
        },
        seatNumber: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        finalPrice: {
            type: Number,
            required: true
        },
        seance: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Seance"
        }
    }
);

module.exports = mongoose.model('Reservation', ReservationSchema);