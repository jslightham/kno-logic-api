const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database schema for a password reset
let Reset = new Schema({
    userId: {
        type: String
    },
    PIN: {
        type: Number
    },
    date: {
        type: Date
    }
}, {
    collection: 'resets'
});

module.exports = mongoose.model('Reset', Reset);
