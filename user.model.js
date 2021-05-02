const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database schema for a user
let User = new Schema({
    email: {
        type: String
    },
    name: {
        type: String
    },
    password: {
        type: String
    }
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', User);
