const mongoose = require('mongoose');

const SeanceSchema = mongoose.Schema(
    {
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Movie"
        },
        price: {
            type: Number,
            default: 20.00,
        },
        dateOfSeance: {
            type: Date,
            required: true,
        },
        room: {
            type: Number,
            required: true,
            enum: [1, 2, 3, 4, 5, 6]
        }
    }
);
module.exports = mongoose.model('Seance', SeanceSchema);