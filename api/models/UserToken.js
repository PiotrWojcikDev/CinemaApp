const mongoose = require('mongoose');
const uuid = require('uuid');

// const TokenSchema = mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: "User"
//     },
//     token: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         expires: 300
//     }
// });

const TokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        default: () => uuid.v4(), // Generowanie unikalnego tokena UUID
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});


module.exports = mongoose.model("Token", TokenSchema);