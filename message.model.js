const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database schema for an email message
let Message = new Schema({
    name: {
        type: String
    },
    subject: {
        type: String
    },
    body: {
        type: String
    }
}, {
    collection: 'messages'
});

module.exports = mongoose.model('Message', Message);
