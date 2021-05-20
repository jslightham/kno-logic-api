const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database schema for a session
let Session = new Schema({
    userId: {
        type: String
    },
    sessionId: {
        type: String
    },
    date: {
        type: Date
    }
}, {
    collection: 'sessions'
});

module.exports = mongoose.model('Session', Session);
