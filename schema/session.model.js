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
    },
    type: {
        type: Number // 0 for sessionID, 1 for refresh token
    }
}, {
    collection: 'sessions'
});

module.exports = mongoose.model('Session', Session);
