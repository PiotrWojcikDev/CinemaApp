const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
        },
        salary: {
            type: Number
        }, 
        password: {
            type: String,
            required: true,
        },
        role : {
            type: String,
            enum: ['Buyer', 'Employee', 'Owner'],
            default: 'Buyer',
        },
    }
);

module.exports = mongoose.model('User', UserSchema);