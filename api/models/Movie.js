const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        yearOfProduction: {
            type: String,
            required: true
        },
        director: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: "*Brak opisu*",
            trim: true
        },
        movieGenre: {
            type: String,
            enum: ["Komedia", "Thriller", "Dramat", "Przygodowy", "Western", "Sci-Fi", "Akcja"],
            required: true
        },
        image: {
            type: String,
            //default: ""
        }
    }
);

module.exports = mongoose.model('Movie', MovieSchema);